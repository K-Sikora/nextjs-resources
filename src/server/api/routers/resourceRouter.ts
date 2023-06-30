import { clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
const filterUserInfo = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
};
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { TRPCError } from "@trpc/server";
// Limit to 10 requests per 5 minutes
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "5 m"),
  analytics: true,

  prefix: "@upstash/ratelimit",
});

export const resourceRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const resources = await ctx.prisma.nextResource.findMany({
      include: {
        tags: true,
      },
      orderBy: {
        likesCount: "desc",
      },
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: resources.map((resource) => resource.authorId),
      })
    ).map(filterUserInfo);

    return resources.map((resource) => ({
      resource,
      author: users.find((user) => user.id === resource.authorId),
    }));
  }),

  getByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const { name } = input;

      const resources = await ctx.prisma.nextResource.findMany({
        where: {
          OR: [
            { title: { contains: name } },
            { tags: { some: { name: { contains: name } } } },
            { description: { contains: name } },
          ],
        },
        include: {
          tags: true,
        },
        orderBy: {
          likesCount: "desc",
        },
      });

      const users = (
        await clerkClient.users.getUserList({
          userId: resources.map((resource) => resource.authorId),
        })
      ).map(filterUserInfo);

      const resourcesWithAuthors = resources.map((resource) => {
        const author = users.find((user) => user.id === resource.authorId);
        return { resource, author };
      });

      return resourcesWithAuthors;
    }),

  create: privateProcedure
    .input(
      z.object({
        description: z.string().min(5).max(400),
        title: z.string().min(1).max(50),
        tags: z.string().min(5).max(100),
        link: z.string().min(1).max(50),
        category: z.enum([
          "Packages",
          "Tools",
          "Other",
          "Tutorials",
          "Starters",
          "UI_Libraries",
        ]),
        categorySlug: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { success } = await ratelimit.limit(authorId);
      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests, please wait 5 minutes and try again",
        });

      const tagArray = input.tags.split(",").map((tag) => tag.trim());

      const resource = await ctx.prisma.nextResource.create({
        data: {
          authorId: authorId,
          category: input.category,
          description: input.description,
          link: input.link,
          title: input.title,
          categorySlug: input.categorySlug,
          tags: {
            connectOrCreate: tagArray.map((tagName) => ({
              where: { name: tagName },
              create: { name: tagName },
            })),
          },
        },
        include: {
          tags: true,
        },
      });

      return resource;
    }),
});

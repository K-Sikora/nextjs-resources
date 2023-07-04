import { clerkClient } from "@clerk/nextjs";
import { type User } from "@clerk/nextjs/dist/types/server";
import { z } from "zod";
import { type GithubData } from "~/types/GithubData";
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

// Limit to 10 create requests per 5 minutes

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "5 m"),
  analytics: true,

  prefix: "@upstash/ratelimit",
});

// Limit to 20 update requests per 5 minutes

const ratelimitUpdate = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "5 m"),
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
  getSingle: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const resource = await ctx.prisma.nextResource.findUnique({
        where: {
          id,
        },
        include: {
          tags: true,
        },
      });

      if (!resource) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Resource not found",
        });
      }

      const users = await clerkClient.users.getUserList({
        userId: [resource.authorId],
      });
      const author = users.find((user) => user.id === resource.authorId);

      return {
        resource,
        author,
      };
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

  getByTag: publicProcedure
    .input(z.object({ tag: z.string() }))
    .query(async ({ ctx, input }) => {
      const { tag } = input;

      const resources = await ctx.prisma.nextResource.findMany({
        where: {
          tags: {
            some: {
              name: tag,
            },
          },
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
        link: z.string().min(1).max(250),
        githubLink: z.string().max(250),
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
      const url = input.githubLink;
      const urlWithoutProtocol = url.replace(/(^\w+:|^)\/\//, "");
      const path = urlWithoutProtocol.split("/").slice(1).join("/");
      const res = await fetch(`https://api.github.com/repos/${path}`, {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN || ""}`,
        },
      });
      const githubData = (await res.json()) as GithubData;
      const tagArray = input.tags
        .split(",")
        .map((tag) => tag.trim().replace(/\s+/g, ""))
        .filter((tag) => tag !== "");

      const resource = await ctx.prisma.nextResource.create({
        data: {
          authorId: authorId,
          category: input.category,
          description: input.description,
          link: input.link,
          githubLink: input.githubLink,
          title: input.title,
          githubAvatar:
            githubData.message === "Not Found"
              ? ""
              : githubData.owner.avatar_url,
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

  update: privateProcedure
    .input(
      z.object({
        resourceId: z.string(),
        description: z.string().min(5).max(400),
        title: z.string().min(1).max(50),
        tags: z.string().min(5).max(100),
        link: z.string().min(1).max(250),
        githubLink: z.string().max(250),
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

      const { success } = await ratelimitUpdate.limit(authorId);

      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests, please wait 5 minutes and try again",
        });
      const url = input.githubLink;
      const urlWithoutProtocol = url.replace(/(^\w+:|^)\/\//, "");
      const path = urlWithoutProtocol.split("/").slice(1).join("/");
      const res = await fetch(`https://api.github.com/repos/${path}`, {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN || ""}`,
        },
      });
      const githubData = (await res.json()) as GithubData;
      const {
        resourceId,
        description,
        title,
        tags,
        link,
        githubLink,
        category,
        categorySlug,
      } = input;

      const existingResource = await ctx.prisma.nextResource.findFirst({
        where: {
          id: resourceId,
          authorId: authorId,
        },
        include: {
          tags: true,
        },
      });

      if (!existingResource) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Resource not found or you don't have permission to edit it",
        });
      }

      const tagArray = tags.split(",").map((tag) => tag.trim());

      await ctx.prisma.nextResource.update({
        where: {
          id: resourceId,
        },
        data: {
          tags: {
            disconnect: existingResource.tags.map((tag) => ({
              id: tag.id,
            })),
          },
        },
      });

      const updatedResource = await ctx.prisma.nextResource.update({
        where: {
          id: resourceId,
        },
        data: {
          description: description,
          title: title,
          link: link,
          githubLink: githubLink,
          githubAvatar:
            githubData.message === "Not Found"
              ? ""
              : githubData.owner.avatar_url,
          category: category,
          categorySlug: categorySlug,
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

      return updatedResource;
    }),

  delete: privateProcedure
    .input(
      z.object({
        resourceId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { resourceId } = input;

      const existingResource = await ctx.prisma.nextResource.findFirst({
        where: {
          id: resourceId,
          authorId: authorId,
        },
      });

      if (!existingResource) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Resource not found or you don't have permission to delete it",
        });
      }

      const deletedResource = await ctx.prisma.nextResource.delete({
        where: {
          id: resourceId,
        },
      });

      return deletedResource;
    }),
});

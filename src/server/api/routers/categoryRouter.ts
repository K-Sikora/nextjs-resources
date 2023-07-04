import { clerkClient } from "@clerk/nextjs";
import { type User } from "@clerk/nextjs/dist/types/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
const filterUserInfo = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
};
export const categoryRouter = createTRPCRouter({
  getResourceByCategory: publicProcedure
    .input(
      z.object({
        category: z.enum([
          "packages",
          "tools",
          "other",
          "tutorials",
          "starters",
          "ui-libraries",
        ]),
      })
    )
    .query(async ({ ctx, input }) => {
      const resources = await ctx.prisma.nextResource.findMany({
        where: {
          categorySlug: input.category,
        },
        include: {
          tags: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const users = (
        await clerkClient.users.getUserList({
          userId: resources.map((resource) => resource.authorId),
        })
      ).map(filterUserInfo);

      if (!resources || resources.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No resources found",
        });
      }

      const resourcesWithAuthors = resources.map((resource) => {
        const author = users.find((user) => user.id === resource.authorId);
        return { resource, author };
      });

      return resourcesWithAuthors;
    }),
});

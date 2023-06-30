import { clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
const filterUserInfo = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
};
import { TRPCError } from "@trpc/server";

export const profileRouter = createTRPCRouter({
  getUserInfo: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }
      return filterUserInfo(user);
    }),

  getResourcesByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = input;

      const resources = await ctx.prisma.nextResource.findMany({
        where: {
          authorId: userId,
        },
        include: {
          tags: true,
        },
        orderBy: {
          createdAt: "asc",
        },
        take: 10,
      });

      const users = (
        await clerkClient.users.getUserList({
          userId: [userId],
        })
      ).map(filterUserInfo);

      const resourcesWithAuthors = resources.map((resource) => {
        const author = users.find((user) => user.id === resource.authorId);
        return { resource, author };
      });

      return resourcesWithAuthors;
    }),
});

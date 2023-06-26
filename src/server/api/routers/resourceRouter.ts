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
export const resourceRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const resources = await ctx.prisma.nextResource.findMany();
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
});

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
export const resourceRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const resources = await ctx.prisma.nextResource.findMany({
      orderBy: {
        createdAt: "desc",
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

  create: privateProcedure
    .input(
      z.object({
        description: z.string().min(5).max(400),
        title: z.string().min(1).max(50),
        tags: z.string().min(1).max(100),
        link: z.string().min(1).max(50),
        category: z.enum([
          "Package",
          "Tool",
          "Other",
          "Tutorial",
          "Starter",
          "UI_Library",
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorid = ctx.userId;
      const resource = await ctx.prisma.nextResource.create({
        data: {
          authorId: authorid,
          category: input.category,
          description: input.description,
          link: input.link,
          tags: input.tags,
          title: input.title,
        },
      });
    }),
});

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

export const popularRouter = createTRPCRouter({
  getPopularByCategory: publicProcedure
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
      const popularResources = await ctx.prisma.nextResource.findMany({
        take: 10,
        orderBy: {
          likesCount: "desc",
        },
        where: {
          categorySlug: input.category,
        },
      });
      return popularResources;
    }),
});

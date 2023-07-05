import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const popularRouter = createTRPCRouter({
  getPopularByCategory: publicProcedure
    .input(
      z.object({
        category: z.enum([
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
        take: 5,
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

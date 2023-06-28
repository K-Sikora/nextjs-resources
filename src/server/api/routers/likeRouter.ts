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
// limit to 5 requests per 5 minutes
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "5 m"),
  analytics: true,

  prefix: "@upstash/ratelimit",
});

export const likeRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        resourceId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { resourceId, userId } = input;

      const { success } = await ratelimit.limit(userId);
      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests, please wait 5 minutes and try again",
        });
      // check if there is resource with that id
      const resource = await ctx.prisma.nextResource.findUnique({
        where: {
          id: resourceId,
        },
      });

      if (!resource) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Zasób o podanym identyfikatorze nie istnieje",
        });
      }

      // check if already liked
      const existingLike = await ctx.prisma.like.findFirst({
        where: {
          resourceId,
          userId,
        },
      });

      if (existingLike) {
        // unlike if already liked
        await ctx.prisma.like.delete({
          where: {
            id: existingLike.id,
          },
        });

        // decrement by 1
        await ctx.prisma.nextResource.update({
          where: {
            id: resourceId,
          },
          data: {
            likesCount: {
              decrement: 1,
            },
          },
        });

        return { success: true, liked: false };
      } else {
        // add like
        await ctx.prisma.like.create({
          data: {
            resourceId,
            userId,
          },
        });

        // increment by 1
        await ctx.prisma.nextResource.update({
          where: {
            id: resourceId,
          },
          data: {
            likesCount: {
              increment: 1,
            },
          },
        });

        return { success: true, liked: true, id: resourceId };
      }
    }),
  check: privateProcedure
    .input(
      z.object({
        resourceId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const resourceId = input.resourceId;

      // check if there's a like for user
      const likedResource = await ctx.prisma.like.findFirst({
        where: {
          userId,
          resourceId,
        },
      });

      return !!likedResource;
    }),
});

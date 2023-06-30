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
// limit to 100 requests per 5 minutes
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "5 m"),
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
          message: "Resource not found",
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
  check: publicProcedure
    .input(
      z.object({
        resourceId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.userId) {
        return false; // user not logged in
      }

      const userId = ctx.userId;
      const resourceId = input.resourceId;

      // check if there's a like for the user
      const likedResource = await ctx.prisma.like.findFirst({
        where: {
          userId,
          resourceId,
        },
      });

      return !!likedResource;
    }),

  getLikedByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = input;

      const likedResources = await ctx.prisma.like.findMany({
        where: {
          userId,
        },
        include: {
          resource: {
            include: {
              tags: true,
            },
          },
        },
      });

      const resources = likedResources.map((like) => like.resource);

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
  getUserStats: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = input;

      const likeCount = await ctx.prisma.like.count({
        where: {
          userId,
        },
      });

      const createdCount = await ctx.prisma.nextResource.count({
        where: {
          authorId: userId,
        },
      });

      return {
        likeCount,
        createdCount,
      };
    }),
});

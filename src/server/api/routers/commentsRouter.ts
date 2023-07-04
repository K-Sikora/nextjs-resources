import { clerkClient } from "@clerk/nextjs";
import { type User } from "@clerk/nextjs/dist/types/server";
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

// Limit to 20 create requests per 5 minutes

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "5 m"),
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

export const commentsRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        resourceId: z.string(),
        content: z.string().max(400),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { resourceId, content } = input;
      const authorId = ctx.userId;

      if (!authorId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not authenticated",
        });
      }

      const { success } = await ratelimit.limit(authorId);
      if (!success) return new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const resource = await ctx.prisma.nextResource.findUnique({
        where: { id: resourceId },
      });

      if (!resource) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Resource not found",
        });
      }

      const comment = await ctx.prisma.comment.create({
        data: {
          resourceId,
          authorId,
          text: content,
        },
      });

      return comment;
    }),
  getAll: publicProcedure
    .input(
      z.object({
        resourceId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { resourceId } = input;

      const comments = await ctx.prisma.comment.findMany({
        where: {
          resourceId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const authorIds = Array.from(
        new Set(comments.map((comment) => comment.authorId))
      );

      const users = (
        await clerkClient.users.getUserList({
          userId: authorIds,
        })
      ).map(filterUserInfo);

      return comments.map((comment) => ({
        comment,
        author: users.find((user) => user.id === comment.authorId),
      }));
    }),

  updateComment: privateProcedure
    .input(
      z.object({
        commentId: z.string(),
        content: z.string().min(5).max(400),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { commentId, content } = z
        .object({
          commentId: z.string(),
          content: z.string().min(5).max(400),
        })
        .parse(input);

      const authorId = ctx.userId;

      if (!authorId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not authenticated",
        });
      }
      const { success } = await ratelimitUpdate.limit(authorId);
      if (!success) return new TRPCError({ code: "TOO_MANY_REQUESTS" });
      const comment = await ctx.prisma.comment.findUnique({
        where: {
          id: commentId,
        },
      });

      if (!comment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      if (comment.authorId !== authorId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to update this comment",
        });
      }

      const updatedComment = await ctx.prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          text: content,
        },
      });

      return updatedComment;
    }),

  deleteComment: privateProcedure
    .input(
      z.object({
        commentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { commentId } = z
        .object({
          commentId: z.string(),
        })
        .parse(input);

      const authorId = ctx.userId;

      if (!authorId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not authenticated",
        });
      }

      const comment = await ctx.prisma.comment.findUnique({
        where: {
          id: commentId,
        },
      });

      if (!comment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      if (comment.authorId !== authorId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to delete this comment",
        });
      }

      const deletedComment = await ctx.prisma.comment.delete({
        where: {
          id: commentId,
        },
      });

      return deletedComment;
    }),
});

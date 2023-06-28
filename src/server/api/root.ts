import { createTRPCRouter } from "~/server/api/trpc";
import { resourceRouter } from "./routers/resourceRouter";
import { categoryRouter } from "./routers/categoryRouter";
import { likeRouter } from "./routers/likeRouter";
import { popularRouter } from "./routers/popularRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  resource: resourceRouter,
  category: categoryRouter,
  like: likeRouter,
  popular: popularRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

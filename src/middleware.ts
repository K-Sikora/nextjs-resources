import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/resources",
    "/api/(.*)",
    /^\/resources\/(?!add).*$/, // Exclude "/resources/add" route
    "/user/(.*)",
    "/search",
    "/tag/(.*)",
    "/resource/(.*)",
    "/sign-in",
    "/sign-up",
    "/terms-and-conditions",
  ],
});
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

import { authMiddleware } from "@clerk/nextjs";
export default authMiddleware({
  // publicRoutes: ["/(.*)"],
  publicRoutes: ["/", "/resources", "/api/(.*)"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

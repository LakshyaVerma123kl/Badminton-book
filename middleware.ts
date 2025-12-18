import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Define Public Routes
const isPublicRoute = createRouteMatcher([
  "/", // Landing Page
  "/api(.*)", // API Routes
  "/sign-in(.*)", // Auth Pages
  "/sign-up(.*)", // Auth Pages
]);

// 2. Add 'async' here
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    // 3. Add 'await' here
    // We await the auth() promise to get the actual object, then call .protect()
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

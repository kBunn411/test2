import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: ["/", "/forget-password", "/api/webhooks/clerk"], // Specify the routes where this middleware should apply
};

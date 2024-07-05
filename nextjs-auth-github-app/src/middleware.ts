export { default } from "next-auth/middleware";

// applies next-auth only to matching routes - can be regex
export const config = { matcher: ["/profile"] };

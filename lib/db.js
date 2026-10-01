import { neon } from "@neondatabase/serverless";
export const sql = (...a) => neon(process.env.DATABASE_URL)(...a);
// India time (IST) so "today" matches the user's day
export const today = () => new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10);

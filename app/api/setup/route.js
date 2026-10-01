import { sql } from "@/lib/db";
export const dynamic = "force-dynamic";
export async function GET() {
  await sql`CREATE TABLE IF NOT EXISTS habits (id TEXT PRIMARY KEY, title TEXT NOT NULL, days INT NOT NULL, stake INT NOT NULL, owner TEXT NOT NULL, token TEXT NOT NULL, start_day TEXT NOT NULL)`;
  await sql`CREATE TABLE IF NOT EXISTS doubters (id SERIAL PRIMARY KEY, habit_id TEXT NOT NULL, name TEXT NOT NULL, stake INT NOT NULL)`;
  await sql`CREATE TABLE IF NOT EXISTS checkins (id SERIAL PRIMARY KEY, habit_id TEXT NOT NULL, day TEXT NOT NULL, ok BOOLEAN NOT NULL, note TEXT, UNIQUE (habit_id, day))`;
  return Response.json({ ok: true });
}

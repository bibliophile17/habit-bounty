import { sql } from "@/lib/db";
export async function POST(req, { params }) {
  const { name, stake } = await req.json();
  if (!name) return Response.json({ error: "name needed" }, { status: 400 });
  await sql`INSERT INTO doubters (habit_id, name, stake) VALUES (${params.id}, ${name.slice(0, 30)}, ${Math.min(+stake || 50, 1000)})`;
  return Response.json({ ok: true });
}

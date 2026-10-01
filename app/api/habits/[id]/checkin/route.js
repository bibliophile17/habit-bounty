import { sql, today } from "@/lib/db";
import { judge } from "@/lib/logic";
export async function POST(req, { params }) {
  const { token, image } = await req.json();
  const [h] = await sql`SELECT title, token FROM habits WHERE id = ${params.id}`;
  if (!h || h.token !== token) return Response.json({ error: "not your habit" }, { status: 403 });
  const v = await judge(h.title, image);
  if (v.ok) await sql`INSERT INTO checkins (habit_id, day, ok, note) VALUES (${params.id}, ${today()}, true, ${v.note}) ON CONFLICT DO NOTHING`;
  return Response.json(v);
}

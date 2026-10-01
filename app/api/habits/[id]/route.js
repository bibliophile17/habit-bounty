import { sql } from "@/lib/db";
import { compute } from "@/lib/logic";
export const dynamic = "force-dynamic";
export async function GET(_, { params }) {
  const [h] = await sql`SELECT id, title, days, stake, owner, start_day FROM habits WHERE id = ${params.id}`;
  if (!h) return Response.json({ error: "not found" }, { status: 404 });
  const doubters = await sql`SELECT name, stake FROM doubters WHERE habit_id = ${params.id} ORDER BY id`;
  const cs = await sql`SELECT day, ok, note FROM checkins WHERE habit_id = ${params.id} ORDER BY day DESC`;
  const pot = h.stake + doubters.reduce((a, d) => a + d.stake, 0);
  return Response.json({ ...h, doubters, pot, lastNote: cs[0]?.note || "", ...compute(h, cs) });
}

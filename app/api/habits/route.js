import { sql, today } from "@/lib/db";
export async function POST(req) {
  const { title, days, stake, owner } = await req.json();
  if (!title || !owner) return Response.json({ error: "missing fields" }, { status: 400 });
  const id = crypto.randomUUID().slice(0, 7), token = crypto.randomUUID();
  await sql`INSERT INTO habits VALUES (${id}, ${title.slice(0, 80)}, ${Math.min(+days || 14, 60)}, ${Math.min(+stake || 50, 1000)}, ${owner.slice(0, 30)}, ${token}, ${today()})`;
  return Response.json({ id, token });
}

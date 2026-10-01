import { today } from "./db";
const ROAST = ["Day {n}. The gym saw nothing. The biryani saw everything.", "Streak status: theoretical.", "Your Doubters are already planning the party."];
export function compute(h, cs) {
  const t = today(), ok = new Set(cs.filter(c => c.ok).map(c => c.day));
  const grid = []; let missed = 0;
  for (let i = 0; i < h.days; i++) {
    const d = new Date(Date.parse(h.start_day) + i * 864e5).toISOString().slice(0, 10);
    const s = ok.has(d) ? "ok" : d < t ? "miss" : d === t ? "today" : "future";
    if (s === "miss") missed++;
    grid.push({ day: d, s });
  }
  const done = ok.size;
  const state = missed > 1 ? "failed" : done >= h.days ? "won" : "active"; // 1 grace skip
  return { grid, missed, done, state, doneToday: ok.has(t), roast: missed ? ROAST[missed % ROAST.length].replace("{n}", done + missed) : "" };
}
export async function judge(title, image) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return { ok: true, note: "Demo mode: no AI key set, proof accepted." };
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 200, messages: [{ role: "user", content: [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: image } },
        { type: "text", text: `Habit: "${title}". Is this photo plausible proof the person did it today? Reply ONLY JSON: {"ok":boolean,"note":"one short playful sentence"}` }] }] })
    });
    const d = await r.json();
    return JSON.parse(d.content[0].text.replace(/```json|```/g, "").trim());
  } catch { return { ok: false, note: "Judge couldn't read that. Try a clearer photo." }; }
}

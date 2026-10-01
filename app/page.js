"use client";
import { useState } from "react";
export default function Home() {
  const [f, setF] = useState({ title: "", days: 14, stake: 50, owner: "" });
  const [busy, setBusy] = useState(false);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  async function go(e) {
    e.preventDefault(); setBusy(true);
    const r = await fetch("/api/habits", { method: "POST", body: JSON.stringify(f) });
    const { id, token } = await r.json();
    localStorage.setItem("hb:" + id, token);
    location.href = "/h/" + id;
  }
  return (<>
    <h1>Habit Bounty</h1><p className="sub">Declare a habit. Let your friends bet you'll quit.</p>
    <form className="card" onSubmit={go}>
      <input placeholder="Your name" value={f.owner} onChange={set("owner")} required />
      <input placeholder="Habit (e.g. gym every day)" value={f.title} onChange={set("title")} required />
      <input type="number" placeholder="Days" value={f.days} onChange={set("days")} min="3" max="60" />
      <input type="number" placeholder="Your stake (points)" value={f.stake} onChange={set("stake")} />
      <button disabled={busy}>{busy ? "Creating..." : "Start the bounty"}</button>
    </form>
    <p className="sub">Stakes are virtual points. Miss more than one day and your Doubters win the pot.</p>
  </>);
}

"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
async function shrink(file) {
  const img = await createImageBitmap(file), s = Math.min(1, 800 / img.width);
  const c = document.createElement("canvas"); c.width = img.width * s; c.height = img.height * s;
  c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.7).split(",")[1];
}
export default function Habit() {
  const { id } = useParams();
  const [h, setH] = useState(null), [token, setToken] = useState(null), [msg, setMsg] = useState("");
  const [name, setName] = useState(""), [stake, setStake] = useState(50);
  const load = () => fetch("/api/habits/" + id).then(r => r.json()).then(setH);
  useEffect(() => { setToken(localStorage.getItem("hb:" + id)); load(); }, [id]);
  async function checkin(e) {
    const file = e.target.files[0]; if (!file) return;
    setMsg("The AI judge is squinting at your photo...");
    const image = await shrink(file);
    const r = await fetch(`/api/habits/${id}/checkin`, { method: "POST", body: JSON.stringify({ token, image }) });
    const v = await r.json(); setMsg((v.ok ? "Accepted. " : "Rejected. ") + (v.note || v.error)); load();
  }
  async function doubt(e) {
    e.preventDefault();
    await fetch(`/api/habits/${id}/doubt`, { method: "POST", body: JSON.stringify({ name, stake }) });
    setName(""); load();
  }
  if (!h) return <p>Loading...</p>;
  if (h.error) return <p>Habit not found.</p>;
  const verdict = { active: "In progress", won: `${h.owner} wins the pot!`, failed: "Doubters win the pot." }[h.state];
  return (<>
    <h1>{h.owner}: {h.title}</h1>
    <p className="sub">{h.done}/{h.days} days done · {h.missed} missed</p>
    <div className="card"><div className="big">{h.pot} pts pot</div><div>{verdict}</div>
      {h.roast && <p className="roast">{h.roast}</p>}</div>
    <div className="card grid">{h.grid.map(g => <div key={g.day} className={"d " + g.s} title={g.day} />)}</div>
    {token && h.state === "active" && !h.doneToday && (
      <div className="card"><b>Today's proof</b>
        <input type="file" accept="image/*" capture="environment" onChange={checkin} /></div>)}
    {msg && <p>{msg}</p>}
    <div className="card"><b>Doubters ({h.doubters.length})</b>
      {h.doubters.map((d, i) => <div key={i}>{d.name} bets {d.stake} pts you'll quit</div>)}
      {h.state === "active" && !token && (
        <form onSubmit={doubt}>
          <input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
          <input type="number" value={stake} onChange={e => setStake(e.target.value)} />
          <button>Bet against {h.owner}</button></form>)}
    </div>
    <button className="alt" onClick={() => { navigator.clipboard.writeText(location.href); setMsg("Link copied. Send it to your Doubters."); }}>Copy link for Doubters</button>
  </>);
}

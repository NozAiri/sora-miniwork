import { useState } from "react";

const COLORS = [
  "#ffb3ba",
  "#ffd6a5",
  "#fdffb6",
  "#caffbf",
  "#9bf6ff",
  "#bdb2ff",
  "#ffc6ff",
  "#fffffc",
  "#f1f5f9",
  "#fef08a",
];

export default function DayReview({ onBack }: { onBack: () => void }) {
  const [color, setColor] = useState(COLORS[3]);
  const [today, setToday] = useState("");
  const [tomorrow, setTomorrow] = useState("");

  const save = () => {
    const entry = { at: new Date().toISOString(), color, today, tomorrow };
    const all = JSON.parse(localStorage.getItem("review-logs") || "[]");
    all.unshift(entry);
    localStorage.setItem("review-logs", JSON.stringify(all.slice(0, 100)));
    alert("記録しました。おつかれさま！");
    onBack();
  };

  return (
    <div className="container">
      <button className="link" onClick={onBack}>← ホームへ戻る</button>

      <div className="card" style={{ marginBottom: 12 }}>
        <div className="sectionTitle">いまの気分に近い色は？</div>
        <div className="colors" style={{ marginTop: 10 }}>
          {COLORS.map((c) => (
            <div
              key={c}
              className={`color ${color === c ? "sel" : ""}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
              role="button"
            />
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <label className="label">今日の出来事</label>
        <textarea
          value={today}
          onChange={(e) => setToday(e.target.value)}
          placeholder="思い出せる範囲でOK。短くても◎"
        />
      </div>

      <div className="card">
        <label className="label">明日したいこと</label>
        <input
          className="input"
          value={tomorrow}
          onChange={(e) => setTomorrow(e.target.value)}
          placeholder="小さな一歩をひとつだけ。"
        />
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button className="btn" onClick={save}>保存して終了</button>
          <button className="chip" onClick={onBack}>戻る</button>
        </div>
      </div>
    </div>
  );
}

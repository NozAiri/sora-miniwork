import { useState } from "react";
import type { Mode } from "./types";
import BreathWork from "./components/BreathWork";
import CBTWork from "./components/CBTWork";
import DayReview from "./components/DayReview";

export default function App() {
  const [mode, setMode] = useState<Mode>("home");

  if (mode === "breath") return <BreathWork onBack={() => setMode("home")} />;
  if (mode === "cbt") return <CBTWork onBack={() => setMode("home")} />;
  if (mode === "review") return <DayReview onBack={() => setMode("home")} />;

  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          <div className="logo" />
          <div>
            <div className="title">Sora — ミニワーク</div>
            <div className="small">気持ちが少し軽くなる、やさしい3つのツール。無理なく、自分のペースで。</div>
          </div>
        </div>
        <div className="small">v0.3 / local only</div>
      </div>

      <div className="grid">
        <div className="card">
          <div className="sectionTitle">① 呼吸ワーク</div>
          <div className="small">吸う→止める→吐く の1サイクル。円の動きに合わせて、からだ全体で呼吸。</div>
          <div style={{ height: 10 }} />
          <button className="btn" onClick={() => setMode("breath")}>→ はじめる</button>
        </div>

        <div className="card">
          <div className="sectionTitle">② 気持ちの整理（CBT）</div>
          <div className="small">いまの感情を複数えらぶ→きっかけ→ことばにする→よかったこと。</div>
          <div style={{ height: 10 }} />
          <button className="btn" onClick={() => setMode("cbt")}>→ はじめる</button>
        </div>

        <div className="card">
          <div className="sectionTitle">③ 一日を振り返る</div>
          <div className="small">色で気分を選び、今日と明日をひとこと記録。小さな一歩を応援します。</div>
          <div style={{ height: 10 }} />
          <button className="btn" onClick={() => setMode("review")}>→ はじめる</button>
        </div>
      </div>

      <div style={{ marginTop: 16 }} className="card">
        <div className="sectionTitle">ちいさな注意</div>
        <ul style={{ marginTop: 6 }}>
          <li className="small">ここで書いた内容はこの端末にだけ保存されます（サーバー送信なし）。</li>
          <li className="small">しんどいときは深呼吸して休憩を。必要なら専門家・信頼できる人にも相談してね。</li>
        </ul>
      </div>
    </div>
  );
}

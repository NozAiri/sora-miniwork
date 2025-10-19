import { useState } from "react";
import type { Mode } from "./types";
import BreathWork from "./components/BreathWork";
import CBTWork from "./components/CBTWork";
import DayReview from "./components/DayReview";
import "./styles.css";

export default function App() {
  const [mode, setMode] = useState<Mode>("home");

  if (mode === "breath") return <BreathWork onBack={() => setMode("home")} />;
  if (mode === "cbt") return <CBTWork onBack={() => setMode("home")} />;
  if (mode === "review") return <DayReview onBack={() => setMode("home")} />;

  return (
    <>
      <div className="starry" />
      <div className="container">
        <div className="header">
          <div className="brand">
            <div className="logo" />
            <div>
              <div className="title">Sora — ちいさなメンタルワーク</div>
              <div className="small">
                深呼吸して、気持ちを言葉にして、1日をやさしく整える。無理のないペースでどうぞ。
              </div>
            </div>
          </div>
          <div className="small">v0.3 / local data only</div>
        </div>

        <div className="grid">
          <div className="card tool">
            <div className="badge">呼吸ワーク</div>
            <h3>吸って・止めて・吐く</h3>
            <div className="small">
              円のふくらみを目で追いながら、呼吸のリズムにのせて身体をゆるめます。
            </div>
            <div style={{ flex: 1 }} />
            <button className="btn primary" onClick={() => setMode("breath")}>
              はじめる
            </button>
          </div>

          <div className="card tool">
            <div className="badge">感情の整理</div>
            <h3>今の気持ちを見つめる</h3>
            <div className="small">
              えらぶ・書く・振り返る。やさしく気持ちを言語化して落ち着きを取り戻します。
            </div>
            <div style={{ flex: 1 }} />
            <button className="btn primary" onClick={() => setMode("cbt")}>
              はじめる
            </button>
          </div>

          <div className="card tool">
            <div className="badge">一日を振り返る</div>
            <h3>色とことばで一日を記す</h3>
            <div className="small">
              今日の出来事・うれしかったこと・明日やりたいことを、軽やかにメモ。
            </div>
            <div style={{ flex: 1 }} />
            <button className="btn primary" onClick={() => setMode("review")}>
              はじめる
            </button>
          </div>
        </div>

        <div className="divider" />
        <div className="note">
          ここで入力した内容はこの端末のブラウザにのみ保存されます（サーバー送信なし）。
        </div>
      </div>
    </>
  );
}

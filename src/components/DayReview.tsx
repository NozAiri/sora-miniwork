import { useMemo, useState } from "react";

type Props = { onBack: () => void };

const COLORS = [
  "#60a5fa","#34d399","#f59e0b","#f43f5e","#a78bfa",
  "#10b981","#ef4444","#f97316","#22c55e","#3b82f6",
  "#eab308","#06b6d4","#8b5cf6","#14b8a6","#64748b"
];

export default function DayReview({ onBack }: Props) {
  const [mood, setMood] = useState<string>("");
  const [today, setToday] = useState("");
  const [tomorrow, setTomorrow] = useState("");

  const moodStyle = useMemo(()=>({
    boxShadow: `0 0 0 6px ${mood}22, 0 6px 18px ${mood}33`
  }),[mood]);

  return (
    <div className="container">
      <div className="row" style={{justifyContent:"space-between"}}>
        <button className="btn ghost" onClick={onBack}>← 戻る</button>
        <div className="small">短いメモでOK。白紙でもOK。</div>
      </div>

      <div className="card" style={{marginTop:12}}>
        <div className="sectionTitle">今の気分に近い色は？（直感でOK）</div>
        <div className="row" style={{gap:10, flexWrap:"wrap"}}>
          {COLORS.map(c=>(
            <button key={c} className="pill"
              style={{borderColor: c, background:mood===c?`${c}22`:"#fff"}}
              onClick={()=>setMood(c)}
              aria-pressed={mood===c}
              title={c}
            >
              <span style={{
                width:16,height:16,borderRadius:999,background:c,display:"inline-block"
              }}/>
              {mood===c ? "この色" : "えらぶ"}
            </button>
          ))}
        </div>

        <div className="divider" />

        <div className="sectionTitle">今日の出来事（心に残ったこと）</div>
        <textarea
          placeholder="小さなことこそ宝物。2〜3行でも、1行でも大切です。"
          value={today} onChange={e=>setToday(e.target.value)}
        />

        <div className="sectionTitle" style={{marginTop:12}}>明日やってみたいこと</div>
        <input className="input"
          placeholder="例：5分だけ深呼吸 / メールを1通返す / 好きな音楽を聴く"
          value={tomorrow} onChange={e=>setTomorrow(e.target.value)}
        />

        <div className="divider" />

        <div className="row">
          <button className="btn"
            onClick={()=>{ setMood(""); setToday(""); setTomorrow(""); }}>
            クリア
          </button>
          <button className="btn primary"
            onClick={()=>alert("おつかれさまでした。今日はここまでで十分です。")}>
            保存（ローカル）
          </button>
        </div>

        <div className="note" style={{marginTop:10}}>
          過去の自分に厳しくしすぎないで。<b>できたこと</b>に目を向けてみましょう。
        </div>

        {mood && <div className="divider" />}
        {mood && (
          <div className="card" style={{marginTop:8, ...moodStyle}}>
            <div className="small">プレビュー</div>
            <div>色：<span style={{display:"inline-block", width:14,height:14, background:mood, borderRadius:999, verticalAlign:"-2px"}}/> {mood}</div>
            <div>今日：{today || "(未入力)"}</div>
            <div>明日：{tomorrow || "(未入力)"}</div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import type { Emotion, TriggerTag } from "../types";

const EMOTIONS: Emotion[] = [
  { key: "joy", emoji: "😊", label: "うれしい" },
  { key: "calm", emoji: "🙂", label: "おだやか" },
  { key: "proud", emoji: "😌", label: "ほっとした" },
  { key: "love", emoji: "🥰", label: "好き" },
  { key: "ok", emoji: "😐", label: "ふつう" },
  { key: "tired", emoji: "🥱", label: "つかれた" },
  { key: "sad", emoji: "😢", label: "かなしい" },
  { key: "angry", emoji: "😠", label: "いらいら" },
  { key: "anx", emoji: "😟", label: "ふあん" },
  { key: "overw", emoji: "😵‍💫", label: "いっぱいいっぱい" },
  { key: "scared", emoji: "😨", label: "こわい" },
  { key: "lonely", emoji: "😔", label: "さびしい" },
  { key: "conf", emoji: "🤔", label: "まよい" },
  { key: "sick", emoji: "🤒", label: "体調" },
  { key: "exc", emoji: "🤩", label: "わくわく" },
  { key: "grateful", emoji: "🙏", label: "ありがたい" },
];

const TRIGGERS: TriggerTag[] = ["出来事", "友だち", "家族", "部活", "クラス", "勉強", "体調", "SNS", "その他"];

export default function CBTWork({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [trigger, setTrigger] = useState<TriggerTag>("出来事");
  const [notes, setNotes] = useState("");
  const [good, setGood] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("cbt-draft");
    if (raw) {
      try {
        const v = JSON.parse(raw);
        setSelected(v.selected ?? []);
        setTrigger(v.trigger ?? "出来事");
        setNotes(v.notes ?? "");
        setGood(v.good ?? "");
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cbt-draft", JSON.stringify({ selected, trigger, notes, good }));
  }, [selected, trigger, notes, good]);

  const toggle = (k: string) => setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

  const save = () => {
    const entry = { at: new Date().toISOString(), selected, trigger, notes, good };
    const all = JSON.parse(localStorage.getItem("cbt-logs") || "[]");
    all.unshift(entry);
    localStorage.setItem("cbt-logs", JSON.stringify(all.slice(0, 100)));
    localStorage.removeItem("cbt-draft");
    alert("メモを保存しました。よくやったね。");
    onBack();
  };

  return (
    <div className="container">
      <button className="link" onClick={onBack}>← ホームへ戻る</button>

      <div className="card" style={{ marginBottom: 12 }}>
        <div className="sectionTitle">いまの心の色を教えてください</div>
        <div className="small">複数OK。しっくり来るものをタップしてね。</div>
        <div className="emoji-grid" style={{ marginTop: 10 }}>
          {EMOTIONS.map((e) => (
            <div
              key={e.key}
              className={`emoji ${selected.includes(e.key) ? "sel" : ""}`}
              role="button"
              aria-pressed={selected.includes(e.key)}
              title={e.label}
              onClick={() => toggle(e.key)}
            >
              {e.emoji}
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <label className="label">その感情のきっかけは何に近いですか？</label>
        <select value={trigger} onChange={(e) => setTrigger(e.target.value as TriggerTag)}>
          {TRIGGERS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <div className="small" style={{ marginTop: 6 }}>
          正解はありません。近いものでOK。
        </div>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <label className="label">ことばにして整理してみましょう</label>
        <textarea
          placeholder="頭に浮かんだことを、そのまま書いてみるだけでOK。深呼吸しながらゆっくりで大丈夫。"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="card">
        <label className="label">今日あった“よかったこと”はありますか？（小さなことで十分）</label>
        <input
          className="input"
          value={good}
          onChange={(e) => setGood(e.target.value)}
          placeholder="空がきれいだった／ご飯がおいしかった など"
        />
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button className="btn" onClick={save} disabled={selected.length === 0}>
            保存して終了
          </button>
          <button className="chip" onClick={onBack}>
            保存せずに戻る
          </button>
        </div>
        <div className="small" style={{ marginTop: 8 }}>
          ここに書いた内容はこの端末にだけ保存されます。あなたのペースで大丈夫、いつでもやめられます。
        </div>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";

type Props = { onBack: () => void };

// 感情/きっかけタグ（複数選択可）
const TAGS = [
  "仕事・学業", "家族", "友だち", "恋愛", "体調", "疲れ", "お金", "SNS", "天気", "その他",
] as const;
type Tag = (typeof TAGS)[number];

export default function CBTWork({ onBack }: Props) {
  const [selected, setSelected] = useState<Tag[]>([]);
  const [detail, setDetail] = useState("");
  const [good, setGood] = useState("");

  const addOrRemove = (tag: Tag) =>
    setSelected(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );

  const toggleTag = (tag: Tag) => addOrRemove(tag);

  const canSave = useMemo(() => selected.length > 0 || detail || good, [selected, detail, good]);

  return (
    <div className="container">
      <div className="header">
        <button className="btn ghost" onClick={onBack}>← もどる</button>
        <div className="title">感情を整えるミニワーク</div>
        <div className="small">今の気持ちを優しく整理しましょう</div>
      </div>

      <div className="card">
        <div className="sectionTitle">今の感情は何ですか？</div>
        <div className="chips">
          {TAGS.map(tag => {
            const active = selected.includes(tag);
            return (
              <button
                key={tag}
                className={`chip ${active ? "active" : ""}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div className="sectionTitle">今の感情のきっかけは何に近いですか？</div>
        <textarea
          value={detail}
          onChange={e => setDetail(e.target.value)}
          placeholder="出来事や考えを書いてみましょう。短い一言でもOKです。"
        />
      </div>

      <div className="card">
        <div className="sectionTitle">良かったこと・助けになったことは？</div>
        <textarea
          value={good}
          onChange={e => setGood(e.target.value)}
          placeholder="小さなことでもOK。感謝できたこと、うまくいったことなど。"
        />
      </div>

      <div className="footerRow">
        <div className="small">
          感情を整理して、少しずつ落ち着きを取り戻しましょう。深呼吸も忘れずに。
        </div>
        <button className="btn primary" disabled={!canSave}>
          保存（ローカル）
        </button>
      </div>
    </div>
  );
}

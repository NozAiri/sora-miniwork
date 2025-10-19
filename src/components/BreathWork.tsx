import { useEffect, useMemo, useRef, useState } from "react";

type PatternKey = "4-4-4" | "4-7-8" | "5-5-5";
const PATTERNS: Record<PatternKey, { inhale: number; hold: number; exhale: number; label: string }> = {
  "4-4-4": { inhale: 4, hold: 4, exhale: 4, label: "4–4–4（等間）" },
  "4-7-8": { inhale: 4, hold: 7, exhale: 8, label: "4–7–8（落ち着き）" },
  "5-5-5": { inhale: 5, hold: 5, exhale: 5, label: "5–5–5（ややゆっくり）" },
};

type Phase = "吸う" | "止める" | "吐く" | "休む";

export default function BreathWork({ onBack }: { onBack: () => void }) {
  const [running, setRunning] = useState(false);
  const [pattern, setPattern] = useState<PatternKey>("4-7-8");
  const [phase, setPhase] = useState<Phase>("吸う");
  const [secLeft, setSecLeft] = useState<number>(PATTERNS[pattern].inhale);
  const [cycles, setCycles] = useState(0);
  const raf = useRef<number | null>(null);

  const times = useMemo(() => PATTERNS[pattern], [pattern]);

  useEffect(() => {
    if (!running) return;

    const tick = (t0: number, total: number) => {
      const step = (t: number) => {
        const elapsed = Math.floor((t - t0) / 1000);
        const left = Math.max(total - elapsed, 0);
        setSecLeft(left);

        if (left <= 0) {
          if (phase === "吸う") {
            setPhase("止める");
            setSecLeft(times.hold);
            raf.current = requestAnimationFrame((t) => tick(t, times.hold));
            return;
          }
          if (phase === "止める") {
            setPhase("吐く");
            setSecLeft(times.exhale);
            raf.current = requestAnimationFrame((t) => tick(t, times.exhale));
            return;
          }
          if (phase === "吐く") {
            setPhase("休む");
            setSecLeft(1);
            raf.current = requestAnimationFrame((t) => tick(t, 1));
            return;
          }
          // 休む → 吸う（サイクル+1）
          setCycles((c) => c + 1);
          setPhase("吸う");
          setSecLeft(times.inhale);
          raf.current = requestAnimationFrame((t) => tick(t, times.inhale));
          return;
        }

        raf.current = requestAnimationFrame(step);
      };

      raf.current = requestAnimationFrame(step);
    };

    // 初回スタート
    const first = phase === "吸う" ? times.inhale : phase === "止める" ? times.hold : phase === "吐く" ? times.exhale : 1;
    setSecLeft(first);
    raf.current = requestAnimationFrame((t) => tick(t, first));

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, pattern, phase]);

  // 円のスケール
  const scale = phase === "吸う" ? 1.2 : phase === "止める" ? 1.22 : 0.8;

  return (
    <div className="container">
      <button className="link" onClick={onBack}>← ホームへ戻る</button>
      <div className="card">
        <div className="sectionTitle">呼吸ワーク</div>
        <div className="small">息を吸って、止めて、吐く。ガイドに合わせて、心と体を整えましょう。</div>

        <div className="breath-wrap" style={{ marginTop: 16 }}>
          <div className="breath-circle" style={{ ["--s" as any]: scale }} aria-hidden />
          <div className="phase" aria-live="polite">{phase}</div>
          <div className="kp" aria-live="polite">{secLeft}s</div>

          <div className="patterns" aria-label="パターン">
            {(Object.keys(PATTERNS) as PatternKey[]).map((key) => (
              <button
                key={key}
                className={`chip ${pattern === key ? "active" : ""}`}
                onClick={() => {
                  setPattern(key);
                  setPhase("吸う");
                  setSecLeft(PATTERNS[key].inhale);
                }}
              >
                {PATTERNS[key].label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {!running ? (
              <button
                className="btn"
                onClick={() => {
                  setPhase("吸う");
                  setSecLeft(times.inhale);
                  setRunning(true);
                }}
              >
                ▶ はじめる
              </button>
            ) : (
              <button
                className="btn"
                onClick={() => {
                  setRunning(false);
                  if (raf.current) cancelAnimationFrame(raf.current);
                }}
              >
                ■ とめる
              </button>
            )}
            <button
              className="chip"
              onClick={() => {
                setCycles(0);
                setPhase("吸う");
                setSecLeft(times.inhale);
              }}
            >
              1周目から
            </button>
          </div>

          <div className="small">
            いまのサイクル：<b>{cycles}</b>
          </div>
          <div className="small" style={{ maxWidth: 660 }}>
            ヒント：吐く時間を長めにすると、副交感神経が働きやすくなります。無理せず、いつでも停止できます。
          </div>
        </div>
      </div>
    </div>
  );
}

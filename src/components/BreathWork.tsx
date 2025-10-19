import { useEffect, useMemo, useRef, useState } from "react";

type Props = { onBack: () => void };

type Phase = "inhale" | "hold" | "exhale";
const PHRASE: Record<Phase, string> = {
  inhale: "ゆっくり吸って",
  hold: "そのままキープ",
  exhale: "ながく吐いて",
};

export default function BreathWork({ onBack }: Props) {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("inhale");
  const [cycle, setCycle] = useState(0);

  // 時間（秒）— 好みでいつでも変更OK
  const [secInhale, setSecInhale] = useState(4);
  const [secHold, setSecHold] = useState(2);
  const [secExhale, setSecExhale] = useState(4);

  const total = secInhale + secHold + secExhale;
  const [elapsed, setElapsed] = useState(0);
  const raf = useRef<number | null>(null);
  const startAt = useRef<number | null>(null);

  const schedule = useMemo(
    () => [
      { name: "inhale" as Phase, dur: secInhale },
      { name: "hold" as Phase, dur: secHold },
      { name: "exhale" as Phase, dur: secExhale },
    ],
    [secInhale, secHold, secExhale]
  );

  // アニメーションループ
  useEffect(() => {
    if (!running) return;
    const tick = (t: number) => {
      if (startAt.current == null) startAt.current = t;
      const s = (t - startAt.current) / 1000;
      setElapsed(s);

      let acc = 0;
      let current: Phase = "inhale";
      for (const seg of schedule) {
        if (s < acc + seg.dur) {
          current = seg.name;
          break;
        }
        acc += seg.dur;
      }
      setPhase(current);

      if (s >= total) {
        // 1サイクル終了
        startAt.current = t; // 継続
        setCycle((c) => c + 1);
        setElapsed(0);
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
      startAt.current = null;
    };
  }, [running, schedule, total]);

  const scale =
    phase === "inhale" ? 1.6 : phase === "hold" ? 1.6 : /* exhale */ 0.8;

  const progress = (() => {
    // 現在フェーズ内の進み
    let acc = 0;
    for (const seg of schedule) {
      if (phase === seg.name) {
        return ((elapsed - acc) / Math.max(0.0001, seg.dur));
      }
      acc += seg.dur;
    }
    return 0;
  })();

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <button className="btn ghost" onClick={onBack}>← 戻る</button>
        <div className="small">呼吸サイクル：{cycle}</div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="breath-wrap">
          <div
            className="circle"
            style={{ transform: `scale(${scale})`, transitionDuration: "900ms" }}
            aria-label="breathing circle"
          />
          <div className="phase">{PHRASE[phase]}</div>
          <div className="timer">
            {phase === "inhale" && "吸う"}
            {phase === "hold" && "止める"}
            {phase === "exhale" && "吐く"}：{Math.max(0, (1 - progress) * (
              phase === "inhale" ? secInhale :
              phase === "hold"   ? secHold   :
                                   secExhale
            )).toFixed(0)} 秒
          </div>

          <div className="row" style={{marginTop:8}}>
            <button
              className={`btn ${running ? "ghost" : "primary"}`}
              onClick={() => setRunning(v => !v)}
            >
              {running ? "一時停止" : "はじめる"}
            </button>
            <button
              className="btn"
              onClick={() => { setCycle(0); setElapsed(0); setPhase("inhale"); }}
              disabled={running}
              title="カウンターのリセット"
            >
              リセット
            </button>
          </div>

          <div className="divider" />

          <div style={{width:"100%"}}>
            <div className="sectionTitle">リズムの調整（お好みで）</div>
            <div className="row">
              <label className="pill">
                吸う
                <input className="input" type="number" min={2} max={10}
                  style={{width:80}} value={secInhale}
                  onChange={e => setSecInhale(Number(e.target.value||4))}/>
                秒
              </label>
              <label className="pill">
                止める
                <input className="input" type="number" min={0} max={10}
                  style={{width:80}} value={secHold}
                  onChange={e => setSecHold(Number(e.target.value||2))}/>
                秒
              </label>
              <label className="pill">
                吐く
                <input className="input" type="number" min={2} max={12}
                  style={{width:80}} value={secExhale}
                  onChange={e => setSecExhale(Number(e.target.value||4))}/>
                秒
              </label>
            </div>
            <div className="note" style={{marginTop:8}}>
              苦しくない速さでOK。<b>「気持ちいい」</b>を基準にどうぞ。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

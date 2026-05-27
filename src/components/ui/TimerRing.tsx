interface TimerRingProps {
  remaining: number;
  progress: number;
  urgent?: boolean;
}

export function TimerRing({ remaining, progress, urgent }: TimerRingProps) {
  const background = `conic-gradient(${urgent ? "#fb7185" : "#19e6ff"} ${progress}%, rgba(255,255,255,0.12) 0)`;

  return (
    <div
      className="grid h-20 w-20 place-items-center rounded-full p-1"
      style={{ background }}
      aria-label={`残り${remaining}秒`}
    >
      <div className="grid h-full w-full place-items-center rounded-full bg-ink">
        <span className={urgent ? "font-display text-lg text-red-300" : "font-display text-lg"}>
          {remaining}
        </span>
      </div>
    </div>
  );
}

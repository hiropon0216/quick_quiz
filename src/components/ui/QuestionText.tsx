import { useEffect, useMemo, useState } from "react";

interface QuestionTextProps {
  text: string;
  paused?: boolean;
}

export function QuestionText({ text, paused }: QuestionTextProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
  }, [text]);

  useEffect(() => {
    if (paused || visibleCount >= text.length) {
      return;
    }

    const currentChar = text[visibleCount - 1] ?? "";
    const delay = currentChar === "、" || currentChar === "。" ? 200 : 120;
    const timerId = window.setTimeout(() => {
      setVisibleCount((current) => Math.min(current + 1, text.length));
    }, delay);

    return () => window.clearTimeout(timerId);
  }, [paused, text, visibleCount]);

  const visibleText = useMemo(() => text.slice(0, visibleCount), [text, visibleCount]);

  return (
    <p className="min-h-40 whitespace-pre-wrap text-xl font-black leading-relaxed sm:text-2xl">
      {visibleText}
      {!paused && visibleCount < text.length && (
        <span className="ml-1 inline-block animate-pulse text-cyanGlow">■</span>
      )}
    </p>
  );
}

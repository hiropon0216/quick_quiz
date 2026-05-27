import { FormEvent, useEffect, useRef, useState } from "react";
import { Keyboard } from "lucide-react";
import { BuzzerButton } from "../ui/BuzzerButton";
import { MasteryStars } from "../ui/MasteryStars";
import { QuestionText } from "../ui/QuestionText";
import { TimerRing } from "../ui/TimerRing";
import { useTimer } from "../../hooks/useTimer";
import { useProgressStore } from "../../store/progressStore";
import { useQuizStore } from "../../store/quizStore";
import { getCategoryMeta } from "../../utils/questionLoader";

export function BuzzerScreen() {
  const question = useQuizStore((state) => state.sessionQuestions[state.currentIndex]);
  const currentIndex = useQuizStore((state) => state.currentIndex);
  const total = useQuizStore((state) => state.sessionQuestions.length);
  const buzzerPressed = useQuizStore((state) => state.buzzerPressed);
  const pressBuzzer = useQuizStore((state) => state.pressBuzzer);
  const submitAnswer = useQuizStore((state) => state.submitAnswer);
  const timeoutCurrentQuestion = useQuizStore((state) => state.timeoutCurrentQuestion);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const progress = useProgressStore((state) =>
    question ? state.progress[question.id] : undefined,
  );

  const timer = useTimer({
    seconds: 10,
    enabled: buzzerPressed,
    onExpire: timeoutCurrentQuestion,
  });

  useEffect(() => {
    setInput("");
  }, [question?.id]);

  useEffect(() => {
    if (buzzerPressed) {
      inputRef.current?.focus();
    }
  }, [buzzerPressed]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.key === " " || event.key === "Enter") && !buzzerPressed) {
        event.preventDefault();
        pressBuzzer();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [buzzerPressed, pressBuzzer]);

  if (!question) {
    return null;
  }

  const category = getCategoryMeta(question.categoryId);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    submitAnswer(input);
  };

  return (
    <section className="flex flex-1 flex-col gap-5">
      <header className="flex items-center justify-between text-sm text-white/70">
        <span>{category.label}</span>
        <span>
          Q{currentIndex + 1}/{total}
        </span>
        <MasteryStars count={progress?.consecutiveCorrect ?? 0} />
      </header>

      <div className="rounded-lg border border-cyanGlow/25 bg-panel p-5 shadow-[0_0_42px_rgba(25,230,255,0.10)]">
        <QuestionText text={question.question} paused={buzzerPressed} />
      </div>

      <div className="flex flex-1 flex-col justify-end gap-5">
        {!buzzerPressed ? (
          <BuzzerButton onPress={pressBuzzer} />
        ) : (
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="flex justify-center">
              <TimerRing
                remaining={timer.remaining}
                progress={timer.progress}
                urgent={timer.isUrgent}
              />
            </div>
            <label className="grid gap-2">
              <span className="flex items-center gap-2 text-sm text-white/65">
                <Keyboard size={16} aria-hidden />
                答えを入力
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="min-h-14 rounded-lg border border-cyanGlow/35 bg-white/[0.08] px-4 text-base font-bold outline-none focus:border-cyanGlow"
                autoComplete="off"
                inputMode="text"
              />
            </label>
            <button
              type="submit"
              className="rounded-lg bg-cyanGlow px-5 py-4 font-black text-ink shadow-[0_0_28px_rgba(25,230,255,0.28)] transition active:scale-[0.98]"
            >
              送信
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

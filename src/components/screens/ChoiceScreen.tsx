import { ChoiceButtons } from "../ui/ChoiceButtons";
import { MasteryStars } from "../ui/MasteryStars";
import { TimerRing } from "../ui/TimerRing";
import { useTimer } from "../../hooks/useTimer";
import { useProgressStore } from "../../store/progressStore";
import { useQuizStore } from "../../store/quizStore";
import { getCategoryMeta } from "../../utils/questionLoader";

export function ChoiceScreen() {
  const question = useQuizStore((state) => state.sessionQuestions[state.currentIndex]);
  const currentIndex = useQuizStore((state) => state.currentIndex);
  const total = useQuizStore((state) => state.sessionQuestions.length);
  const selectChoice = useQuizStore((state) => state.selectChoice);
  const timeoutCurrentQuestion = useQuizStore((state) => state.timeoutCurrentQuestion);
  const progress = useProgressStore((state) =>
    question ? state.progress[question.id] : undefined,
  );

  if (!question) {
    return null;
  }

  const category = getCategoryMeta(question.categoryId);
  const timer = useTimer({
    seconds: 20,
    onExpire: timeoutCurrentQuestion,
  });

  return (
    <section className="flex flex-1 flex-col gap-5">
      <header className="flex items-center justify-between text-sm text-white/70">
        <span>{category.label}</span>
        <span>
          Q{currentIndex + 1}/{total}
        </span>
        <MasteryStars count={progress?.consecutiveCorrect ?? 0} />
      </header>

      <div className="flex justify-center">
        <TimerRing
          remaining={timer.remaining}
          progress={timer.progress}
          urgent={timer.isUrgent}
        />
      </div>

      <div className="flex min-h-48 flex-1 items-center">
        <div className="w-full rounded-lg border border-cyanGlow/25 bg-panel p-5 shadow-[0_0_42px_rgba(25,230,255,0.10)]">
          <p className="text-xl font-black leading-relaxed sm:text-2xl">{question.question}</p>
        </div>
      </div>

      <ChoiceButtons choices={question.choices} onSelect={selectChoice} />
    </section>
  );
}

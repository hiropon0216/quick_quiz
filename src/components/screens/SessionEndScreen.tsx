import { Home, RotateCcw } from "lucide-react";
import { useQuizStore } from "../../store/quizStore";

export function SessionEndScreen() {
  const sessionResults = useQuizStore((state) => state.sessionResults);
  const startSession = useQuizStore((state) => state.startSession);
  const selectedMode = useQuizStore((state) => state.selectedMode);
  const isReview = useQuizStore((state) => state.isReview);
  const goToTop = useQuizStore((state) => state.goToTop);
  const correct = sessionResults.filter((result) => result.isCorrect).length;
  const mastered = sessionResults.filter((result) => result.becameMastered).length;

  return (
    <section className="flex flex-1 flex-col justify-center gap-6">
      <div className="rounded-lg border border-cyanGlow/25 bg-panel p-6 text-center shadow-[0_0_42px_rgba(25,230,255,0.10)]">
        <p className="text-lg text-white/70">{isReview ? "復習終了" : "セッション終了"}</p>
        <p className="mt-4 font-display text-5xl font-black text-cyanGlow">
          {correct}/{sessionResults.length}
        </p>
        <p className="mt-3 text-white/65">正解しました</p>
        <p className="mt-5 text-sm text-yellow-100">
          {isReview ? "復習で確認できた問題" : "今回の習熟達成"}:{" "}
          {isReview ? correct : mastered}問
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => void startSession(selectedMode ?? "choice", { isReview })}
          className="flex items-center justify-center gap-2 rounded-lg border border-cyanGlow/40 bg-cyanGlow/10 px-4 py-4 font-bold"
        >
          <RotateCcw size={18} aria-hidden />
          もう一度
        </button>
        <button
          type="button"
          onClick={goToTop}
          className="flex items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-4 font-bold"
        >
          <Home size={18} aria-hidden />
          カテゴリ
        </button>
      </div>
    </section>
  );
}

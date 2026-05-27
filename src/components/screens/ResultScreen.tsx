import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useQuizStore } from "../../store/quizStore";

export function ResultScreen() {
  const result = useQuizStore((state) => state.lastResult);
  const nextQuestion = useQuizStore((state) => state.nextQuestion);

  if (!result) {
    return null;
  }

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <motion.div
        initial={{ scale: 0.72, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.42 }}
        className={
          result.isCorrect
            ? "text-emerald-300 drop-shadow-[0_0_22px_rgba(110,231,183,0.65)]"
            : "text-red-300 drop-shadow-[0_0_22px_rgba(252,165,165,0.55)]"
        }
      >
        {result.isCorrect ? (
          <CheckCircle2 size={92} strokeWidth={1.8} aria-hidden />
        ) : (
          <XCircle size={92} strokeWidth={1.8} aria-hidden />
        )}
      </motion.div>

      <div>
        <p className="text-3xl font-black">{result.isCorrect ? "正解" : "不正解"}</p>
        <p className="mt-3 text-lg text-white/75">正解: {result.answer}</p>
        {result.inputAnswer && (
          <p className="mt-2 text-sm text-white/55">入力: {result.inputAnswer}</p>
        )}
        {result.selectedAnswer && !result.isCorrect && (
          <p className="mt-2 text-sm text-white/55">選択: {result.selectedAnswer}</p>
        )}
        {result.becameMastered && !result.isReview && (
          <p className="mt-4 rounded-lg border border-yellow-300/30 bg-yellow-300/10 px-4 py-2 text-sm text-yellow-100">
            3回連続正解。習熟済みになりました。
          </p>
        )}
        {result.isReview && (
          <p className="mt-4 rounded-lg border border-white/15 bg-white/[0.06] px-4 py-2 text-sm text-white/70">
            復習結果を記録しました。
          </p>
        )}
      </div>

      <div className="w-full rounded-lg border border-white/10 bg-white/[0.055] p-4 text-left">
        <p className="text-sm font-bold text-cyanGlow">解説</p>
        <p className="mt-2 text-sm leading-relaxed text-white/75">{result.explanation}</p>
      </div>

      <button
        type="button"
        onClick={nextQuestion}
        className="w-full rounded-lg bg-cyanGlow px-5 py-4 font-black text-ink shadow-[0_0_28px_rgba(25,230,255,0.28)] transition active:scale-[0.98]"
      >
        次の問題へ
      </button>
    </section>
  );
}

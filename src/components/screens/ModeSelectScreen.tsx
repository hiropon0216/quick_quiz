import { ArrowLeft, Gamepad2, Loader2, Zap } from "lucide-react";
import { useQuizStore } from "../../store/quizStore";
import { getCategoryMeta } from "../../utils/questionLoader";

export function ModeSelectScreen() {
  const selectedCategory = useQuizStore((state) => state.selectedCategory);
  const startSession = useQuizStore((state) => state.startSession);
  const goToTop = useQuizStore((state) => state.goToTop);
  const isLoading = useQuizStore((state) => state.isLoading);
  const error = useQuizStore((state) => state.error);
  const isReview = useQuizStore((state) => state.isReview);
  const label =
    selectedCategory === "all" ? "すべてのカテゴリ" : getCategoryMeta(selectedCategory).label;

  return (
    <section className="flex flex-1 flex-col gap-5">
      <button
        type="button"
        onClick={goToTop}
        className="flex w-fit items-center gap-2 rounded-lg px-1 py-2 text-sm text-white/70"
      >
        <ArrowLeft size={18} aria-hidden />
        {label}
      </button>

      <div>
        <h1 className="text-2xl font-black">{isReview ? "復習モード" : "モードを選択"}</h1>
        <p className="mt-2 text-sm text-white/60">
          初回ロードは必要なカテゴリの問題だけを読み込みます。
        </p>
      </div>

      <div className="grid gap-3">
        <button
          type="button"
          onClick={() => void startSession("buzzer", { isReview })}
          disabled={isLoading}
          className="rounded-lg border border-white/10 bg-white/[0.045] p-5 text-left transition hover:border-cyanGlow/70 disabled:cursor-wait"
        >
          <div className="flex items-center gap-3">
            <Zap className="text-cyanGlow" aria-hidden />
            <div>
              <p className="text-lg font-bold">早押しモード</p>
              <p className="mt-1 text-sm text-white/60">流れる問題文を見て解答権を取る</p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => void startSession("choice", { isReview })}
          disabled={isLoading}
          className="rounded-lg border border-cyanGlow/40 bg-cyanGlow/10 p-5 text-left shadow-[0_0_34px_rgba(25,230,255,0.14)] transition hover:border-cyanGlow disabled:cursor-wait"
        >
          <div className="flex items-center gap-3">
            {isLoading ? (
              <Loader2 className="animate-spin text-cyanGlow" aria-hidden />
            ) : (
              <Gamepad2 className="text-cyanGlow" aria-hidden />
            )}
            <div>
              <p className="text-lg font-bold">4択モード</p>
              <p className="mt-1 text-sm text-white/60">
                軽く10問。未習熟問題だけから出題
              </p>
            </div>
          </div>
        </button>
      </div>

      {error && (
        <p className="rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-100">
          {error}
        </p>
      )}
    </section>
  );
}

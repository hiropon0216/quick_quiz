import { ChevronRight, RotateCcw } from "lucide-react";
import { useProgressStore } from "../../store/progressStore";
import { useQuizStore } from "../../store/quizStore";
import type { CategoryId } from "../../types";
import {
  categories,
  getTargetQuestionCount,
  getTotalQuestionCount,
} from "../../utils/questionLoader";
import { ProgressBar } from "../ui/ProgressBar";

function getMasteredCount(progressIds: string[], categoryId?: CategoryId): number {
  if (!categoryId) {
    return progressIds.length;
  }

  const prefixes: Record<CategoryId, string> = {
    history: "his-",
    geography: "geo-",
    science: "sci-",
    literature: "lit-",
    sports: "spo-",
    entertainment: "ent-",
    politics: "pol-",
    language: "lan-",
    food: "foo-",
    news: "news-",
  };

  return progressIds.filter((id) => id.startsWith(prefixes[categoryId])).length;
}

export function TopScreen() {
  const selectCategory = useQuizStore((state) => state.selectCategory);
  const startSession = useQuizStore((state) => state.startSession);
  const isLoading = useQuizStore((state) => state.isLoading);
  const error = useQuizStore((state) => state.error);
  const progress = useProgressStore((state) => state.progress);
  const masteredIds = Object.values(progress)
    .filter((item) => item.mastered)
    .map((item) => item.questionId);
  const total = getTotalQuestionCount();
  const targetTotal = getTargetQuestionCount();
  const totalMastered = masteredIds.length;
  const totalRate = total > 0 ? (totalMastered / total) * 100 : 0;
  const collectionRate = targetTotal > 0 ? (total / targetTotal) * 100 : 0;

  return (
    <section className="flex flex-1 flex-col gap-5">
      <header className="pt-2 text-center">
        <p className="font-display text-4xl font-black tracking-normal text-cyanGlow drop-shadow-[0_0_18px_rgba(25,230,255,0.65)]">
          QUICK QUIZ
        </p>
      </header>

      <button
        type="button"
        onClick={() => selectCategory("all")}
        className="rounded-lg border border-cyanGlow/35 bg-panel p-4 text-left shadow-[0_0_40px_rgba(25,230,255,0.12)] transition hover:border-cyanGlow"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold">すべてのカテゴリ</p>
            <p className="mt-1 text-sm text-white/65">
              残り{Math.max(total - totalMastered, 0)}問 / 収録{total}問
            </p>
            <p className="mt-1 text-xs text-white/45">
              基礎固め目標 {targetTotal.toLocaleString()}問・収録率
              {Math.round(collectionRate)}%
            </p>
          </div>
          <ChevronRight aria-hidden className="text-cyanGlow" />
        </div>
        <div className="mt-4">
          <ProgressBar value={totalRate} />
          <p className="mt-2 text-right text-xs text-white/60">
            {Math.round(totalRate)}% 習熟
          </p>
        </div>
      </button>

      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => {
          const mastered = getMasteredCount(masteredIds, category.id);
          const rate = category.total > 0 ? (mastered / category.total) * 100 : 0;
          const collection = category.targetTotal > 0
            ? (category.total / category.targetTotal) * 100
            : 0;
          const disabled = category.total === 0;

          return (
            <button
              key={category.id}
              type="button"
              disabled={disabled}
              onClick={() => selectCategory(category.id)}
              className="rounded-lg border border-white/10 bg-white/[0.055] p-3 text-left transition hover:border-cyanGlow/70 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden>
                  {category.icon}
                </span>
                <span className="font-bold">{category.label}</span>
              </div>
              <p className="mt-2 text-xs text-white/60">
                残り{Math.max(category.total - mastered, 0)}問 / 収録{category.total}問
              </p>
              <p className="mt-1 text-xs text-white/40">
                目標{category.targetTotal}問・収録率{Math.round(collection)}%
              </p>
              <div className="mt-3">
                <ProgressBar value={rate} />
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="mt-auto flex items-center justify-center gap-2 rounded-lg border border-yellow-300/25 bg-yellow-300/10 px-4 py-3 text-sm font-bold text-yellow-50 transition hover:border-yellow-300/60 disabled:cursor-wait"
        disabled={isLoading}
        onClick={() => void startSession("choice", { isReview: true })}
      >
        <RotateCcw size={16} aria-hidden />
        習熟済みを復習
      </button>
      {error && (
        <p className="rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-100">
          {error}
        </p>
      )}
    </section>
  );
}

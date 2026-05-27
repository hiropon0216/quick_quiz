import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CategoryId, ProgressMap, QuestionProgress } from "../types";

const questionIdPrefixes: Record<CategoryId, string> = {
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

interface ProgressStore {
  progress: ProgressMap;
  recordAnswer: (
    questionId: string,
    categoryId: CategoryId,
    isCorrect: boolean,
    options?: { isReview?: boolean },
  ) => { progress: QuestionProgress; becameMastered: boolean };
  getProgress: (questionId: string) => QuestionProgress | undefined;
  resetAll: () => void;
  resetCategory: (categoryId: CategoryId) => void;
}

function createInitialProgress(
  questionId: string,
  categoryId: CategoryId,
): QuestionProgress {
  return {
    questionId,
    categoryId,
    consecutiveCorrect: 0,
    mastered: false,
    lastAnsweredAt: new Date().toISOString(),
    totalAttempts: 0,
    totalCorrect: 0,
  };
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progress: {},
      recordAnswer: (questionId, categoryId, isCorrect, options) => {
        const current =
          get().progress[questionId] ?? createInitialProgress(questionId, categoryId);
        const nextStreak = isCorrect
          ? Math.min(current.consecutiveCorrect + 1, 3)
          : 0;
        const nextMastered = options?.isReview ? current.mastered : nextStreak === 3;
        const becameMastered = !current.mastered && nextMastered;
        const updated: QuestionProgress = {
          ...current,
          categoryId,
          consecutiveCorrect: nextStreak as QuestionProgress["consecutiveCorrect"],
          mastered: nextMastered,
          lastAnsweredAt: new Date().toISOString(),
          totalAttempts: current.totalAttempts + 1,
          totalCorrect: current.totalCorrect + (isCorrect ? 1 : 0),
          lastReviewResult: options?.isReview
            ? isCorrect
              ? "correct"
              : "wrong"
            : current.lastReviewResult,
        };

        set((state) => ({
          progress: {
            ...state.progress,
            [questionId]: updated,
          },
        }));

        return { progress: updated, becameMastered };
      },
      getProgress: (questionId) => get().progress[questionId],
      resetAll: () => set({ progress: {} }),
      resetCategory: (categoryId) =>
        set((state) => ({
          progress: Object.fromEntries(
            Object.entries(state.progress).filter(
              ([questionId]) => !questionId.startsWith(questionIdPrefixes[categoryId]),
            ),
          ),
        })),
    }),
    {
      name: "quick_quiz_progress",
      partialize: (state) => ({ progress: state.progress }),
    },
  ),
);

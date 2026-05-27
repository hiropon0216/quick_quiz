import { create } from "zustand";
import type { CategoryId, Question, QuizMode, Screen, SessionResult } from "../types";
import { buildSessionQuestions } from "../utils/questionLoader";
import { normalizeAnswer } from "../utils/normalize";
import { useProgressStore } from "./progressStore";

interface QuizStore {
  currentScreen: Screen;
  selectedCategory: CategoryId | "all";
  selectedMode: QuizMode | null;
  sessionQuestions: Question[];
  currentIndex: number;
  buzzerPressed: boolean;
  isReview: boolean;
  lastResult: SessionResult | null;
  sessionResults: SessionResult[];
  isLoading: boolean;
  error: string | null;
  selectCategory: (categoryId: CategoryId | "all") => void;
  startSession: (mode: QuizMode, options?: { isReview?: boolean }) => Promise<void>;
  pressBuzzer: () => void;
  selectChoice: (choice: string) => void;
  submitAnswer: (input: string) => void;
  timeoutCurrentQuestion: () => void;
  nextQuestion: () => void;
  goToTop: () => void;
}

function judgeAnswer(question: Question, value: string): boolean {
  const normalized = normalizeAnswer(value);
  const accepted = [question.answer, question.reading, ...(question.acceptableAnswers ?? [])];

  return accepted.some((answer) => normalizeAnswer(answer) === normalized);
}

function getCurrentQuestion(state: QuizStore): Question | undefined {
  return state.sessionQuestions[state.currentIndex];
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  currentScreen: "top",
  selectedCategory: "all",
  selectedMode: null,
  sessionQuestions: [],
  currentIndex: 0,
  buzzerPressed: false,
  isReview: false,
  lastResult: null,
  sessionResults: [],
  isLoading: false,
  error: null,
  selectCategory: (categoryId) =>
    set({
      selectedCategory: categoryId,
      currentScreen: "mode_select",
      error: null,
    }),
  startSession: async (mode, options) => {
    set({ isLoading: true, error: null });

    try {
      const questions = await buildSessionQuestions(
        get().selectedCategory,
        useProgressStore.getState().progress,
        10,
        { masteredOnly: options?.isReview },
      );

      if (questions.length === 0) {
        set({
          isLoading: false,
          error: options?.isReview
            ? "復習できる習熟済み問題がありません。"
            : "出題できる未習熟問題がありません。",
        });
        return;
      }

      set({
        currentScreen: mode,
        selectedMode: mode,
        sessionQuestions: questions,
        currentIndex: 0,
        buzzerPressed: false,
        isReview: Boolean(options?.isReview),
        sessionResults: [],
        lastResult: null,
        isLoading: false,
      });
    } catch {
      set({
        isLoading: false,
        error: "問題データの読み込みに失敗しました。",
      });
    }
  },
  pressBuzzer: () => set({ buzzerPressed: true }),
  selectChoice: (choice) => {
    const question = getCurrentQuestion(get());
    if (!question) {
      return;
    }

    const isCorrect = judgeAnswer(question, choice);
    const { becameMastered } = useProgressStore
      .getState()
      .recordAnswer(question.id, question.categoryId, isCorrect, {
        isReview: get().isReview,
      });
    const result: SessionResult = {
      questionId: question.id,
      categoryId: question.categoryId,
      mode: "choice",
      isCorrect,
      answer: question.answer,
      explanation: question.explanation,
      selectedAnswer: choice,
      becameMastered,
      isReview: get().isReview,
    };

    set((state) => ({
      currentScreen: "result",
      lastResult: result,
      sessionResults: [...state.sessionResults, result],
    }));
  },
  submitAnswer: (input) => {
    const question = getCurrentQuestion(get());
    if (!question) {
      return;
    }

    const isCorrect = judgeAnswer(question, input);
    const { becameMastered } = useProgressStore
      .getState()
      .recordAnswer(question.id, question.categoryId, isCorrect, {
        isReview: get().isReview,
      });
    const result: SessionResult = {
      questionId: question.id,
      categoryId: question.categoryId,
      mode: "buzzer",
      isCorrect,
      answer: question.answer,
      explanation: question.explanation,
      inputAnswer: input,
      becameMastered,
      isReview: get().isReview,
    };

    set((state) => ({
      currentScreen: "result",
      lastResult: result,
      sessionResults: [...state.sessionResults, result],
    }));
  },
  timeoutCurrentQuestion: () => {
    const question = getCurrentQuestion(get());
    if (!question) {
      return;
    }

    const { becameMastered } = useProgressStore
      .getState()
      .recordAnswer(question.id, question.categoryId, false, {
        isReview: get().isReview,
      });
    const result: SessionResult = {
      questionId: question.id,
      categoryId: question.categoryId,
      mode: get().selectedMode ?? "choice",
      isCorrect: false,
      answer: question.answer,
      explanation: question.explanation,
      becameMastered,
      isReview: get().isReview,
    };

    set((state) => ({
      currentScreen: "result",
      lastResult: result,
      sessionResults: [...state.sessionResults, result],
    }));
  },
  nextQuestion: () => {
    const nextIndex = get().currentIndex + 1;
    if (nextIndex >= get().sessionQuestions.length) {
      set({ currentScreen: "session_end" });
      return;
    }

    set({
      currentScreen: get().selectedMode ?? "choice",
      currentIndex: nextIndex,
      buzzerPressed: false,
      lastResult: null,
    });
  },
  goToTop: () =>
    set({
      currentScreen: "top",
      selectedCategory: "all",
      selectedMode: null,
      sessionQuestions: [],
      currentIndex: 0,
      buzzerPressed: false,
      isReview: false,
      lastResult: null,
      sessionResults: [],
      error: null,
    }),
}));

export type CategoryId =
  | "history"
  | "geography"
  | "science"
  | "literature"
  | "sports"
  | "entertainment"
  | "politics"
  | "language"
  | "food"
  | "news";

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  icon: string;
  file: string;
  total: number;
  targetTotal: number;
}

export interface Question {
  id: string;
  question: string;
  answer: string;
  reading: string;
  acceptableAnswers?: string[];
  explanation: string;
  categoryId: CategoryId;
  difficulty: 1 | 2 | 3;
  choices: [string, string, string, string];
  hint?: string;
  publishedAt?: string;
  tags?: string[];
}

export interface QuestionProgress {
  questionId: string;
  categoryId: CategoryId;
  consecutiveCorrect: 0 | 1 | 2 | 3;
  mastered: boolean;
  lastAnsweredAt: string;
  totalAttempts: number;
  totalCorrect: number;
  lastReviewResult?: "correct" | "wrong";
}

export type ProgressMap = Record<string, QuestionProgress>;

export type QuizMode = "buzzer" | "choice";

export type Screen =
  | "top"
  | "mode_select"
  | "buzzer"
  | "choice"
  | "result"
  | "session_end";

export interface SessionResult {
  questionId: string;
  categoryId: CategoryId;
  mode: QuizMode;
  isCorrect: boolean;
  answer: string;
  explanation: string;
  selectedAnswer?: string;
  inputAnswer?: string;
  becameMastered: boolean;
  isReview: boolean;
}

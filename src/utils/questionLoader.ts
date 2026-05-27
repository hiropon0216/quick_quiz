import manifestData from "../data/questions/manifest.json";
import type { CategoryId, CategoryMeta, Question, ProgressMap } from "../types";
import { pickRandom } from "./shuffle";

const questionLoaders: Record<CategoryId, () => Promise<Question[]>> = {
  history: () => import("../data/questions/history.json").then(asQuestions),
  geography: () => import("../data/questions/geography.json").then(asQuestions),
  science: () => import("../data/questions/science.json").then(asQuestions),
  literature: () => import("../data/questions/literature.json").then(asQuestions),
  sports: () => import("../data/questions/sports.json").then(asQuestions),
  entertainment: () => import("../data/questions/entertainment.json").then(asQuestions),
  politics: () => import("../data/questions/politics.json").then(asQuestions),
  language: () => import("../data/questions/language.json").then(asQuestions),
  food: () => import("../data/questions/food.json").then(asQuestions),
  news: () => import("../data/questions/news_2026_Q2.json").then(asQuestions),
};

const cache = new Map<CategoryId, Question[]>();

export const categories = manifestData as CategoryMeta[];

export function getCategoryMeta(categoryId: CategoryId): CategoryMeta {
  const meta = categories.find((category) => category.id === categoryId);
  if (!meta) {
    throw new Error(`Unknown category: ${categoryId}`);
  }
  return meta;
}

export function getTotalQuestionCount(): number {
  return categories.reduce((sum, category) => sum + category.total, 0);
}

export function getTargetQuestionCount(): number {
  return categories.reduce((sum, category) => sum + category.targetTotal, 0);
}

export async function loadQuestions(categoryId: CategoryId): Promise<Question[]> {
  const cached = cache.get(categoryId);
  if (cached) {
    return cached;
  }

  const loaded = await questionLoaders[categoryId]();
  cache.set(categoryId, loaded);
  return loaded;
}

export async function loadQuestionsForSelection(
  categoryId: CategoryId | "all",
): Promise<Question[]> {
  if (categoryId !== "all") {
    return loadQuestions(categoryId);
  }

  const nonEmptyCategories = categories.filter((category) => category.total > 0);
  const chunks = await Promise.all(
    nonEmptyCategories.map((category) => loadQuestions(category.id)),
  );

  return chunks.flat();
}

export async function buildSessionQuestions(
  categoryId: CategoryId | "all",
  progress: ProgressMap,
  count = 10,
  options?: { masteredOnly?: boolean },
): Promise<Question[]> {
  const questions = await loadQuestionsForSelection(categoryId);
  const candidates = questions.filter((question) =>
    options?.masteredOnly ? progress[question.id]?.mastered : !progress[question.id]?.mastered,
  );

  return pickRandom(candidates, Math.min(count, candidates.length));
}

function asQuestions(module: { default: unknown }): Question[] {
  return module.default as Question[];
}

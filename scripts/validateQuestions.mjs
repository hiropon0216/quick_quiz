import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const questionsDir = path.join(root, "src", "data", "questions");
const manifestPath = path.join(questionsDir, "manifest.json");
const manifest = readJson(manifestPath);
const seenIds = new Set();
const validCategories = new Set(manifest.map((category) => category.id));
const errors = [];

for (const category of manifest) {
  if (!Number.isInteger(category.targetTotal) || category.targetTotal < category.total) {
    errors.push(`${category.id}: targetTotal must be an integer >= total`);
  }

  const filePath = path.join(questionsDir, category.file);
  if (!fs.existsSync(filePath)) {
    errors.push(`${category.id}: missing file ${category.file}`);
    continue;
  }

  const questions = readJson(filePath);
  if (!Array.isArray(questions)) {
    errors.push(`${category.file}: root must be an array`);
    continue;
  }

  if (questions.length !== category.total) {
    errors.push(`${category.file}: manifest total ${category.total} != actual ${questions.length}`);
  }

  for (const [index, question] of questions.entries()) {
    const label = `${category.file}[${index}]`;
    requireString(question.id, `${label}.id`);
    requireString(question.question, `${label}.question`);
    requireString(question.answer, `${label}.answer`);
    requireString(question.reading, `${label}.reading`);
    requireString(question.explanation, `${label}.explanation`);

    if (seenIds.has(question.id)) {
      errors.push(`${label}: duplicate id ${question.id}`);
    }
    seenIds.add(question.id);

    if (!validCategories.has(question.categoryId)) {
      errors.push(`${label}: invalid categoryId ${question.categoryId}`);
    }
    if (question.categoryId !== category.id) {
      errors.push(`${label}: categoryId ${question.categoryId} does not match ${category.id}`);
    }
    if (![1, 2, 3].includes(question.difficulty)) {
      errors.push(`${label}: difficulty must be 1, 2, or 3`);
    }
    if (!Array.isArray(question.choices) || question.choices.length !== 4) {
      errors.push(`${label}: choices must contain exactly 4 items`);
    } else if (!question.choices.includes(question.answer)) {
      errors.push(`${label}: choices must include answer "${question.answer}"`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Question validation passed: ${seenIds.size} questions`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function requireString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(`${label}: must be a non-empty string`);
  }
}

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const questionsDir = path.join(root, "src", "data", "questions");
const manifest = readJson(path.join(questionsDir, "manifest.json"));

for (const category of manifest) {
  const filePath = path.join(questionsDir, category.file);
  const questions = readJson(filePath).map((question) => ({
    ...question,
    explanation: buildExplanation(question),
  }));

  fs.writeFileSync(filePath, `${JSON.stringify(questions, null, 2)}\n`);
}

console.log("Added explanations to all questions");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function buildExplanation(question) {
  const clue = question.question.replace(/は何でしょう？$/, "");
  const answer = question.answer;

  switch (question.categoryId) {
    case "history":
      return `答えは「${answer}」です。「${clue}」に当たる人物・出来事・年代として押さえます。歴史問題では、答え単体だけでなく、同じ時代の人物、前後の出来事、政権や社会の変化と結び付けると定着しやすくなります。`;
    case "geography":
      return `答えは「${answer}」です。「${clue}」に該当する地理事項です。地理では、名称だけでなく、地図上の位置、周辺地域、首都・河川・山脈などの関連情報と一緒に覚えると、別の聞かれ方にも対応しやすくなります。`;
    case "science":
      return `答えは「${answer}」です。「${clue}」を表す理科・科学の基本事項です。単語を暗記するだけでなく、単位なら何を測るか、現象ならどのような仕組みか、元素記号なら物質名と用途を結び付けると理解が深まります。`;
    case "literature":
      return `答えは「${answer}」です。「${clue}」に対応する文学・芸術分野の基礎知識です。作品名と作者、作曲家と代表作、画家と作品をセットで覚えると、クイズで頻出する別角度の問いにも対応できます。`;
    case "sports":
      return `答えは「${answer}」です。「${clue}」に関するスポーツの基本用語です。競技名、ルール、得点方法、団体名、道具名をセットで整理すると、実際の試合や大会に関する問題にもつながります。`;
    case "entertainment":
      return `答えは「${answer}」です。「${clue}」に当たる芸能・エンタメ分野の基礎事項です。作品、人物、賞、制作上の役割を関連付けて覚えると、映画・音楽・アニメ・テレビの横断的な問題に強くなります。`;
    case "politics":
      return `答えは「${answer}」です。「${clue}」を表す政治・経済の基礎用語です。制度や用語は、誰が担うのか、何を決めるのか、社会や経済にどう影響するのかまで押さえると理解が安定します。`;
    case "language":
      return `答えは「${answer}」です。「${clue}」に当たる言語・ことわざの知識です。意味だけでなく、使う場面、似た表現、反対の意味を持つ表現も一緒に確認すると、文章問題や言い換え問題に対応しやすくなります。`;
    case "food":
      return `答えは「${answer}」です。「${clue}」に該当する食文化の基本事項です。料理名や食材は、発祥地域、原料、調理法、発酵や保存などの背景と結び付けて覚えると、雑学として使いやすくなります。`;
    case "news":
      return `答えは「${answer}」です。「${clue}」に関する現代社会・時事の基礎事項です。時事問題では、言葉の意味だけでなく、なぜ話題になるのか、社会・経済・技術・環境にどのような影響があるのかを押さえることが重要です。`;
    default:
      return `答えは「${answer}」です。「${clue}」に当たる基礎知識として押さえます。関連する用語や背景と結び付けて覚えると、別の聞かれ方にも対応しやすくなります。`;
  }
}

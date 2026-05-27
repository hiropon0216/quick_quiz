# Quick Quiz — 早押しクイズ練習アプリ

みんなの早押しクイズ（みんはや）などへの挑戦に向け、雑学の土台を作るための問題集アプリ。  
ゲーム感覚で楽しみながら習熟度を管理し、スマホでいつでも練習できる。

---

## 目次

1. [プロジェクト概要](#1-プロジェクト概要)
2. [技術スタック](#2-技術スタック)
3. [ディレクトリ構成](#3-ディレクトリ構成)
4. [問題データ仕様](#4-問題データ仕様)
5. [習熟度管理仕様](#5-習熟度管理仕様)
6. [ゲームモード仕様](#6-ゲームモード仕様)
7. [画面仕様](#7-画面仕様)
8. [状態管理設計](#8-状態管理設計)
9. [UX・アニメーション仕様](#9-uxアニメーション仕様)
10. [デプロイ仕様（GitHub Pages）](#10-デプロイ仕様github-pages)
11. [問題追加ワークフロー](#11-問題追加ワークフロー)
12. [実装フェーズ計画](#12-実装フェーズ計画)

---

## 1. プロジェクト概要

### ゴール
「みんなの早押しクイズ」に挑む前段として、雑学の土台知識を効率よく身につける。

### 主要コンセプト
- **問題数・分野の広さ**を最大限担保する（目標2,000問以上）
- 3回連続正解した問題は**習熟済み**として出題から除外し、未定着問題に集中できる
- 早押しの感覚を再現した**タイピング早押しモード**と、手軽な**4択モード**を搭載
- スマホでの使用を前提とした**レスポンシブ・ゲームライクUI**

---

## 2. 技術スタック

| 役割 | 採用技術 | 理由 |
|------|----------|------|
| フレームワーク | React 18 + TypeScript | コンポーネント分割・型安全 |
| ビルドツール | Vite | 高速ビルド・GitHub Pages対応 |
| スタイリング | Tailwind CSS | ユーティリティファーストでゲームUIを素早く構築 |
| アニメーション | Framer Motion | 宣言的なアニメーション・ジェスチャー対応 |
| 状態管理 | Zustand | 軽量・永続化プラグイン対応 |
| 永続化 | Zustand + localStorage | サーバー不要・オフライン動作 |
| デプロイ | GitHub Pages + GitHub Actions | プッシュだけで自動デプロイ |

---

## 3. ディレクトリ構成

```
quick_quiz/
├── public/
│   └── sounds/                  # SE音源（正解音・不正解音・カウントダウン音）
│       ├── correct.mp3
│       ├── wrong.mp3
│       └── countdown.mp3
├── src/
│   ├── data/
│   │   └── questions/
│   │       ├── index.ts         # 全カテゴリをまとめてexport
│   │       ├── history.json     # 歴史（300問目標）
│   │       ├── geography.json   # 地理（200問目標）
│   │       ├── science.json     # 理科・科学（250問目標）
│   │       ├── literature.json  # 文学・芸術（200問目標）
│   │       ├── sports.json      # スポーツ（200問目標）
│   │       ├── entertainment.json # 芸能・エンタメ（200問目標）
│   │       ├── politics.json    # 政治・経済（150問目標）
│   │       ├── language.json    # 言語・ことわざ（200問目標）
│   │       ├── food.json        # 食文化（150問目標）
│   │       ├── news_2025_Q3.json # 時事2025年Q3
│   │       ├── news_2025_Q4.json # 時事2025年Q4（随時追加）
│   │       └── ...              # 時事は四半期ごとにファイル追加
│   │
│   ├── store/
│   │   ├── quizStore.ts         # ゲーム進行中の状態
│   │   └── progressStore.ts     # 習熟度（localStorage永続化）
│   │
│   ├── hooks/
│   │   ├── useQuiz.ts           # 出題ロジック・正誤判定
│   │   ├── useTimer.ts          # カウントダウンタイマー
│   │   └── useSound.ts          # SE再生
│   │
│   ├── components/
│   │   ├── screens/
│   │   │   ├── TopScreen.tsx        # トップ・カテゴリ選択
│   │   │   ├── ModeSelectScreen.tsx # モード選択
│   │   │   ├── BuzzerScreen.tsx     # 早押しモードゲーム画面
│   │   │   ├── ChoiceScreen.tsx     # 4択モードゲーム画面
│   │   │   ├── ResultScreen.tsx     # 正誤フィードバック（1問ごと）
│   │   │   ├── SessionEndScreen.tsx # セッション終了サマリー
│   │   │   └── ReviewScreen.tsx     # 習熟済み復習モード
│   │   │
│   │   └── ui/
│   │       ├── QuestionText.tsx     # 1文字ずつ表示するテキスト
│   │       ├── BuzzerButton.tsx     # 大きな早押しボタン
│   │       ├── ChoiceButtons.tsx    # 4択ボタングループ
│   │       ├── ProgressBar.tsx      # 習熟進捗バー
│   │       ├── ComboCounter.tsx     # コンボ表示
│   │       ├── TimerRing.tsx        # 円形タイマー
│   │       ├── MasteryStars.tsx     # 連続正解★表示（★☆☆など）
│   │       └── ParticleEffect.tsx   # 正解時パーティクル
│   │
│   ├── utils/
│   │   ├── shuffle.ts           # Fisher-Yates シャッフル
│   │   ├── normalize.ts         # 答え正規化（全角半角・ひらがなカタカナ統一）
│   │   └── questionLoader.ts    # JSONを統合・フィルタリング
│   │
│   ├── types/
│   │   └── index.ts             # 全型定義
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Pages 自動デプロイ
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

---

## 4. 問題データ仕様

### 4.1 問題スキーマ

```typescript
interface Question {
  id: string;             // "{カテゴリ略称}-{3桁連番}" 例: "his-001"
  question: string;       // 問題文（日本語）
  answer: string;         // 正解（表記ゆれの代表形）
  reading: string;        // 正解のふりがな（早押しモードのひらがな入力対応）
  acceptableAnswers?: string[]; // 別表記・略称など正解として認める文字列
  category: Category;     // カテゴリ（後述）
  difficulty: 1 | 2 | 3; // 1=易 2=中 3=難
  choices: [string, string, string, string]; // 4択の選択肢（正解含む）
  hint?: string;          // ヒント文字列（将来実装用）
  publishedAt?: string;   // 時事問題のみ "YYYY-MM-DD" 形式
  tags?: string[];        // 検索・フィルタ用タグ（任意）
}
```

### 4.2 カテゴリ定義

```typescript
type Category =
  | "歴史"
  | "地理"
  | "理科・科学"
  | "文学・芸術"
  | "スポーツ"
  | "芸能・エンタメ"
  | "政治・経済"
  | "言語・ことわざ"
  | "食文化"
  | "時事";
```

### 4.3 問題ファイルのサンプル

```json
[
  {
    "id": "his-001",
    "question": "江戸幕府を開いた初代将軍は誰でしょう？",
    "answer": "徳川家康",
    "reading": "とくがわいえやす",
    "acceptableAnswers": ["家康"],
    "category": "歴史",
    "difficulty": 1,
    "choices": ["徳川家光", "徳川家康", "豊臣秀吉", "織田信長"]
  },
  {
    "id": "news-2025-001",
    "question": "2025年に発足した第〇〇代内閣の総理大臣は誰でしょう？",
    "answer": "...",
    "reading": "...",
    "category": "時事",
    "difficulty": 2,
    "choices": ["...", "...", "...", "..."],
    "publishedAt": "2025-10-01"
  }
]
```

### 4.4 問題数目標

| カテゴリ | 目標問題数 |
|----------|-----------|
| 歴史 | 300問 |
| 地理 | 200問 |
| 理科・科学 | 250問 |
| 文学・芸術 | 200問 |
| スポーツ | 200問 |
| 芸能・エンタメ | 200問 |
| 政治・経済 | 150問 |
| 言語・ことわざ | 200問 |
| 食文化 | 150問 |
| 時事（随時追加） | 〜500問 |
| **合計** | **〜2,350問** |

---

## 5. 習熟度管理仕様

### 5.1 習熟ロジック

| イベント | 処理 |
|----------|------|
| 正解 | `consecutiveCorrect += 1` |
| 不正解 | `consecutiveCorrect = 0`（どの段階からでもリセット） |
| `consecutiveCorrect === 3` | `mastered = true`（出題プールから除外） |

### 5.2 進捗データ型

```typescript
interface QuestionProgress {
  questionId: string;
  consecutiveCorrect: 0 | 1 | 2 | 3;
  mastered: boolean;
  lastAnsweredAt: string;   // ISO8601
  totalAttempts: number;
  totalCorrect: number;
}

// localStorage キー: "quick_quiz_progress"
// 型: Record<string, QuestionProgress>
```

### 5.3 出題プール構築ロジック

```
全問題リスト
  → mastered === false の問題のみ抽出
  → Fisher-Yates シャッフル
  → 先頭から順に出題
```

### 5.4 復習モード

- `mastered === true` の問題のみ出題
- 習熟ロジックは通常通り適用（不正解で0リセット・再習熟が必要）
- 復習モードで3回再正解しても mastered は維持（定着確認のみ）

---

## 6. ゲームモード仕様

### 6.1 早押しモード（Buzzerモード）

| フェーズ | 内容 |
|----------|------|
| 問題表示 | 問題文が1文字ずつ表示される（1文字/120ms、読点・句点で200ms停止） |
| 待機 | Space / Enter / 画面下の大ボタンタップで解答権取得 |
| 入力 | テキストフィールドが出現、10秒以内に入力してEnter送信 |
| 判定 | `normalize(入力) === normalize(answer)` または `acceptableAnswers`に含まれるか |
| タイムアップ | 10秒経過で不正解扱い |

**判定の正規化ルール（`normalize.ts`）**
- 全角英数字 → 半角に統一
- カタカナ → ひらがなに統一（`reading` フィールドとの比較時）
- 前後の空白除去
- 長音符「ー」は保持

### 6.2 4択モード（Choiceモード）

| フェーズ | 内容 |
|----------|------|
| 問題表示 | 問題文を一括表示 |
| 制限時間 | 20秒（残り5秒で色が変わる） |
| 選択 | 4つのボタンからタップ |
| 判定 | タップ直後に即時正誤判定 |
| タイムアップ | 20秒経過で不正解扱い、正解を表示 |

### 6.3 共通仕様

- 1セッションあたりの出題数: **10問**（固定）
- セッション中は同じ問題は出題しない
- カテゴリは「すべて」または単一カテゴリを選択可能

---

## 7. 画面仕様

### 7.1 トップ画面（TopScreen）

```
┌─────────────────────────────┐
│       ⚡ QUICK QUIZ          │  タイトル（ネオン風）
│                             │
│  ┌─────────────────────┐   │
│  │ すべてのカテゴリ      │   │  総残り問題数・習熟率
│  │ 残り1,842問 / 2,350問│   │
│  │ ▓▓▓▓▓░░░░░  21%習熟 │   │
│  └─────────────────────┘   │
│                             │
│  ┌──────────┐┌──────────┐ │
│  │ 歴史      ││ 地理      │ │  カテゴリグリッド
│  │ 残り287問 ││ 残り198問 │ │
│  └──────────┘└──────────┘ │
│  ...（各カテゴリカード）     │
│                             │
│  [復習モード]               │  習熟済み問題の復習
└─────────────────────────────┘
```

**カテゴリカードの表示要素**
- カテゴリ名・アイコン（絵文字）
- 残り問題数 / 総問題数
- 習熟率プログレスバー

### 7.2 モード選択画面（ModeSelectScreen）

```
┌─────────────────────────────┐
│  ＜ 歴史                    │
│                             │
│  モードを選んでください      │
│                             │
│  ┌─────────────────────┐   │
│  │   ⚡ 早押しモード     │   │
│  │  文字が流れてくる本格派│   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │   🎯 4択モード       │   │
│  │  ボタンでサクサク答える│   │
│  └─────────────────────┘   │
└─────────────────────────────┘
```

### 7.3 早押しゲーム画面（BuzzerScreen）

```
┌─────────────────────────────┐
│ 歴史  Q3/10    ★★☆          │  カテゴリ・進捗・連続正解★
│                             │
│  ╔═══════════════════╗      │
│  ║  〇〇時代に活躍し  ║      │  問題テキスト（1文字ずつ出現）
│  ║  た武将で、関ヶ原  ║      │
│  ║  ■               ║      │  ■=次の文字が出る場所
│  ╚═══════════════════╝      │
│                             │
│        ○ 23:45             │  円形タイマー
│                             │
│  ┌─────────────────────┐   │
│  │                     │   │  [解答権なし時] 大きな早押しボタン
│  │   ⚡ 押す！          │   │
│  │                     │   │
│  └─────────────────────┘   │
└─────────────────────────────┘

--- 解答権取得後 ---
┌─────────────────────────────┐
│                ⏱ 9          │  10秒カウントダウン
│  ┌─────────────────────┐   │
│  │ とくがわいえやす    │   │  テキスト入力フィールド（自動フォーカス）
│  └─────────────────────┘   │
│          [送信]             │
└─────────────────────────────┘
```

### 7.4 4択ゲーム画面（ChoiceScreen）

```
┌─────────────────────────────┐
│ 理科  Q5/10    ★☆☆          │
│                             │
│  ╔═══════════════════╗      │
│  ║  水の沸点は何度    ║      │
│  ║  でしょう？        ║      │
│  ╚═══════════════════╝      │
│                             │
│     ●━━━━━━━━━━○   18秒    │  タイムバー
│                             │
│  ┌──────────┐┌──────────┐ │
│  │   50°C    ││  100°C   │ │
│  └──────────┘└──────────┘ │
│  ┌──────────┐┌──────────┐ │
│  │  200°C   ││  373°C   │ │
│  └──────────┘└──────────┘ │
└─────────────────────────────┘
```

### 7.5 正誤フィードバック（ResultScreen）

**正解時**
```
画面全体が一瞬緑フラッシュ
                ✓
         正 解！！
      徳川家康

   🔥 3連続正解！  → ★★★ 習熟！
   （または ★★☆ あと1回！）

         [次の問題 →]
```

**不正解時**
```
画面が赤くシェイク
                ✗
         不 正 解
   正解: 徳川家康
   ⚠ 連続正解リセット（0/3に戻ります）

         [次の問題 →]
```

### 7.6 セッション終了画面（SessionEndScreen）

```
┌─────────────────────────────┐
│        セッション終了        │
│                             │
│        7 / 10               │  正解数
│       正解しました           │
│                             │
│  今回習熟達成:  3問 ⭐       │
│  累計習熟済み: 113問         │
│                             │
│  カテゴリ別                 │
│  歴史   ▓▓▓░░  4/5問        │
│  地理   ▓▓░░░  3/5問        │
│                             │
│  [もう一度]  [カテゴリ選択]  │
└─────────────────────────────┘
```

### 7.7 復習モード画面（ReviewScreen）

習熟済み問題のみ出題する特別モード。  
ゲームルールは通常と同じ（不正解で0リセット）。  
復習モードで3回正解しても `mastered` フラグは変化しない（定着確認のみ）。

---

## 8. 状態管理設計

### 8.1 quizStore（ゲーム進行中）

```typescript
interface QuizStore {
  // 状態
  currentScreen: Screen;
  selectedCategory: Category | "all";
  selectedMode: "buzzer" | "choice" | null;
  sessionQuestions: Question[];    // 今セッションの10問
  currentIndex: number;
  buzzerPressed: boolean;
  lastResult: "correct" | "wrong" | null;
  sessionResults: SessionResult[];

  // アクション
  selectCategory: (category: Category | "all") => void;
  selectMode: (mode: "buzzer" | "choice") => void;
  startSession: () => void;
  pressBuzzer: () => void;
  submitAnswer: (input: string) => "correct" | "wrong";
  selectChoice: (choice: string) => "correct" | "wrong";
  nextQuestion: () => void;
  endSession: () => void;
  goToTop: () => void;
}

type Screen =
  | "top"
  | "mode_select"
  | "buzzer"
  | "choice"
  | "result"
  | "session_end"
  | "review";
```

### 8.2 progressStore（永続化）

```typescript
interface ProgressStore {
  // 状態
  progress: Record<string, QuestionProgress>;

  // アクション
  recordAnswer: (questionId: string, isCorrect: boolean) => void;
  getMastered: () => QuestionProgress[];
  getProgress: (questionId: string) => QuestionProgress;
  resetAll: () => void;           // デバッグ用
  resetCategory: (category: Category) => void;
}
```

`zustand/middleware` の `persist` を使い、`localStorage` に自動保存。

---

## 9. UX・アニメーション仕様

### 9.1 テーマ・ビジュアル

| 要素 | 仕様 |
|------|------|
| カラーテーマ | ダーク背景（`#0a0a0f`）+ シアン/パープルネオンアクセント |
| フォント | 問題文: `Noto Sans JP`（太字）、数字: `Orbitron`（SF風） |
| 早押しボタン | グラデーション + グロー効果、押下時に収縮アニメーション |
| 4択ボタン | ガラスモーフィズム風、ホバー/タップでハイライト |

### 9.2 Framer Motionアニメーション一覧

| 場面 | アニメーション |
|------|--------------|
| 問題文表示 | 1文字ずつ `opacity: 0→1` フェードイン（120ms/文字） |
| 早押しボタン押下 | `scale: 1→0.9→1` バウンス |
| 正解フラッシュ | 画面全体 `background: #00ff00 → transparent`（200ms） |
| 不正解シェイク | `x: 0→-10→10→-10→0`（300ms） |
| ★増加 | ★が下からポップアップ（`scale: 0→1.3→1`） |
| 習熟達成 | パーティクルバースト + ★3つが回転しながら出現 |
| 画面遷移 | `AnimatePresence` + `x: 100→0` スライドイン |
| タイマー残り5秒 | 円形タイマーが赤くなり、パルスアニメーション |
| コンボカウンター | 数字が大きくなり縮むアニメーション |

### 9.3 スマホ対応

- タッチ操作最適化: 早押しボタン最小高さ `120px`
- 4択ボタン: 2×2グリッド、各ボタン最小高さ `80px`
- 入力フィールド: `font-size: 16px`（iOS自動ズーム防止）
- `viewport` に `user-scalable=no` は設定しない（アクセシビリティ配慮）

---

## 10. デプロイ仕様（GitHub Pages）

### 10.1 vite.config.ts の設定

```typescript
export default defineConfig({
  base: "/quick_quiz/",   // リポジトリ名に合わせる
  // ...
})
```

### 10.2 GitHub Actions ワークフロー（`.github/workflows/deploy.yml`）

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 10.3 デプロイフロー

```
ローカルで開発・問題JSON追加
    ↓
git add . && git commit -m "add questions: ..."
    ↓
git push origin main
    ↓
GitHub Actions が自動でビルド → gh-pages ブランチへデプロイ
    ↓
https://hiropon0216.github.io/quick_quiz/ で確認（スマホOK）
```

---

## 11. 問題追加ワークフロー

### 新カテゴリ問題の追加

1. Claude に以下を依頼:
   ```
   「{カテゴリ}」の雑学クイズ問題を100問、以下のJSONスキーマで出力してください。
   difficulty は 1（易）〜3（難）で配分してください。
   choices は必ず4択にしてください。
   （スキーマをコピペ）
   ```
2. 出力を `src/data/questions/{カテゴリ名}.json` として保存
3. `src/data/questions/index.ts` にimportを追加
4. `git push`

### 時事問題の追加

1. Claude に以下を依頼:
   ```
   2025年Q4（10〜12月）の時事問題を50問、以下のJSONスキーマで出力してください。
   publishedAt フィールドに問題が関係する日付を入れてください。
   ```
2. `src/data/questions/news_2025_Q4.json` として保存
3. `git push`

---

## 12. 実装フェーズ計画

### Phase 1: 基盤構築（最初に動くもの）
- [ ] Vite + React + TypeScript + Tailwind セットアップ
- [ ] 問題JSONスキーマ確定・各カテゴリ20問のサンプルデータ作成
- [ ] `questionLoader.ts`（JSON統合・フィルタリング）
- [ ] `progressStore.ts`（習熟ロジック・localStorage永続化）
- [ ] 4択モードのゲームループ（シンプルな見た目で動作確認）

### Phase 2: 早押しモード
- [ ] `QuestionText.tsx`（1文字ずつ表示）
- [ ] `BuzzerButton.tsx`（タップで解答権取得）
- [ ] テキスト入力・正規化判定
- [ ] タイマー（10秒）

### Phase 3: UI仕上げ・アニメーション
- [ ] ダークテーマ・ネオンカラー適用
- [ ] Framer Motion アニメーション全実装
- [ ] 正解/不正解フラッシュ・シェイク
- [ ] 習熟達成パーティクル
- [ ] スマホ操作最適化

### Phase 4: 問題データ拡充
- [ ] 全カテゴリ問題をClaudeで生成（目標2,000問）
- [ ] 時事問題追加

### Phase 5: GitHub Pages デプロイ
- [ ] `vite.config.ts` の `base` 設定
- [ ] GitHub Actions ワークフロー作成
- [ ] 本番デプロイ・スマホ実機確認

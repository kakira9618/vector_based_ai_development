---
name: lt-slides
description: LT (ライトニングトーク) 用の高橋メソッド風スライドを markdown (ベクタ) から HTML + JavaScript (ラスタ) に変換するスキル。プロジェクトの初期化、main.md の h2 をページ区切りにした html スライドの生成・更新、Puppeteer での PDF 化をサポートする。ユーザーが「LTスライド作って」「スライドプロジェクト初期化」「main.md からスライド生成」「スライドを更新/追従」「スライドをPDFに」などと依頼したときに使う。
---

# LT スライド生成スキル

markdown (`main.md`) というベクタ表現を、LT向けの高橋メソッド風スライド (`slide/index.html`) というラスタ表現に変換する。さらに Puppeteer で PDF 化する。

このスキルは以下の4つの操作をサポートする：
1. **init** — スライドプロジェクトのディレクトリ構造・`main.md` 雛形・`package.json` を用意
2. **create** — `main.md` から `slide/index.html` を新規生成
3. **update** — `main.md` の変更を `slide/index.html` に追従
4. **pdf** — `slide/index.html` を Puppeteer で PDF 化

---

## 共通の前提

### ディレクトリ構成
```
<project>/
├── main.md                 # スライドのソース（ベクタ）
└── slide/
    ├── index.html          # 生成されるスライド（ラスタ）
    ├── resources/          # 画像・動画ファイル置き場
    │   ├── foo.png
    │   └── bar.mov
    └── export_pdf.js       # PDF 変換スクリプト（pdf 操作で生成）
```

### main.md の仕様
- `# タイトル` がスライド全体のタイトル
- `## 見出し` が **スライドのページ区切り**（各 h2 が 1 ページ）
- 箇条書き (`-`) や番号リスト (`1.`)、テーブル (`|`) をそのまま使える
- 画像・動画は **ファイル名を行内に書く**（`slide/resources/` から自動的に探す）
  ```
  ## スライドのタイトル
  - some_image.png
  - some_video.mov
  ```
- URL は自動でリンク化される
- `QRコード: file.png` のような書き方も許容される

---

## 操作 1: init — プロジェクト初期化

ユーザーが「スライドプロジェクト初期化」「LT スライド作りたいから準備して」「セットアップして」などと言ったとき。既にファイルが存在する場合は **上書きせず** ユーザーに確認する。

### 手順

1. 以下のディレクトリを作成：
   - `slide/`
   - `slide/resources/`
2. 以下のファイルを作成（存在しない場合のみ）：
   - `main.md` — `assets/main.template.md` をベースに、タイトル・発表者名・日付を空欄または placeholder で書き出す
   - `package.json` — puppeteer 依存を含めた最小構成
   - `.gitignore` — `node_modules/` と `.DS_Store` を含める
3. ユーザーに以下を案内：
   - `main.md` に内容を書いてから「スライド作って」と依頼すると create が走る
   - 画像・動画は `slide/resources/` に置いてファイル名を `main.md` に記載する

### package.json の最小構成
```json
{
  "name": "<project-name>",
  "version": "1.0.0",
  "type": "commonjs",
  "dependencies": {
    "puppeteer": "^24.0.0"
  }
}
```

### .gitignore の最小構成
```
node_modules/
.DS_Store
```

### 確認事項
- プロジェクト名は `package.json` やカレントディレクトリ名から推定、不明なら聞く
- タイトル・発表者名・日付は、ユーザーが既に伝えていればそれを埋める。未指定なら placeholder のままにしてユーザーに編集を促す

---

## 操作 2: create — スライド生成

ユーザーが「スライドを作って」「main.md からスライド生成して」などと言ったとき。

### 生成仕様（LT / 高橋メソッド風の必須要件）

1. **高橋メソッド風** — 文字は **極力大きく・太く・シンプル** に。1スライド1メッセージ。
2. **レスポンシブ** — 1920x1080 固定キャンバスを用意し、`transform: scale()` でビューポートに合わせてフィット。解像度違いでも同じ見た目。
3. **画像/動画** — `slide/resources/` から探して画面中央に配置。複数枚なら横並び（`two-images` クラスなどで小さめに）。
4. **画像クリックで拡大** — lightbox を実装。クリックで拡大、再度クリックか × ボタンか Esc で閉じる。
5. **動画** — `autoplay loop muted playsinline` で自動再生ループ。
6. **ナビゲーション** — 以下すべてに対応：
   - 次へ: Enter / → / Space / 画面右側クリック
   - 前へ: ← / Backspace / 画面左端 30% クリック
7. **アニメーション** — スライド遷移に控えめなフェード + スライドアップ（0.4s 程度）。しつこくならない。
8. **デザイン** — ダーク背景 (#0a0a0a) + アクセントカラー（シアン #6cf / ピンク #f8b）のグラデーション。視認性重視かつクリエイティブ。
9. **UI** — 下部にプログレスバーとスライド番号 (`N / Total`)。
10. **フォント** — 日本語: `'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif`。

### 参考構造

`assets/index.template.html` に生成例がある。これを **出発点** として、`main.md` の内容に応じてスライド数・レイアウトを調整する（テンプレートをそのまま書き出すのではなく、内容に合わせて作り直すこと）。

### フォントサイズ目安（1920x1080 キャンバス基準）
- `h1`（タイトル）: 160px / 900
- `h2`（各スライド見出し）: 140px / 900
- `ul`, `ol` リスト: 72px / 700
- `subtitle`（補足）: 40px / 500
- `table`: 32px / 600
- `link`: 26px

### 出力先
`slide/index.html`

---

## 操作 3: update — 追従

ユーザーが「main.md を更新したから追従して」「スライドを main.md に合わせて」などと言ったとき。

### 手順
1. `main.md` を読む
2. `slide/index.html` を読む
3. 差分を見て、必要なスライドだけを追加・変更・削除する
4. **全体を書き直さない**。既存のデザインやアニメーション、スケーリングロジックは維持する
5. 新規で参照される画像・動画があれば `slide/resources/` に存在するか確認し、なければユーザーに知らせる

---

## 操作 4: pdf — PDF 化

ユーザーが「PDF にして」「スライドをPDF化」などと言ったとき。

### 手順
1. `slide/export_pdf.js` を生成する（`assets/export_pdf.template.js` 参照）
2. PDF の出力先ファイル名はプロジェクト名から自動推定（例: `slide/<project-name>.pdf`）。ユーザー指定があればそれに従う
3. `package.json` に `puppeteer` 依存がなければ追加を案内
4. 実行コマンドをユーザーに伝える：
   ```
   npm install
   node slide/export_pdf.js
   ```

### 注意点（export_pdf.js の実装）
- `@page { size: 1920px 1080px; margin: 0; }` で 1 ページ 1 スライド
- `.stage` の `transform: scale()` を `none` で打ち消す
- `.slide` を全ページ `display: flex` で表示、`page-break-after: always`
- 画像の `load` を全部待つ
- `progress`・`slide-number`・`lightbox` は `display: none`
- `preferCSSPageSize: true` を忘れずに

---

## ユーザーとのやり取り方針

- **初回 create 時**: `main.md` と `slide/resources/` の中身を確認し、参照されている画像が実在するかチェックしてから生成する
- **デザインのカスタマイズ依頼**: 配色・フォント・アニメーションは調整可能だが、「高橋メソッド風・文字大きく」は LT スライドの根幹なので、ユーザーが明示的に変えたいと言わない限り維持する
- **update 時**: 差分パッチ方針。全書き直しは避ける

# "ベクタ" に注目したAI活用

2026/4/21 に [AIエンタメの未来を語り尽くす会](https://genai-expo-team.connpass.com/event/389724/?utm_campaign=event_message_to_selected_participant&utm_source=notifications&utm_medium=email&utm_content=title_link) で発表したスライド資料のリポジトリです。

スライド資料の "ベクタ" 表現である markdown テキストから "ラスタ"表現である スライドが簡単に生成できます。

## 使い方

### スライド骨子の作成
main.md にスライド内容をmarkdown で書きます。

画像や動画を挿入したい場合は、resources の中に、画像または動画を入れて、markdown ではファイル名を記述しておきます。

```
## "ベクタ" ってなんやねん
- 01_vector_vs_raster.png
```

h2 でスライドのページを区切る仕様です。

### Claude Code によるスライド本体の生成

prompt/create.txt にあるプロンプトを claude code に投げるだけでスライドが slide/index.html にできます。

```
main.mdに作ってほしいスライドの内容を書いたので、スライド形式のアプリケーションをhtml + javascript で作って。
LTで使えるように、できる限り文字は大きく太く、シンプルに。高橋メソッド風で。
画像や動画は指示されたものをresourcesから探して、画面中心に並べてほしい。
デザインは視認性良く、けれどもクリエイティブな感じでお願いします。
各スライドは main.md の h2 を区切りとし、Enterキーやマウスクリックの入力待ちをすること。
アニメーションも適宜入れて欲しいが、しつこくならないように。
出力は slide の中に index.html という名前でお願い。
```

出力例：
```
  Read 1 file, listed 2 directories (ctrl+o to expand)

⏺ Write(slide/index.html)
  ⎿  Wrote 373 lines to slide/index.html
       2 <html lang="ja">
       3 <head>
       4 <meta charset="UTF-8">
       5 <meta name="viewport" content="width=device-width, initial-scale
         =1.0">
       6 <title>"ベクタ" に注目したAI活用</title>
       7 <style>
       8 * {
       9   margin: 0;
      10   padding: 0;
     … +382 lines (ctrl+o to expand)

⏺ 作成しました。slide/index.html をブラウザで開けばプレゼンが始まります。

  操作方法:
  - 次へ: Enter / 右矢印 / スペース / 画面右側クリック
  - 前へ: 左矢印 / Backspace / 画面左端(30%)クリック

  デザインのポイント:
  - 高橋メソッド風の大きく太い文字（clamp で画面サイズに応じてスケール）
  - ダーク背景にグラデーションアクセントカラー（シアン / ピンク）
  - スライド遷移時のフェード＋スライドアップアニメーション（控えめに）
  - 画像は画面中央に配置、2枚の場合は横並び
  - 動画（.mov）は自動再生・ループ
  - 下部にプログレスバーとスライド番号表示
```

### 更新したいときは

main.md を加筆修正し、claude code でprompt/update.txtのように指示します：

```
main.md を更新したので追従して欲しい
```


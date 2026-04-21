# "ベクタ" に注目したAI活用
- kakira9618
- 2026/4/21

## 問題提起：個人開発での問題

場面: AIを組み込んだ製品をつくる

- アイデア（そもそも何を作るか）
- コスト（料金、運用、生成スピード）

## 解決策の提示
- "ベクタ" に注目しよう

## "ベクタ" ってなんやねん
- 01_vector_vs_raster.png

## "ベクタ" のいいところ
"ベクタ" = 構造化テキスト。

1. 生成コストが低い
2. ピンポイント修正ができる
3. ドメイン変更が容易い

## 例: ラスタ画像から背景を"ベクタ"で抽出
- background_svg_extract_prompt.png
- background_svg_extract_result.png

## 画像以外の "ベクタ"

- 画像以外のメディアにも "ベクタ" っぽい表現がある

| メディア | ラスタ形式 | ベクタ形式 |
|----------|-----------|-----------|
| 画像 | JPG、PNG（ピクセルの集合） | SVG、PostScript（ベジェ曲線・ポリゴンの定義） |
| 音楽 | WAV、MP3（波形データ） | MIDI、楽譜画像（スコアデータ） |
| 動画 | GIF、AVI、MP4（フレームの連続） | Flash（リソース＋スクリプト） |
| スライド | PPTX（テキスト・画像・レイアウトをリッチに統合） | Markdown（構造化されたテキスト） |
| グラフ | png（画像） | csv（表データ） |
| ソースコード | .js、.html（テキスト） | Markdown（自然言語での仕様） |

## 例: 音楽のベクタ (MIDI) を入力に
- piano_tensaku_tweet.png
- https://x.com/kakira9618/status/1919286710254317639

## 現在 iPadアプリ化中
- piano_tensaku_product.png

## ソースコードは究極の"ベクタ"
- 03_source_code_as_ultimate_vector_representation.png

## 例: 手書き 3DCG アニメーション
- handwrite_to_3dcg_animation_prompt.png
- handwrite_to_3dcg_animation_result.mov

## もちろんこのスライドも "ベクタ" からの生成
- slide_from_vector.png
- slide_from_vector_prompt.png
- ソース: https://github.com/kakira9618/vector_based_ai_development

## 宣伝
個人開発AIプロダクトのアイデア原石
- X: kakira9618
- title-final.png
- https://techbookfest.org/product/gm3siYnQ8wFwSDuY3WdrnY?productVariantID=aa09VYxqsyBF4QRKXCk9X6&utm_campaign=share
- QRコード: qrcode.png


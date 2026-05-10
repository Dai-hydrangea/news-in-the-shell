# NEWS IN THE SHELL

> Ghost in the Shell 風 UI で 自分の RSS フィードを観測する、 ブラウザ単体ツール。

![concept](https://img.shields.io/badge/style-cyan%23%2300e5ff-00e5ff)
![license](https://img.shields.io/badge/license-MIT-green)
![browser](https://img.shields.io/badge/runtime-browser%20only-blue)

**Live demo**: <https://dai-hydrangea.github.io/news-in-the-shell/>

## なにをする？

- 複数の RSS フィードを取得し、 タイトルから抽出したキーワードを 3D 多球儀で可視化
- リボルバー UI: ◀ ▶ で球を切り替え、 主役球は中央固定
- キーワードをタップすると、 そのキーワードを含む記事一覧が右からスライドイン
- カテゴリ別 / ソース別 でビュー切替可能
- **ユーザーが追加したフィードに合わせて球の数が自動で増減**

## ブラウザだけで動く

- Three.js / DOMParser / localStorage のみ。 サーバー不要。
- データはあなたのブラウザの localStorage に保存。 サーバーへの送信なし。
- 例外: ブラウザ CORS 制約のため、 RSS 取得には CORS proxy が必要。 自前 Cloudflare Worker (5 分・無料) を推奨。

## 使い方

1. <https://dai-hydrangea.github.io/news-in-the-shell/> を開く
2. **⚙ SETTINGS** から:
   - サンプルフィードをワンクリック追加 (Hacker News / arXiv / Wikinews / NHK 等)
   - または好きな RSS URL を直接追加
   - 自前 CORS proxy URL を設定 (任意、 デフォルトは公開 proxy)
3. **SAVE & RELOAD** で観測開始

## 自前 proxy のセットアップ (推奨)

`proxy/worker.js` を Cloudflare Worker に貼って Deploy するだけ。 5 分。 詳細は [proxy/README.md](./proxy/README.md)。

## 著作権について

本ツールは **RSS リーダー** の一種で、 ニュースコンテンツを配信していません。
ユーザーが自ら選んだ feed を、 ブラウザ内で取得・可視化する道具です。

- 各記事の著作権は元配信元に帰属
- タイトル + 短い要約 (200 文字以下) のみ表示
- 「OPEN ARTICLE →」 から必ず元サイトへ誘導

詳細は [public/tos.html](./public/tos.html)。

## 開発の経緯

このツールは、 自分用の自閉的なニュース観測ツール NetScope のブラウザ完結版として作りました。

- 自分用 (NetScope): RSS 直接ハードコード、 Python パイプライン、 自分の Mac/iPhone でのみ閲覧
- 公開用 (News In The Shell, このリポジトリ): デフォルト feed なし・BYOF・完全 browser-only

公開版は **「中身を持たないツール」** として設計されています。 ユーザーが feed を追加することで初めて動きます。 これが、 著作権・倫理上の境界を明確にする設計判断です。

詳しくは note 記事:

- [News In The Shell ─ ブラウザだけで RSS を観測する自分のための道具](#)  ← 公開後リンク追加

## ローカル開発

```bash
git clone https://github.com/Dai-hydrangea/news-in-the-shell.git
cd news-in-the-shell/public
python3 -m http.server 8080
# → http://localhost:8080/
```

## 関連プロジェクト

- [NewsGlobe](https://github.com/Dai-hydrangea/news-globe) ─ 同作者の NHK 政治ニュース可視化 (前身)
- NetScope ─ 自分用版 (非公開、 ハードコード feeds)

## ライセンス

MIT License ─ fork・改変・商用利用すべて可能。 PR 歓迎。

## Author

Daisaku Seto / [@Dai-hydrangea](https://github.com/Dai-hydrangea)

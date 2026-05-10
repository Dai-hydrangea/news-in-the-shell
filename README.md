# NEWS IN THE SHELL

> 攻殻機動隊風の RSS キーワード多球儀。 ブラウザだけで動く、 BYOF (自分のフィードを持ち寄る) ツール。
> Ghost in the Shell-styled RSS keyword orrery. Browser-only, BYOF.

![license](https://img.shields.io/badge/license-MIT-green)
![browser](https://img.shields.io/badge/runtime-browser%20only-blue)
![lang](https://img.shields.io/badge/UI-JA%20%7C%20EN-00e5ff)
![byof](https://img.shields.io/badge/feeds-BYOF-ff7eb9)

🌐 **Live demo**: <https://dai-hydrangea.github.io/news-in-the-shell/>
📝 **note 記事**: [Claude Code で自分のためのツールを作った](https://note.com/dai_hydrangea/n/n001e2451070b) ─ 開発の経緯・設計判断・哲学を書いてます (X リポストで無料で読めます)

---

## 🤖 これは何？

複数の RSS フィードを取得して、 タイトルから抽出したキーワードを 3D 多球儀の上に並べるブラウザツール。

- リボルバー UI: ◀ ▶ で球を切り替え、 主役球は中央固定
- キーワードをタップ → 関連記事一覧が右からスライドイン
- **追加した feed のカテゴリ数に合わせて球が自動で増減**
- 日本語 / 英語の **即時切替** (右上 `JA / EN` ボタン)
- 攻殻機動隊風の cyber 美術 (流れる漢字、 グリッドフロア、 スキャンビーム)

ニュースを **読ませない** 設計。 タイトルとキーワードだけ見えて、 本文は元サイトに行かないと読めない。 「今 こういうのが多いんだな」 とだけ感じる距離感。

---

## 🚀 3 通りの使い方

### A. ブラウザで開くだけ (5 秒)

```
https://dai-hydrangea.github.io/news-in-the-shell/
```

ゼロセットアップ。 iPhone / iPad / Mac / PC どれでも OK。 一度試したいだけならこれ。

### B. ローカルで動かす (1 分)

自分の Mac の中で完結させたいなら:

```bash
git clone https://github.com/Dai-hydrangea/news-in-the-shell.git
cd news-in-the-shell
python3 -m http.server 8080
# → http://localhost:8080/
```

または GitHub の **Code** → **Download ZIP** でも OK。

### C. Fork して自分の道具にする (15 分)

完全に自分のものにしたいなら:

1. このリポジトリの右上の **Fork** ボタン
2. fork 先の **Settings → Pages** → Source: `main` / folder: `/`
3. (任意) `proxy/worker.js` を Cloudflare Worker にデプロイ → `index.html` の `DEFAULT_PROXY` を 自分の URL に書き換え
4. 自分の URL `https://<your-id>.github.io/news-in-the-shell/` で公開
5. note や X で 「自分版」 として配布、 改造、 再配布 OK

---

## 🛠 みんなで AI と一緒に作ろうぜ

> **これは 「私が止めたら止まる道具」 ではなく、 「私が止まっても残る道具」 にしたかった。**

このツール自体、 私 (個人開発者) と Claude Code (AI コーディング) で 1 セッションで作ってます。 つまり、 同じやり方で **あなたも自分の道具を作れる**。

### Fork して、 AI に投げてみる

- 「色を ◯◯ にしたい」
- 「フィードに XXX を追加して、 こういう挙動にして」
- 「球の代わりに星座っぽい配置にしたい」
- 「韓国語の UI も追加して」
- 「キーワードに AI 要約 (Anthropic / OpenAI API) を足したい」

Claude / ChatGPT / GitHub Copilot / Cursor / Windsurf ─ 好きな AI に **README + 該当ファイル** を渡して 「こうしたい」 と言えば、 たいてい動くものが返ってきます。

技術的には HTML 1 ファイル (Three.js は CDN) + JS の小さな pipeline + 任意の Cloudflare Worker。 AI に説明しやすいスケール。

「個人開発 + AI」 で道具を作るプロセスは、 別途 note でも書き溜めてます (作者 [@Dai-hydrangea](https://github.com/Dai-hydrangea))。

---

## ✨ 機能まとめ

| 機能 | 内容 |
|---|---|
| 球の自動増減 | 追加した feed のカテゴリ数で球の数が自動調整 |
| BYOF | デフォルト feed 0 件、 ユーザーが選んで追加 |
| サンプル feed | Hacker News / arXiv / Wikinews / NHK 等。 `CC` `PUB` `RSS` ライセンスバッジ付 |
| キーワード抽出 | カタカナ 3+ / 漢字 2-6 / EN 4+ 文字を多言語対応 |
| 関連度可視化 | キーワード共起 → エッジ太さ・色濃度に反映 |
| リボルバー UI | 主役 1 + 衛星 N-1 で 1 つだけ大きく表示 |
| キーワード詳細 | タップで関連記事一覧 + OPEN ARTICLE で元サイトへ |
| カテゴリ / ソース表示切替 | 同じ記事群を 2 視点で観測 |
| 日英切替 | navigator.language で初期判定、 右上ボタンで即時切替、 localStorage 永続化 |
| 自動更新 | 30 分ごと、 手動 ⟳ REFRESH ボタンも |

---

## 🌀 中身を持たないツール

このツールは、 **デフォルトで 0 件の feed** から始まります。 ユーザーが追加するまで何も観測しない。

これは法的境界 (RSS Reader 慣行 = Inoreader / Reeder と同位置付け) でもあり、 設計哲学でもあります。 中央に固定された 「正しいニュース」 がない、 おすすめアルゴリズムもない。 ユーザーが選んだ単語が並んでいるだけ。

中心が空洞だから、 ユーザーが自由に動ける余地ができる。 河合隼雄が日本文化の特徴として論じた **中空構造** に近い設計判断です。

---

## 🔧 自前 proxy のセットアップ (任意)

ブラウザ CORS 制約のため、 RSS の取得には中継 (proxy) が必要です。 デフォルトでは作者運用の Cloudflare Worker (`news-in-the-shell-proxy.daisaku-seto.workers.dev`) を使うので、 セットアップ不要で動きます。

ただし作者 proxy は無料枠 (10万 req/日) 共有なので、 重い使い方をする場合は自前で立ててください:

- [proxy/README.md](./proxy/README.md) ─ Cloudflare Worker 5 分セットアップ手順

立てたら ⚙ SETTINGS → CORS PROXY URL に貼って 「SAVE & RELOAD」。

---

## ⚖️ 著作権について

本ツールは **RSS リーダー** の一種。 ニュースコンテンツを配信せず、 ユーザーが自ら選んだ feed を、 ブラウザ内で取得・可視化する道具。

- 各記事の著作権は元配信元に帰属
- タイトル + 短い要約 (200 文字以下) のみ表示
- 「OPEN ARTICLE →」 から必ず元サイトへ誘導
- サンプル feed は CC / public / 大手配信元 (RSS Reader 慣行) を区別表示
- 削除依頼は GitHub Issues で受付、 速やかに対応

詳細は [tos.html](./tos.html)。

---

## 関連プロジェクト

- [NewsGlobe](https://github.com/Dai-hydrangea/news-globe) ─ 同作者の NHK 政治ニュース可視化 (前身)
- NetScope ─ 自分用版 (非公開、 ハードコード feeds)

---

## ライセンス

**MIT License** ─ fork・改変・商用利用すべて可能。 PR 歓迎、 fork は祝福。

「私の道具」 ではなく 「使い方を発見してくれる人の道具」 として置いてあります。

---

## Author

Daisaku Seto / [@Dai-hydrangea](https://github.com/Dai-hydrangea)

Built with [Claude Code](https://claude.com/claude-code) ─ 個人開発 × AI ペアプログラミング。

---

> **問い合わせ・削除依頼・改善提案は [GitHub Issues](https://github.com/Dai-hydrangea/news-in-the-shell/issues) へ。**

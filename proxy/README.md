# CORS Proxy ─ Cloudflare Worker

ブラウザから RSS XML を取得するための中継。 Cloudflare Worker の無料枠 (1日10万リクエスト) で運用できる。

## 5 分でデプロイ

1. **Cloudflare アカウント** ([dash.cloudflare.com](https://dash.cloudflare.com/)) を作成 (無料)
2. 左メニュー → **Workers & Pages** → **Create application** → **Create Worker**
3. テンプレ名 (適当に `news-in-the-shell-proxy` など) → **Deploy**
4. **Edit code** → 既存コード全消去 → このフォルダの `worker.js` を貼り付け → **Save and deploy**
5. 払い出された URL (例: `https://news-in-the-shell-proxy.your-account.workers.dev`) をコピー

## アプリへの登録

News In The Shell の **⚙ SETTINGS** を開いて:

```
CORS PROXY URL: https://news-in-the-shell-proxy.your-account.workers.dev/?url=
```

末尾の `?url=` を忘れずに。

## なぜ proxy が必要？

ブラウザから RSS フィードを直接取得しようとすると、 多くのサイトが CORS ヘッダを返さないので失敗します。 これは **News In The Shell に限った話ではなく**、 ブラウザのセキュリティモデル全般の問題。

proxy は RSS XML を素通しで返すだけ。 内容には一切手を加えません (キャッシュは 5 分)。

## レート制限

- 1 IP あたり 60 リクエスト / 分
- 1 ファイル最大 5MB
- フェッチタイムアウト 15 秒

自分用なら充分。 公開して大量にトラフィックを受けるなら、 Workers KV / Durable Objects を使った厳密なレート制限に書き換えてください。

## 公開 proxy で済ませたい場合

設定で URL を `https://corsproxy.io/?` に設定すれば動きます。 ただし:
- レート制限は厳しい (頻繁に 429 が返る)
- 第三者運営なのでログ収集される可能性
- 突然停止する可能性

実用には自前 Worker を強く推奨。

## License

MIT (アプリ本体と同じ)。

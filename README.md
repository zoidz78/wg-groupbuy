# WG团购群 — 团购收款看板

一个简单的、自托管的收据风格看板，用于追踪团购订单和收款情况。为
WG团购群制作，但换一套数据后也可用于任何团购。

**在线地址：** https://zoidz78.github.io/wg-groupbuy/

## 功能

- 卡片式排版：统计信息、每位成员、备货清单分别独立成卡片，手机上
  一屏可看到 2～3 张卡片
- 按口味/商品逐一列出每位成员的订单明细，附单项小计和个人总计
- 一键标记付款状态（"标记已付款" / "已付款 ✓"），**所有打开此链接
  的人实时共享同一份付款状态**（详见下方"共享实时收款状态"）
- 顶部统计卡片：参团人数、各单位（盒/kg等）的数量、订单总额、已收
  款、未收款——点击"总数量（单位）"这一行，会弹出该单位下每种商品
  的具体数量与小计，点击弹窗任意处关闭
- 备货清单，显示每种口味/商品总共需要订购的数量
- 按 全部 / 未付款 / 已付款 筛选
- 支持多场团购，超过一场后以标签页形式切换（按日期排序）
- 自动浅色/深色模式，手机和电脑均适配

## 文件说明

| 文件 | 作用 |
|---|---|
| `index.html` | 整个应用程序——读取 `manifest.json` 及其引用的 `data-*.json` 文件，并通过 Firebase 读写付款状态。通常不需要改动这个文件。 |
| `manifest.json` | 列出所有团购场次：`{ date, label, file }`。日期最新的排在最前面。 |
| `data-<日期>.json` | 每场团购一个文件：商品、价格，以及每位成员的订单。 |

付款状态**不**存放在仓库的任何文件里——它实时存放在 Firebase
Firestore 中，见下方说明。

## 新增一场团购

1. 新建一个 `data-<日期>.json` 文件（结构见下方"数据结构"部分）。
2. 在 `manifest.json` 中添加一行：
   ```json
   { "date": "2026-09-14", "label": "9/14", "file": "data-2026-09-14.json" }
   ```
3. 把这两个文件都上传到本仓库（Add file → Upload files）。
   `index.html` 不需要改动。

`manifest.json` 中有 2 场以上的记录时，页面顶部会自动出现标签页，可
以在不同场次的团购之间切换。

## `data-<日期>.json` 数据结构

```json
{
  "groupName": "WG团购群",
  "products": {
    "sig": { "label": "招牌鲜肉馄饨", "price": 6.5 },
    "pork_belly": { "label": "五花肉", "price": 12.0, "unit": "kg" }
  },
  "orders": [
    { "name": "小明", "items": { "sig": 3 } },
    { "name": "小华", "items": { "sig": 1, "shrimp": 1 } },
    { "name": "阿强", "items": { "pork_belly": 0.5 } },
    { "name": "小美 & 阿杰", "items": { "corn": 2 } }
  ]
}
```

- `products` —— 短键 → `{ label（中文名）, price, unit?（可选）}`。`unit`
  为可选字段，默认是`"盒"`—— 如果商品按重量或其他非盒装单位出售，
  需明确设置（例如`"kg"`）。
- `orders` —— 每条明细对应一笔要收的款。`items` 里的数量可以是小数
  （例如`0.5`表示半份/半公斤）。
- **合并订单**：如果两位成员一起拼单、并作为一笔总款支付，用**一
  条**记录、姓名合并成一个字符串表示，例如`"name": "小美 & 阿杰"`。
- **价格/品种缺失或待确认的商品**：如果某件商品价格暂时无法确定
  （例如价目表上没有，或指代不清楚），仍然把它加进该成员的
  `items` 里，但在 `products` 中把该商品的 `"price"` 设为 `null`，
  并加上 `"unverified": true`。页面会把这类商品用黄色高亮显示，标
  注"缺失/待确认"，金额显示为"待确认"且不计入任何总额，页面顶部
  也会出现提醒横幅。确认好价格后，把 `price` 改成实际数字并删除
  `unverified` 字段即可。

## 共享实时收款状态（Firebase）

付款状态通过 **Firebase Firestore** 实时同步——任何人打开这个链
接标记付款，其他所有正在查看的人都会立刻看到更新，不需要手动刷
新。

- **Firebase 项目**：WG Group Buy（`wg-group-buy`）
- **数据结构**：`paidStatus` 这个 collection 下，每场团购一个
  document（用日期作为 document ID），字段是每位成员的姓名 →
  `true`/`false`
- **前端接入方式**：`index.html` 中直接内嵌了 Firebase 的
  `firebaseConfig`（apiKey、projectId 等）。这些值本身不是密钥、公
  开也没关系——真正的访问控制由下面的安全规则决定，而不是靠隐藏
  这些配置
- **Firestore 安全规则**（Firebase 控制台 → Firestore Database →
  Rules）：

  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /paidStatus/{groupBuyDate} {
        allow read, write: if true;
      }
    }
  }
  ```

  这条规则只开放了 `paidStatus` 这一个 collection 的读写权限给任
  何拥有链接的人，项目里其他数据不受影响。

- 如果页面顶部出现红色的 🔧 提示条，说明 Firestore 读取或写入时
  出错了，提示条会显示具体的错误信息，方便排查。

### 排查：两台设备数据对不上

如果推送更新后，短时间内不同设备显示的付款状态不一致，通常是
GitHub Pages 的 CDN 缓存还没刷新到最新的 `index.html`——等一两分
钟，或者用无痕/私密窗口重新打开链接（绕过缓存）即可自行恢复。如
果等待后依然不一致，检查页面源码里是否包含 `firebase` 字样，确
认线上确实是最新版本。

## 补充说明

- 页面上所有文字均为中文，这是有意为之——新增的任何文字都请保持中文，与现有风格一致。
- 曾经尝试过用 Claude Artifact（`window.storage`）来实现跨设备共
  享付款状态，但受限于 Anthropic 平台当时一个已知的 postMessage
  跨域问题（已公开报告：`anthropics/claude-code#42064`），未能稳
  定工作，因此改为现在的 GitHub Pages + Firebase 方案。

## 托管方式

本仓库通过 **GitHub Pages** 提供服务（Settings → Pages → Deploy from
branch → `main` / root）。推送到 `main` 分支后，线上页面会在一分钟
左右自动更新。

---

# WG Group Buy — Payment Collection Dashboard

*(English translation of the above)*

A simple, self-hosted, receipt-style dashboard for tracking group-buy
orders and payment status. Built for WG团购群 (the "WG Group Buy"
chat), but works for any group buy once you swap in your own data.

**Live site:** https://zoidz78.github.io/wg-groupbuy/

## Features

- Card-based layout: the summary stats, each member, and the stocking
  list are each their own card — on mobile you can see roughly 2–3
  cards per screen
- Lists each member's order itemized by flavor/product, with a
  per-item subtotal and a personal total
- One-tap paid-status toggle ("标记已付款" / "已付款 ✓" — "Mark
  paid" / "Paid ✓"), and **paid status is shared live across
  everyone who opens the link** (see "Shared live payment status"
  below)
- Summary stats card: participant count, quantity per unit (box/kg/
  etc.), order total, amount collected, amount outstanding — tapping
  a "总数量（unit）" row pops up a breakdown of exactly which
  products make up that unit and their subtotal; tap anywhere on the
  overlay to close it
- Stocking list showing the total quantity needed per flavor/product
- Filter by All / Unpaid / Paid
- Supports multiple group buys — once there's more than one, tabs
  appear (sorted by date) to switch between them
- Automatic light/dark mode, responsive on both mobile and desktop

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app — reads `manifest.json` and whichever `data-*.json` files it references, and reads/writes paid status via Firebase. You normally don't need to touch this file. |
| `manifest.json` | Lists every group buy: `{ date, label, file }`. Most recent date first. |
| `data-<date>.json` | One file per group buy: products, prices, and every member's order. |

Paid status is **not** stored in any file in this repo — it lives
live in Firebase Firestore (see below).

## Adding a new group buy

1. Create a new `data-<date>.json` file (see "Data schema" below).
2. Add a line to `manifest.json`:
   ```json
   { "date": "2026-09-14", "label": "9/14", "file": "data-2026-09-14.json" }
   ```
3. Upload both files to this repo (Add file → Upload files).
   `index.html` doesn't need to change.

Once `manifest.json` has 2 or more entries, tabs automatically appear
at the top of the page to switch between group buys.

## `data-<date>.json` schema

```json
{
  "groupName": "WG团购群",
  "products": {
    "sig": { "label": "招牌鲜肉馄饨", "price": 6.5 },
    "pork_belly": { "label": "五花肉", "price": 12.0, "unit": "kg" }
  },
  "orders": [
    { "name": "小明", "items": { "sig": 3 } },
    { "name": "小华", "items": { "sig": 1, "shrimp": 1 } },
    { "name": "阿强", "items": { "pork_belly": 0.5 } },
    { "name": "小美 & 阿杰", "items": { "corn": 2 } }
  ]
}
```

- `products` — short key → `{ label (Chinese name), price, unit?
  (optional) }`. `unit` defaults to `"盒"` (box) if omitted — set it
  explicitly (e.g. `"kg"`) for anything sold by weight or another
  unit.
- `orders` — one entry per amount to collect. Quantities in `items`
  can be decimals (e.g. `0.5` for half a portion/half a kg).
- **Combined orders**: if two members order together and pay as one
  lump sum, represent it as **one** entry with the names combined
  into a single string, e.g. `"name": "小美 & 阿杰"`.
- **Missing/unverified products**: if a product's price can't be
  confirmed yet (not on the price list, or the reference is
  ambiguous), still add it to that member's `items`, but set that
  product's `"price"` to `null` in `products` and add
  `"unverified": true`. The page highlights these in amber, tags
  them "缺失/待确认" (missing/unconfirmed), shows the amount as
  "待确认" (to be confirmed), excludes them from all totals, and
  shows a warning banner at the top. Once confirmed, set a real
  `price` and remove the `unverified` field.

## Shared live payment status (Firebase)

Paid status syncs in real time via **Firebase Firestore** — when
anyone with the link marks someone as paid, everyone else currently
viewing the page sees the update instantly, with no manual refresh
needed.

- **Firebase project:** WG Group Buy (`wg-group-buy`)
- **Data shape:** under the `paidStatus` collection, one document per
  group buy (keyed by date), with fields mapping each member's name
  → `true`/`false`
- **How the frontend connects:** `index.html` embeds the Firebase
  `firebaseConfig` directly (apiKey, projectId, etc.). These values
  aren't secrets and are fine to be public — actual access control
  comes from the security rules below, not from hiding this config.
- **Firestore security rules** (Firebase console → Firestore
  Database → Rules):

  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /paidStatus/{groupBuyDate} {
        allow read, write: if true;
      }
    }
  }
  ```

  This only opens read/write access to the `paidStatus` collection
  for anyone with the link — nothing else in the project is exposed.

- If a red 🔧 banner appears at the top of the page, it means a
  Firestore read or write failed — the banner shows the specific
  error message to help debug.

### Troubleshooting: devices showing different data

If different devices show different paid status shortly after a
push, it's usually GitHub Pages' CDN still serving a cached copy of
the old `index.html` — wait a minute or two, or reopen the link in a
private/incognito window to bypass the cache. If it's still
inconsistent after that, check the page source for the word
`firebase` to confirm the live version is actually the latest one.

## Notes

- All text on the page is intentionally in Mandarin — keep any new
  text in Mandarin to match the existing style.
- A Claude Artifact (`window.storage`) approach was tried first for
  shared cross-device payment status, but hit a known Anthropic
  platform postMessage cross-origin bug at the time (publicly
  tracked as `anthropics/claude-code#42064`) that kept it from
  working reliably — hence the move to the current GitHub Pages +
  Firebase setup.

## Hosting

This repo is served via **GitHub Pages** (Settings → Pages → Deploy
from branch → `main` / root). Pushing to the `main` branch updates
the live site automatically within about a minute.

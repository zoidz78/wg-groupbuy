# WG团购群 — 团购收款看板

一个简单的、自托管的收据风格看板，用于追踪团购订单和收款情况。为
WG团购群制作，但换一套数据后也可用于任何团购。

**在线地址：** https://zoidz78.github.io/wg-groupbuy/

## 功能

- 卡片式排版：统计信息、每位成员、备货清单分别独立成卡片，手机上
  一屏可看到 2～3 张卡片
- 按口味/商品逐一列出每位成员的订单明细，附单项小计和个人总计
- 每件商品名称前会自动带上对应的表情图标（🍑水蜜桃、🐔鸡肉、🥟馄
  饨等），新商品也能根据关键词自动匹配到合适的图标，不需要逐个手
  动设置（详见下方"商品表情图标"）
- 一键标记付款状态（"标记已付款" / "已付款 ✓"），**所有打开此链接
  的人实时共享同一份付款状态**（详见下方"共享实时收款状态"）
- 每位成员卡片上有 **"💬 复制付款消息"** 按钮，一键复制一段可直接
  粘贴到微信的收款消息——包含该成员的订单明细、送货日调整说明
  （例如短缺、退款）和应付总额（详见下方"复制付款消息"）
- 页面顶部有更醒目的 **"📢 复制到货通知"** 按钮，一键复制一条 @ 全员
  的取货通知，方便直接发到群里（详见下方"复制到货通知"）
- 顶部统计卡片：参团人数、各单位（盒/kg等）的数量、订单总额、已收
  款、未收款——点击"总数量（单位）"这一行，会弹出该单位下每种商品
  的具体数量与小计，点击弹窗任意处关闭
- 备货清单，显示每种口味/商品总共需要订购的数量
- 按 全部 / 未付款 / 已付款 筛选
- 支持多场团购，超过一场后以标签页形式切换（按日期排序）
- 自动浅色/深色模式，手机和电脑均适配
- 送货日调整：短缺、退款/补款、现场加购都可以在页面上直接记录，
  金额自动重新计算（详见下方"送货日调整"）
- **全部收款后自动锁定**：一场团购里所有人都标记已付款后，会自动
  锁定该场——不能再改付款状态、加调整或加新买家，防止误触。需要
  修改时，输入编辑密码即可解锁（详见下方"全部收款后自动锁定"）
- 一键导出报告：紧凑的表格形式，可打印或另存为 PDF，不会因为人数
  多而变成好几页

## 文件说明

| 文件 | 作用 |
|---|---|
| `index.html` | 整个应用程序——读取 `manifest.json` 及其引用的 `data-*.json` 文件，并通过 Firebase 读写付款状态。通常不需要改动这个文件。 |
| `manifest.json` | 列出所有团购场次：`{ date, label, file }`。日期最新的排在最前面。 |
| `data-<日期>.json` | 每场团购一个文件：商品、价格，以及每位成员的订单。 |
| `product-emoji-map.json` | 关键词 → 表情图标对照表，决定每个商品名称前显示哪个图标。可以随时扩充。 |
| `message-template.json` | "复制付款消息"按钮生成的文字模板——问候语、每行明细的措辞、结尾语等。想改消息的措辞，改这个文件就够了，不需要碰 `index.html`。 |

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
  "itemsLabel": "小馄饨团购",
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

- `itemsLabel`（可选）——一句话描述这场团购是什么（例如"小馄饨团购"），仅供页面顶部
  的"📢 复制到货通知"按钮使用；不填的话会退化成把所有商品名称用"、"连起来。
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
      match /adjustments/{groupBuyDate} {
        allow read, write: if true;
      }
    }
  }
  ```

  这条规则只开放了 `paidStatus` 和 `adjustments` 这两个 collection
  的读写权限给任何拥有链接的人，项目里其他数据不受影响。

- 如果页面顶部出现红色的 🔧 提示条，说明 Firestore 读取或写入时
  出错了，提示条会显示具体的错误信息，方便排查。

### 排查：两台设备数据对不上

如果推送更新后，短时间内不同设备显示的付款状态不一致，通常是
GitHub Pages 的 CDN 缓存还没刷新到最新的 `index.html`——等一两分
钟，或者用无痕/私密窗口重新打开链接（绕过缓存）即可自行恢复。如
果等待后依然不一致，检查页面源码里是否包含 `firebase` 字样，确
认线上确实是最新版本。

## 送货日调整（短缺 / 退款补款 / 现场加购）

接龙下单和实际送货之间经常会出现差异：少了一份、需要退款、或是现
场多卖了一些。这些调整**不会**修改原始的 `data-<日期>.json`——它
们和付款状态一样，实时存放在 Firebase Firestore 的 `adjustments`
collection 里，每场团购一个 document，作为原始订单之外的第二层记
录，方便随时对照"当初订了什么"和"最后实际收了多少钱"。

**使用方式：**

1. 点击页面底部工具栏的 **"✏️ 编辑调整"**，输入编辑密码解锁（密
   码写在 `index.html` 脚本开头的 `EDIT_PIN` 常量里，默认是
   `1117`，可以自行修改）。这只是防止误触的软限制，不是真正的权
   限控制——Firestore 规则本身对拥有链接的任何人都是开放读写的，
   和已收款状态一样。
2. 解锁后，每位成员卡片下方会出现 **"+ 调整"** 按钮，点开后可以
   选择：
   - **品项数量变化**：某个商品的数量增加或减少（例如到货少一
     份、或现场多卖一份），系统会按该商品的单价自动换算金额，不
     需要手动心算。这也是**大宗按重量分装商品**（例如一起买1kg
     五花肉，两人分装）的处理方式：接龙时先填一个预估数量，等实
     际过秤后再用这个功能改成真实重量。
   - **退款/补款（固定金额）**：不对应具体商品的一笔整额调整，
     附上备注说明原因。
   - **实际到手重量（仅备注，不影响金额）**：像水果、肉类这类现
     场分装的商品，实际分到每个人手上的重量常常和接龙时的预估对
     不上——这个选项不改变收费（按惯例向下取整，不多收），但会
     记下实际重量，"复制付款消息"里会自动显示给对方看（例如
     "彩虹油蟠桃  16（2044g）"）。
3. 工具栏的 **"+ 新增买家"** 用于记录一位原本不在接龙名单里、纯
   粹现场临时购买的人。
4. 每条调整记录旁边都有 **"撤销"** 链接，可以随时移除。
5. 如果情况比较复杂（例如很多人的订单都要调整），可以把送货情况
   讲给 Claude，让它生成一段调整记录的 JSON，再粘贴进工具栏的
   **"📋 批量导入调整"** 面板一次性套用。

以上这些编辑操作，在该场团购**全部收款并自动锁定**后会暂时无法使
用——见下方"全部收款后自动锁定"。

## 全部收款后自动锁定

当一场团购里**所有人都被标记为已付款**后，页面会自动锁定这一场：
不能再标记/取消付款、不能加送货日调整、也不能新增买家，防止团购
结清之后被误触改动。

- 锁定状态是**所有人共享**的——存在 Firebase 里，和付款状态一
  样，不是某一台设备自己的状态，刷新页面也不会解锁。
- 锁定后，底部工具栏的"✏️ 编辑调整"按钮会变成 **"🔓 解锁"**，点
  开后输入编辑密码（和送货日调整用的是同一个 `EDIT_PIN`）即可解
  锁，所有人立刻看到解锁后的状态。即使这台设备之前已经输入过一次
  密码，解锁这一步仍然需要重新输入——这是有意为之，避免"结清后误
  改"这件事变得太随意。
- "💬 复制付款消息""📢 复制到货通知""🖨️ 导出报告"这几个只读/复
  制类的按钮不受锁定影响，随时可用。

## 商品表情图标（`product-emoji-map.json`）

每个商品名称前显示的图标，是根据商品的中文名称从 `product-emoji-map.json`
里按关键词自动匹配出来的（例如名称里带"水蜜桃"会匹配到 🍑，带"馄饨"会
匹配到 🥟），不需要给每个商品手动挑图标。

- 如果新商品匹配不到任何关键词，会显示默认的 🛒 图标——这不是错误，只是
  说明这个商品的名称还没有被这个表格覆盖到。
- 想让它匹配上，把新增团购的具体商品名称发给 Claude，让它把合适的关键词
  加进 `product-emoji-map.json`（加进已有分类，或者新增一个分类都可以），
  再把更新后的文件上传到仓库根目录即可，`index.html` 不需要改动。

## 复制付款消息（`message-template.json`）

每位成员卡片上的 **"💬 复制付款消息"** 按钮，会把该成员的订单明细、任何
送货日调整（附原因，例如"到货少一份"为一个短缺）和应付总额，拼成一段可以直接粘贴
进微信对话或群聊的文字，点一下就复制到剪贴板。这个和"标记已付款"按钮是
两回事——谁去收款、谁去核对付款状态，可以是两个人分工，互不影响；打印/
导出 PDF 的留档功能也完全不受影响。

格式和这个群平时手写的收款消息一致（不带表情图标、不带"$"符号）。示例：

```
@may

彩虹油蟠桃  16（2044g）
蜂糖李  6.7（673g）
哈密瓜  6.5
青龙菜  3.5
土鸡蛋  9.3

一共42～
```

消息的**措辞**（问候语怎么说、每行怎么写、结尾语等）存放在
`message-template.json` 里，和商品数据、价格、调整记录是分开的——想改
措辞，只需要编辑这个文件再重新上传，不需要碰 `index.html`。文件里每个
字段的说明和用法，都写在它自己的 `description` 字段里。

## 复制到货通知（`📢 复制到货通知`）

页面顶部（团购名称正下方）有一个更醒目的按钮 **"📢 复制到货通知（@全员）"**，
用来通知全群"东西到了，可以来拿"，和上面按成员单独收款的消息是两回事。点一
下会复制：

```
@Caroline 琛琛 @^_^Wu @W_W ...（本场所有成员，接龙顺序）

小馄饨团购到啦，欢迎来06-02自取，需要送货小群联系～
```

- 会 @ 到本场每一位成员（按接龙顺序，包含现场加购的人），不看是否已付款——这
  条是通知取货，不是收款。
- "小馄饨团购"这类描述这次到货是什么的短语，来自该场 `data-<日期>.json` 里的
  `itemsLabel` 字段（新建一场团购时顺手填一下，参考上面"数据结构"部分）；没填
  的话会退化成"{场次标签}团购"（例如"9/1团购"），不会再把所有商品名称列出来——
  品种很多的一场如果忘了填 `itemsLabel`，也不会变成一长串读不出来的文字。
- "06-02" 这类取货地点，存放在 `message-template.json` 的 `pickupLocation` 字
  段里——这个一般是固定的，不需要每场都改。
- 其余措辞同样在 `message-template.json` 里，改法和上面"复制付款消息"一样。

## 导出报告

点击 **"🖨️ 导出报告（PDF/打印）"** 会打开浏览器的打印对话框，显
示一份紧凑的表格版报告——不论当前的筛选状态如何，都会列出所有成
员，附带每人的明细、金额、付款状态，以及备货清单。可以直接打印，
或在打印对话框里选择"存为 PDF"保存文件。这个表格式排版是特意和
屏幕上的卡片式排版分开设计的，人数较多时也不会变成好几页。

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
- Every product name gets an emoji prefix looked up automatically by
  keyword (🍑 for peaches, 🐔 for chicken, 🥟 for dumplings, etc.) —
  new products get matched automatically too, no manual tagging
  needed (see "Product emoji icons" below)
- One-tap paid-status toggle ("标记已付款" / "已付款 ✓" — "Mark
  paid" / "Paid ✓"), and **paid status is shared live across
  everyone who opens the link** (see "Shared live payment status"
  below)
- Each member's card has a **"💬 复制付款消息"** (copy payment
  message) button that copies a ready-to-paste WeChat message with
  their itemized order, any delivery-day adjustments (with the
  reason, e.g. a shortage), and the total due (see "Copy payment
  message" below)
- A more prominent **"📢 复制到货通知"** button at the top of the page
  copies a single "come collect it" message that @mentions every
  member, ready to post to the group (see "Arrival announcement"
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
- Delivery-day adjustments: shortages, refunds/surcharges, and
  walk-in extras can all be recorded right on the page, with amounts
  recalculated automatically (see "Delivery-day adjustments" below)
- **Auto-locks once everyone's paid**: once every member in a round
  is marked paid, that round locks — no more (un)marking paid, no
  adjustments, no walk-ins — to prevent an accidental change after
  it's settled. Enter the edit PIN to unlock it again (see
  "Auto-lock after full payment" below)
- One-tap report export: a dense table format you can print or save
  as a PDF, so a large round doesn't turn into several pages

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app — reads `manifest.json` and whichever `data-*.json` files it references, and reads/writes paid status via Firebase. You normally don't need to touch this file. |
| `manifest.json` | Lists every group buy: `{ date, label, file }`. Most recent date first. |
| `data-<date>.json` | One file per group buy: products, prices, and every member's order. |
| `product-emoji-map.json` | Keyword → emoji lookup table that decides which icon shows next to each product name. Safe to extend any time. |
| `message-template.json` | The wording used by the "copy payment message" button — greeting, per-line phrasing, closing line, etc. To change how the message reads, edit this file — `index.html` doesn't need to change. |

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
  "itemsLabel": "小馄饨团购",
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

- `itemsLabel` (optional) — a short phrase for what this round is (e.g. "小馄饨团购"),
  used only by the "📢 复制到货通知" button at the top of the page. If omitted, it falls
  back to every product's label joined by "、".
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
      match /adjustments/{groupBuyDate} {
        allow read, write: if true;
      }
    }
  }
  ```

  This only opens read/write access to the `paidStatus` and
  `adjustments` collections for anyone with the link — nothing else
  in the project is exposed.

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

## Delivery-day adjustments (shortages / refunds / walk-in extras)

What actually gets delivered often doesn't match the original order
exactly: something's missing, a refund is owed, or extra stuff gets
sold on the spot. These adjustments **never modify** the original
`data-<date>.json` — like paid status, they live in Firebase
Firestore (an `adjustments` collection, one document per round) as a
second layer on top of the frozen original order, so there's always
a clean record of what was ordered vs. what was actually charged.

**How to use it:**

1. Tap **"✏️ 编辑调整"** (Edit adjustments) in the bottom toolbar and
   enter the edit PIN to unlock (set via the `EDIT_PIN` constant near
   the top of `index.html`'s script — `1117` by default; change it
   freely). This is only a soft gate against accidental taps, not
   real access control — the Firestore rules themselves stay open to
   anyone with the link, same as paid status.
2. Once unlocked, each member's card gets a **"+ 调整"** (+ Adjust)
   button with two options:
   - **品项数量变化** (quantity change): a product's quantity goes up
     or down (e.g. one box missing on delivery, or an extra one sold
     on the spot) — the dashboard computes the dollar amount from
     that product's price automatically. This is also how to handle
     a **bulk item split by weight** (e.g. 1kg of pork belly shared
     between two people): log an estimated quantity at order time,
     then correct it to the real weighed amount here once it's known.
   - **退款/补款（固定金额）** (refund/surcharge): a flat dollar
     adjustment not tied to any specific product, with a note.
   - **实际到手重量（仅备注，不影响金额）** (actual weight received,
     info only): for produce or meat that gets portioned out by hand,
     what each person actually receives often doesn't match the
     estimated order exactly. This option doesn't change what they're
     charged (rounded down as usual, never charging extra) but records
     the real weight, which the "copy payment message" button then
     shows automatically (e.g. "彩虹油蟠桃  16（2044g）").
3. **"+ 新增买家"** (+ Add buyer) in the toolbar records someone who
   bought on the spot but wasn't in the original order at all.
4. Every adjustment line has a **"撤销"** (undo) link to remove it.
5. For a messier delivery-day recap, describe what happened to
   Claude in chat and it can generate the adjustment entries as JSON
   to paste into the toolbar's **"📋 批量导入调整"** (bulk import)
   panel, applying them all at once.

These editing actions are all temporarily unavailable once a round has
**auto-locked after full payment** — see "Auto-lock after full payment"
below.

## Auto-lock after full payment

Once **every member in a round has been marked paid**, the page
automatically locks that round: no more marking/unmarking paid, no
delivery-day adjustments, and no adding walk-in buyers — this
prevents an accidental change once a group buy is already settled.

- The locked state is **shared by everyone** — it lives in Firebase,
  same as paid status, not just on one device, and a page reload
  doesn't clear it.
- Once locked, the bottom toolbar's "✏️ 编辑调整" button becomes
  **"🔓 解锁"** (Unlock). Tapping it and entering the edit PIN (the
  same `EDIT_PIN` used for delivery-day adjustments) unlocks it for
  everyone, instantly. This always requires re-entering the PIN, even
  on a device that's already unlocked edit mode before — that's
  intentional, so reopening a settled round stays a deliberate step.
- The read-only/copy buttons — "💬 复制付款消息", "📢 复制到货通知",
  "🖨️ 导出报告" — are unaffected by the lock and stay available at
  all times.

## Product emoji icons (`product-emoji-map.json`)

The icon shown next to each product name is matched automatically by keyword
from `product-emoji-map.json` (a name containing "水蜜桃" matches 🍑, "馄饨"
matches 🥟, etc.) — icons don't need to be picked by hand per product.

- If a new product doesn't match any keyword, it falls back to the default
  🛒 icon — that's not a bug, it just means that product's wording isn't
  covered by the table yet.
- To fix that, send Claude the new round's actual product names and have it
  add the right keywords to `product-emoji-map.json` (into an existing
  category, or a new one), then upload the updated file to the repo root —
  `index.html` doesn't need to change.

## Copy payment message (`message-template.json`)

Each member's card has a **"💬 复制付款消息"** button that assembles their
itemized order, any delivery-day adjustments (with the reason, e.g. "到货少
一份" for a shortage), and the total due into a message, then copies it to
the clipboard so it can be pasted straight into WeChat. This is separate
from the "mark paid" button — one person can sort/collect payment while
another tracks who's paid, and the PDF export for a paper trail is
unaffected either way.

The format matches how this group already writes these messages by hand
(no emoji icons, no "$" sign). Example:

```
@may

彩虹油蟠桃  16（2044g）
蜂糖李  6.7（673g）
哈密瓜  6.5
青龙菜  3.5
土鸡蛋  9.3

一共42～
```

The message's **wording** (how the greeting reads, how each line is
phrased, the closing line, etc.) lives in `message-template.json`, separate
from the product data, prices, and adjustment records. To reword it, just
edit and re-upload that file — no `index.html` changes needed. Each field's
purpose is documented in the file's own `description` field.

## Arrival announcement (`📢 复制到货通知`)

A more prominent button — full-width, right under the group name at the top of the
page — copies a "come collect it" message for the whole group, separate from the
per-member payment message above:

```
@Caroline 琛琛 @^_^Wu @W_W ... (every member in this round, in 接龙 order)

小馄饨团购到啦，欢迎来06-02自取，需要送货小群联系～
```

- @mentions every member of the current round (in 接龙 order, including anyone added
  as a walk-in), regardless of paid status — this is a pickup notice, not a payment
  request.
- The "小馄饨团购" part (what arrived) comes from that round's `data-<date>.json` —
  set its `itemsLabel` field when creating a new round (see "Data schema" above); if
  left unset it falls back to `"{round label}团购"` (e.g. "9/1团购"), never to a list
  of every product — so a round with dozens of distinct items doesn't turn into an
  unreadable wall of text if `itemsLabel` gets forgotten.
- The pickup location ("06-02") lives in `message-template.json`'s `pickupLocation`
  field — this is normally a fixed setting for your building/unit, not something you
  change every round.
- The rest of the wording lives in `message-template.json` too, same as the payment
  message above.

## Exporting a report

**"🖨️ 导出报告（PDF/打印）"** (Export report) opens the browser's
print dialog with a dense, table-formatted report — every member
regardless of the current filter, with their itemized order, amount,
and paid status, plus the stocking list. Print it directly, or choose
"Save as PDF" in the dialog. This table layout is deliberately
separate from the on-screen card layout so a large round doesn't turn
into several pages of paper.

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

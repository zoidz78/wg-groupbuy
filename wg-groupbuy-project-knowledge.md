# WG团购群 — Project Knowledge & Setup Guide

**Read this file first in any new chat on this project.** It's the single source of
truth for how this project works and what to do next, whether the ask is "add this
week's group buy" or "set this whole thing up for a different group."

## What this project is

A receipt-style payment-collection dashboard for tracking group-buy (团购/接龙)
orders and who's paid. Live for WG团购群 at:

**https://zoidz78.github.io/wg-groupbuy/**

Stack: a single static `index.html` (generic, reads `manifest.json` + one
`data-<date>.json` per round) hosted on **GitHub Pages**, with paid/unpaid status
synced live across every viewer via **Firebase Firestore**.

Files in this project:

| File | Purpose |
|---|---|
| `index.html` | The whole app. Generic — never hardcodes a group's data, only the Firebase project it talks to. Rarely needs editing. |
| `manifest.json` | Lists every round: `{ date, label, file }`, newest first. |
| `data-<date>.json` | One per round: `groupName`, `products`, `orders`. |
| `product-emoji-map.json` | Keyword → emoji lookup table used to prefix each product label with a matching icon (🍑 for peaches, 🐔 for chicken, etc.) across every round, current and future. See "Product emoji icons" below. |
| `message-template.json` | Wording for the "复制付款消息" copy-message button — greeting, item-line phrasing, adjustment phrasing, total line, closing lines. Edit this (not `index.html`) to change how the message reads. See "Copy WeChat payment message" below. |
| `firestore.rules` | Firestore security rules (open read/write, scoped to the `paidStatus` and `adjustments` collections only). |
| `README.md` | User-facing docs (Chinese + English) for this specific deployment. |
| `product-catalog.json` | **Claude-side only — never deployed to GitHub.** Cross-round, cross-supplier product key registry: label/unit/aka per key, plus `lastPrice`/`lastRound` for every key with known pricing. See "Product catalog & price tracking" below. |
| `wg-groupbuy-order-instructions.md` | **Claude-side only — never deployed.** The helper's copy-paste prompt for generating a round's raw order data before it's turned into `data-<date>.json`. |

There used to be a Claude-artifact version (`.jsx`, `window.storage`-based) — abandoned
because of a platform postMessage cross-origin bug (`anthropics/claude-code#42064`).
Don't resurrect that approach unless asked; GitHub Pages + Firebase is the current and
working setup. **An `.html` twin of that same abandoned approach
(`groupbuy_dashboard.html` — embedded/baked-in data, `window.storage` for shared
state, no Firebase, no manifest fetch) had been sitting in this project's files;
it was never the live deployment and was deleted 2026-09-09** (see the dated entry
in Troubleshooting/A7 below for how it was found and why). If a chat ever finds a
similarly-named standalone file with baked-in `EMBEDDED_BUYS` data again, treat it
the same way: it's not `index.html`, don't edit it as if it were, and confirm with
the user before deleting anything, same as this time.

**Every file this project touches gets sent to the user as a downloadable file —
no exceptions, not just the ones that go to GitHub.** This means every repo file
that changes (`index.html`, `manifest.json`, `data-<date>.json`, `firestore.rules`,
`product-emoji-map.json`, `message-template.json`, `README.md`) — they deploy by
manually uploading each changed file to GitHub, so without the actual download they
have nothing to upload. It also means this file itself
(`wg-groupbuy-project-knowledge.md`) whenever it's updated, even though it never goes
to GitHub — the user has asked for a download of it regardless, just for their own
records. Saving a file to the project docs (`project_write`) is never a substitute
for sending it — do both, every time, for every file created or edited in this
project.

## First thing in a new chat: figure out which of these two the user wants

1. **Add a new round to the existing WG团购群 dashboard** (by far the more common ask —
   see "A" below), or
2. **Set up a brand-new dashboard for a different group** from scratch (see "B" below).

If it's ambiguous, ask — don't assume.

---

## A. Adding a new round to the existing dashboard

The user will paste a raw WeChat-style order thread (接龙): a product/price list
followed by numbered member lines, often written inconsistently — some list flavors
in order, some combine orders, some use shorthand like "各1" for one of each, or
"原味"/"鲜肉" as a bare alias for the base/signature flavor.

Steps:

1. Extract the product list into `products`: short English key → `{label (Chinese), price}`.
   Reuse existing keys across rounds when the product line is unchanged (`sig`, `corn`,
   `mush`, `seaweed`, `chive`, `shrimp`, `salted`, `century` are the ones seen so far) —
   give genuinely new products new keys.
2. Parse every member line into `orders`: `{ name, items: {key: qty, ...} }`. Preserve
   the name exactly as written, including emoji/symbols.
3. Resolve ambiguous flavor references using judgment (e.g. "原味"/bare "鲜肉" usually
   means the base/signature flavor), but flag the assumption to the user rather than
   silently guessing when it's genuinely unclear.
4. **Verify totals with a script, don't hand-total** — sum each member's cost, total
   quantity per unit, and grand total; sanity-check against any delivery minimum
   mentioned in the message.
5. Write `data-<date>.json` per the schema below. Use the date embedded in the message
   if there is one; otherwise ask, don't assume. Also set `itemsLabel` to a short phrase
   for this round (e.g. "小馄饨团购") unless the raw product labels already read fine
   joined together — it's what the "📢 复制到货通知" button (A4) uses to say what arrived.
6. **Add a new entry to `manifest.json` in the same turn — never treat `data-<date>.json`
   alone as "done."** Without a matching `manifest.json` entry, the new round's tab
   simply never appears (no error, nothing to debug — it just silently isn't there,
   which is exactly what happened on 2026-09-11: the data file was built and handed
   over, but `manifest.json` wasn't touched, and the user had to point out the missing
   tab before it got fixed). Entry format: `{ "date": "...", "label": "M/D", "file":
   "data-<date>.json" }`, newest date first. Treat steps 5 and 6 as one inseparable
   step — if you're producing a `data-<date>.json`, you're always also producing an
   updated `manifest.json` alongside it, no exceptions, even if the user doesn't
   explicitly ask for the manifest.
7. Get both files into the live repo (commit + push if this session has repo access;
   otherwise hand the user the full contents of both files and point them to GitHub's
   "Add file → Upload files"). `index.html` doesn't need to change. New product labels
   are automatically iconified by `product-emoji-map.json` at render time (see below) —
   no per-round work needed for that, unless a genuinely new product category shows up
   with no matching keyword (see "Extending the map").

### `data-<date>.json` schema

```json
{
  "groupName": "WG团购群",
  "itemsLabel": "小馄饨团购",
  "products": {
    "sig": { "label": "招牌鲜肉馄饨", "price": 6.5 },
    "pork_belly": { "label": "五花肉", "price": 12.0, "unit": "kg" }
  },
  "orders": [
    { "name": "Caroline 琛琛", "items": { "sig": 3 } },
    { "name": "Peter", "items": { "sig": 1, "shrimp": 1 } },
    { "name": "Amy", "items": { "pork_belly": 0.5 } },
    { "name": "Lesley & Choies", "items": { "corn": 2 } }
  ]
}
```

- `groupName` stays `"WG团购群"` across rounds unless told otherwise.
- `itemsLabel` (optional) — a short phrase for this round used only by the "📢 复制到货通知"
  group announcement button (see A4), e.g. "小馄饨团购". Set it whenever the round's raw
  product labels wouldn't read naturally joined together (most rounds); omit it only when
  there's just one or two products and the label alone reads fine.
- No `productLabel` or delivery-note field — removed from the display by request;
  don't reintroduce unless asked.
- All page UI text is Mandarin — keep any new strings in Mandarin to match.

**New product:** new snake_case key (never reuse/overload an existing one even if the
Chinese name looks similar). Set `price` per the message. Add `"unit"` whenever it's
not sold by the standard "盒" (box) — e.g. `"kg"` for anything priced "$X/斤" — using
whatever unit word the message uses; omit `unit` for standard box items. If a price or
unit changes between rounds, update only that round's file, never past dated files.

**Partial/fractional quantities:** any decimal is fine, not just whole numbers — this
is how "半份"/half-portion, "1.5kg" etc. get represented (`{ "pork_belly": 0.5 }`).
Don't round — enter exactly what was ordered.

**Combined/shared orders:** when two+ members order together and pay as one lump sum,
represent it as **one** `orders` entry with the names combined into one string, e.g.
`"Lesley & Choies"`. One line item, one "mark paid" toggle. Don't model per-person
cost-splitting within a combined order unless asked.

**Bulk items split among several individual buyers (do NOT combine these):** don't
confuse this with combined orders above. When a bulk-priced item (e.g. a whole cut of
meat at $25/kg) gets divided among several members who each pay for their own share,
keep them as **separate** `orders` entries under their own names — they are not paying
jointly, so they don't get merged into one combined entry. The catch: the exact split
(e.g. 300g vs. 700g) usually isn't known until the item is physically weighed out at
pickup/delivery. So:
1. At 接龙 time, enter each person's **estimated** share as their quantity (whatever
   split was discussed, or an even split if genuinely unknown) — it's a placeholder,
   not the final number.
2. Once it's actually weighed out, this is a job for the delivery-day adjustment
   feature (see A2 below): for each affected member, add an `"item"` adjustment with
   `qtyDelta = actual weight − estimated weight` for that product. The dashboard
   recomputes their cost automatically (`price × qtyDelta`) — don't hand-calculate it.
3. Tell the user this is coming rather than promising an exact split-cost up front, if
   the message doesn't already state firm weights.

**Missing/unverified items:** if a member orders something not on the vendor's price
list, or too ambiguous to price confidently, don't drop it or silently guess:
1. Still add it to that member's `items` with the stated quantity.
2. Give it a `products` key with `"price": null` and `"unverified": true`.
3. The dashboard highlights these in amber ("缺失/待确认"), shows "待确认" instead of
   an amount, excludes them from totals, and shows a warning banner.
4. Tell the user explicitly which items need confirming and why, so they can supply
   the real price/product and you can clear the `unverified` flag later.

### Design conventions already established (don't relitigate unless asked)

- Receipt-style aesthetic: warm parchment background, dashed dividers, monospace
  numbers, serif header font.
- Auto light/dark mode via `prefers-color-scheme` — no manual toggle.
- Responsive: single column on mobile, two-column member grid above 860px.
- Each member card = itemized line per flavor with its own subtotal, then a total line.
- Filter tabs: 全部 / 未付款 / 已付款.
- Pay toggle button text: "标记已付款" / "已付款 ✓".
- Totals grouped by unit, not blindly summed (separate "总数量（盒）" / "总数量（kg）" rows).
- Stocking list (备货清单) only shows products with ≥1 unit actually ordered.
- Missing/unverified items flagged amber, excluded from totals until confirmed.
- Every product label is rendered with an icon prefix looked up from
  `product-emoji-map.json` (e.g. "🍑 川中岛水蜜桃礼盒") — see next section.
- Each member shown with a "1." serial number matching their position in the raw
  接龙 (i.e. `data-<date>.json`'s `orders` array order, which is already 接龙 order —
  no separate field needed). Shown on the member card, the print report, and the
  🏠 门牌管理 panel, so any of these can be cross-checked against the original
  WeChat thread. Walk-ins (added later via adjustments, A2) were never in the
  接龙, so they're left unnumbered — only tagged "现场加购" like everywhere else.
- **A separate "Dashboard Template" design-system project exists (a different
  project) with an Apple-styled flat-gray, desktop/mobile-split, SVG-chart
  reporting-dashboard system.** After reviewing it (2026-09-09), the decision was
  to keep this dashboard's receipt visual identity as-is — it's a live,
  bidirectionally-editable consumer app, not the read-mostly internal reporting
  tool that template assumes — and only borrow its *engineering* discipline
  (escaping, keyboard accessibility, checked color contrast) where this page had
  real gaps. See "Accessibility & escaping hardening" under Troubleshooting below
  for exactly what was pulled in. Don't restyle toward that template's look
  (flat gray palette, sitebar chrome, desktop/mobile page split, SVG charts)
  unless explicitly asked again.

### Suggested first message for this ask

> "New group buy for [date]. Here's the 接龙: [paste message]"

---

## A1. Product emoji icons (`product-emoji-map.json`)

Every product label shown anywhere in `index.html` (order lines, stocking list, the
adjustment form's item dropdown, the print/PDF export) is prefixed with an emoji looked
up from `product-emoji-map.json`, via a small `productEmoji()`/`emojiLabel()` helper
near the top of the script. This was seeded from the icons WG团购群 already used in
their own raw WeChat posts (🍑 for peaches, 🐷 for pork, 🥬 for leafy greens, etc.), so
future rounds get consistent icons automatically without re-tagging every item by hand.

**How matching works:** the file is `{ defaultEmoji, categories: [{ emoji, keywords }] }`.
For a product's Chinese label, categories are checked top-to-bottom; the first category
whose `keywords` list contains a substring of the label wins, and its emoji is used. If
nothing matches, `defaultEmoji` (🛒) is used instead. Order matters — narrower/specific
categories must come before broader catch-alls, and (learned the hard way) before other
categories whose keyword could be a substring of a compound dish name — e.g. meat/poultry
categories are checked before seasoning categories like garlic (🧄) or ginger (🫚),
otherwise a dish like "蒜香无骨凤爪" (garlic chicken feet) would match on "蒜" (garlic)
before reaching "凤爪" (chicken feet).

**Extending it — do this whenever a new round's products fall back to the default 🛒:**
1. Add the new keyword to an existing category if it fits (e.g. a new citrus variety
   goes into the `🍊` category's `keywords` array).
2. Otherwise add a new category object in the right spot (specific before generic,
   proteins before seasonings — see ordering note above).
3. `index.html` fetches this file at `./product-emoji-map.json` (same directory,
   alongside `manifest.json`) — it needs to exist in the live repo for icons to show
   at all; a missing/failed fetch just falls back to 🛒 for everything, it doesn't break
   the page.

**2026-09-11 expansion (first meat/dumpling-supplier round):** the map was seeded
against a fruit/veg vendor and had no coverage for filled dumplings, buns/breads,
lamb, squid, or several bare protein cuts with no animal word in the label. Added:
`水饺`/`小笼包`/`灌汤包`/`青菜包` to the existing 🥟 category; new categories 🍞
(馒头/花卷/千层饼/小饼/韭菜盒子), 🥮 (月饼), 🐑 (羊/羔羊), 🦑 (鱿鱼/墨鱼/乌贼/苏东), 🍡
(小贝/奶卷/糍粑/面筋串) — all inserted right after 🥟 so dish-specific words win before
generic ingredient words reached later in the list (e.g. "韭菜盒子" gets 🍞, not 🥬 from
"韭菜"); `掌中宝` added to 🐔; `大骨`/`子弹排` added to 🍖; `三层肉`/`大肠`/`培根`/`飞机肉`/
`梅肉`/`软骨`/`腰肉` added to 🐷; 🐮 simplified to a bare `牛` catch-all (mirroring how 🐷
already had a bare `猪`) plus `金钱腱`/`百叶`/`毛肚`, since several beef cuts (牛肋条,
牛蹄筋, 肥牛卷, etc.) don't contain the compound "牛肉"; `鲈` added to 🐟. Four tofu
items (芝士豆腐, 海鲜豆腐, 千页豆腐片, 爆浆小豆腐) were left on the default 🛒 on purpose —
no existing emoji fits without being misleading.

---

## A2. Delivery-day adjustments (shortages, refunds, walk-in extras)

On delivery day, reality often doesn't match the original 接龙: some items are missing
or short, some need a refund, and sometimes extra stuff gets sold on the spot. This is
handled as a **second, live layer on top of the frozen original order** — never by
editing `data-<date>.json` itself, so there's always a clean record of what was
originally ordered vs. what actually got charged.

**Where it lives:** a Firestore collection `adjustments/{date}` (same live-sync pattern
as `paidStatus`), one document per round. Each field is an auto-generated entry ID
mapping to:

```json
{
  "member": "Peter",
  "type": "item",
  "itemKey": "sig",
  "qtyDelta": -1,
  "amountDelta": -6.5,
  "note": "到货少一份",
  "ts": 1234567890
}
```

- `type: "item"` — a quantity change to an existing product line (negative = shortage,
  positive = extra sold). `amountDelta` is computed and frozen at entry time
  (`price × qtyDelta`), so a later price change never retroactively alters it.
- `type: "credit"` — a flat dollar adjustment not tied to any product (a refund or
  surcharge with just a note + `amountDelta`, no `itemKey`/`qtyDelta`).
- `type: "weight"` — **purely informational, never affects money.** For weight-priced
  items (`unit: "kg"`) that get portioned out by hand, the actual amount received almost
  never lands exactly on the ordered weight. Billing stays based on what was **ordered**
  (e.g. a member who ordered 2kg of peaches at $8/kg is charged $16 no matter what the
  actual portion weighs) — this entry just records what they actually got, so they can be
  told, even when it's slightly more than they paid for. Shape:
  `{ member, type: "weight", itemKey, actualGrams, note?, ts }` — no `amountDelta`/
  `qtyDelta` at all, so it's excluded from both the money total (`adjustmentTotal`) and the
  stocking-list/procurement total (`effectiveItems`) automatically. Shown inline on that
  product's own line in the copy-message (see A3) instead of the usual `x{qty}kg` quantity
  suffix (which is suppressed for any `kg`-unit item, weighed or not — the dollar amount
  already reflects the ordered weight), not as a separate `↳` line like the other two types.
- A member's final amount due = their original item total + the sum of their
  `amountDelta`s. The dashboard shows this automatically; nothing else needs updating.
- A brand-new `member` name (someone who bought on the spot but wasn't in the original
  接龙) automatically becomes its own row — no need to touch `data-<date>.json` for that.
- Quantity-type adjustments also feed into the stocking list / unit totals (so
  procurement numbers reflect reality), while money always comes from `amountDelta`
  specifically — the two are computed separately on purpose.

**Grams-to-quantity helper for weight-priced items (added 2026-09-08, broadened
same day).** Two distinct pain points, same fix. (1) Bulk produce sold in
pre-weighed bags is ordered in fractional package units, but when a bag gets
split between two or more people (e.g. one person orders 0.5包 of
`tangerine_seedless` "无籽蜜橘(2kg/包)") the split happens by weighing, not by
literally halving the bag — so the weight handed over rarely lands exactly on
the ordered fraction. (2) Plain `unit: "kg"` produce (脆甜大荔冬枣, 普罗旺斯番茄,
etc.) has the same problem in miniature: the field is denominated in kg, but a
kitchen scale reads grams, so someone will eventually type the grams reading
straight into a kg field (an early version of this feature only covered case 1
and a user did exactly this for case 2 the same day it shipped). Either way the
fix is still an ordinary `type: "item"` adjustment (NOT `type: "weight"`, which
is annotation-only and never touches money — see above); the only thing that
needed solving was converting a grams reading into the right number for
whatever unit that product happens to use, without the admin doing the
arithmetic (or the field silently accepting the raw gram count as if it were
that unit — e.g. "1200" read as "1200 more bags", or "600" read as "600 more
kilograms").

To fix this without inventing a new adjustment type (which would have meant
touching all four consumer functions again — `adjustmentLineHtml()`,
`buildMemberMessage()`, `effectiveItems()`, `printItemsLine()` — see
Troubleshooting below), the "品项数量变化" form gained an optional helper input
instead:

- `gramsPerUnit(key)` returns grams-per-unit for any weight-priced product, or
  `null` for anything else (count-based items like 盒/份/粒/只/瓶/袋 just use
  the plain qty field, unchanged). Two cases: `unit === "kg"` → `1000`,
  trivially; otherwise it extracts a per-unit weight straight out of the
  product's own `label` text via regex
  (`/\((\d+(?:\.\d+)?)\s*(kg|g)\s*\/[^)]*\)/i`) — e.g. "无籽蜜橘(2kg/包)" →
  `2000`. No new data field to keep in sync either way; it just reads what's
  already in `data-<date>.json`. The regex deliberately doesn't match
  count-based parenthetical labels ("红心奇异果(2盒/份)") or multi-pack ones
  ("娃娃菜(300g*2包/份)") — those aren't reweighed-bulk items.
- When the selected product in the "品项数量变化" form has a non-null
  `gramsPerUnit`, an extra "或输入实际到手重量（克）" input appears.
  Typing a grams value there calls `handleAdjGramsHelperInput(memberKey, value)`,
  which: rounds down to the nearest 100g (`roundGramsDown` — the house billing
  rule, in the member's favor), divides by the per-unit gram weight to get the
  correct quantity, subtracts `currentQtyFor(memberName, itemKey)` (base order
  qty + any prior `item`-type adjustment deltas for that same member+item, so a
  *second* correction nets against the already-corrected total rather than the
  original order), and writes the result straight into the `qtyDelta` field plus
  a preview line showing the conversion and dollar impact.
- **Important implementation detail:** `handleAdjGramsHelperInput` deliberately
  does **not** call `render()`. This whole page re-renders by replacing
  `app.innerHTML` wholesale (see the crash-bug note in Troubleshooting), which
  would destroy and recreate the very `<input>` being typed into on every
  keystroke and throw the cursor position away. Instead it writes straight to
  the two DOM nodes it needs (`#adjQtyDelta`'s `.value`, `#adjGramsPreview`'s
  `.textContent`/`.hidden`) while still keeping the `adjDraft`/`adjGramsPreview`
  module state in sync, so a render triggered by something else (a live
  Firestore update arriving mid-edit) still shows the right values. Any future
  "live preview as you type" input on this page should follow the same pattern,
  not call `render()` on every keystroke.
- The saved entry is a completely ordinary `type: "item"` record — this is a
  UI shortcut for computing the right `qtyDelta`, not a new persisted shape, so
  undo/report export/payment-message rendering all Just Work without any
  changes.
- Not offered for walk-ins (`memberKey === "__walkin__"`) — a walk-in's name
  isn't finalized until they type it into the separate name field, so there's
  no stable key yet to look up a "current quantity" against; walk-ins still use
  the plain `qtyDelta` field.

**Two ways entries get written to that same Firestore doc:**

1. **Live in-dashboard editing.** The organizer taps "✏️ 编辑调整" in the toolbar,
   enters the PIN (`EDIT_PIN` constant near the top of `index.html`'s script — currently
   `"1117"`; this is a soft UI gate only, not real security, since Firestore rules stay
   open to anyone with the link, same as paid-status), then gets a "+ 调整" button per
   member (and a "+ 新增买家" button for walk-ins) that opens a small inline form. Saves
   go straight to Firestore — instant, no GitHub push needed.
2. **Chat-mediated bulk.** For a messy delivery-day recap pasted into a new chat, parse
   it into the same entry shape (member/type/itemKey?/qtyDelta?/amountDelta/note) as a
   JSON array, and give it to the user to paste into the dashboard's "📋 批量导入调整"
   panel (visible once edit mode is unlocked) — clicking "应用调整" writes them all to
   Firestore in one go. Example payload to hand the user:
   ```json
   [
     {"member": "Peter", "type": "item", "itemKey": "sig", "qtyDelta": -1, "amountDelta": -6.5, "note": "到货少一份"},
     {"member": "Amy", "type": "credit", "amountDelta": -3, "note": "退款：等太久"},
     {"member": "may", "type": "weight", "itemKey": "peach", "actualGrams": 2044}
   ]
   ```
   When computing `amountDelta` for an `"item"` type entry yourself, multiply by that
   product's `price` from the round's `data-<date>.json` — don't leave it for the page
   to infer, since the page trusts whatever `amountDelta` you send. A `"weight"` entry
   never takes `amountDelta`/`qtyDelta` — just `itemKey` + `actualGrams` (+ an optional
   `note`).

Entries can be undone individually from the dashboard (an "撤销" link next to each
adjustment line, visible in edit mode) — this deletes just that one Firestore field.

**Blocked while the round is auto-locked (see A5):** once every member is marked paid,
the round locks and adjustments/walk-ins can't be added (live or via bulk import) until
someone unlocks it with the edit PIN.

### Suggested first message for this ask

> "Delivery day for [date]: [describe what happened — shortages, refunds, extra sales]"

---

## A3. Copy WeChat payment message (per-member)

Each member row has a "💬 复制付款消息" button next to the total (visible always, not just in
edit mode). Tapping it builds a ready-to-paste WeChat message for that member's own order and
copies it to the clipboard (`navigator.clipboard.writeText`, with a `document.execCommand('copy')`
fallback for older/in-app browsers); the button briefly shows "已复制 ✓" for 1.5s as confirmation.

This is deliberately separate from the "标记已付款" toggle — one person can sort/collect payment
while another marks paid, so both stay independent and both are still needed. The PDF export
(print) is unchanged and stays as the paper-trail record.

**Message format**, built by `buildMemberMessage(m)` in `index.html`. Matches how WG团购群
already writes these messages by hand (reworked from an earlier, more formal draft after the
user shared a real example: no emoji, no "$", "@name" instead of a greeting sentence, and
"一共X～" instead of "合计：$X"):

```
@may

彩虹油蟠桃  16（2044g）
蜂糖李  6.7（673g）
哈密瓜  6.5
青龙菜  3.5
土鸡蛋  9.3

一共42～
```

With a shortage adjustment (A2), a member whose order was short one item on delivery looks
like:

```
@Peter

哈密瓜 x2盒  13
土鸡蛋  9.3
↳ 哈密瓜 -1盒（到货少一份） -6.5

一共9.3～
```

- `@{name}` greeting, then a blank line.
- One line per original ordered item — plain product name (no emoji, unlike everywhere else
  on the page), an ` x{qty}{unit}` suffix only when quantity isn't 1 *and* the item isn't
  priced by weight (so "2 boxes" shows "x2盒", but "2kg of peaches" never shows "x2kg" —
  the amount already reflects the ordered weight, and the actual weight, if known, is
  shown instead per below), then two spaces and the amount (trimmed of trailing zeros,
  no "$").
- A `（{grams}g）` suffix on an item's own line when a `"weight"` adjustment (A2) was
  recorded for that member+item — the actual amount portioned out, purely informational.
- One `↳`-prefixed line per non-`"weight"` delivery-day adjustment (A2) affecting that
  member, each with its own note (e.g. "到货少一份", "退款：等太久") so the person paying
  can see *why* the total differs from a simple add-up of the original order — this was
  an explicit requirement, not just a nice-to-have.
- A blank line, then `一共{total}～` — same number shown elsewhere in that member's card.
- No closing line by default (the real messages this group sends don't have one) — add
  one back via `message-template.json`'s `closingPaid`/`closingUnpaid` fields if wanted
  later.

**Scope note:** this is a per-member button only — there's no bulk "copy list of everyone unpaid"
variant. That was discussed during ideation but not requested for the build; don't add it unless
asked.

**index.html only:** `buildMemberMessage` depends on the adjustments/edit-mode data already
loaded into `index.html`'s state — this is the only place this feature exists.

**Wording lives in `message-template.json`, not `index.html`.** Same pattern as the emoji map
(A1): `index.html` fetches `./message-template.json` at boot and merges it over a built-in
default (identical wording), so a missing/failed fetch just silently keeps the current wording —
it never breaks the page. All of the *data* in the message (product names, prices, adjustment
notes, actual weights, totals) still comes from `data-<date>.json` / the live adjustments —
only the surrounding *phrasing* is templated. `{placeholders}` in the template are filled in
automatically (`fillTemplate()` in `index.html`); don't remove or rename them, just move the
words around them.

Fields in `message-template.json`: `greeting` (`@{name}`), `itemLine`
(`{item}{qtySuffix}  {amount}{weightSuffix}`), `weightSuffix` (the `"weight"`-adjustment
annotation, e.g. `（{grams}g）`), `unverifiedAmount`/`unverifiedSuffix` (for
missing/unconfirmed-price items), `adjItemLine`/`adjNoteSuffix` (a quantity-type delivery-day
adjustment), `adjOtherLine`/`adjDefaultNote` (a flat credit/refund adjustment), `totalLine`
(`一共{total}～`), and `closingPaid`/`closingUnpaid` (empty by default — set these if you want
a closing line back, shown depending on whether that member is already marked paid).

**To reword the message going forward:** just edit `message-template.json` and re-upload it —
`index.html` doesn't need to change. Only touch `index.html`'s `buildMemberMessage`/
`MESSAGE_TEMPLATE` default again if a genuinely new *kind* of line is needed (not just different
wording of an existing one).

---

## A4. Group arrival announcement ("📢 复制到货通知")

A second copy-message button, deliberately more prominent than the per-member one — a full-width
filled button right at the top of the page, under the group name, so it's the first thing visible
on load. Built for the "everything arrived, come collect" message the organizer posts to the whole
group, as opposed to A3's per-member payment message.

Tapping it copies (`buildGroupAnnouncement()` in `index.html`):

```
@Caroline 琛琛 @^_^Wu @W_W @Peter @Sherry Liu ... @等放假ing @木木三の柒

小馄饨团购到啦，欢迎来06-02自取，需要送货小群联系～
```

- One `@`-mention per member, in 接龙 order (original order first, then any walk-ins added via
  adjustments), space-separated on one line — matches how WG团购群 already posts these. Everyone
  gets mentioned regardless of paid status; this message is about pickup, not payment.
- A blank line, then a short note: what arrived, where to collect, and to use the small delivery
  group chat if delivery is needed instead of pickup.
- Shows "已复制 ✓" for 1.5s after copying, same pattern as A3's button.

**Data sources:**
- Member list: `DATA.orders` (+ walk-in names from `adjustments`) — same list and order used
  everywhere else on the page (factored into `allMemberNamesInOrder()`, shared logic with
  `render()`'s member list and with the A5 auto-lock check).
- `{arrived}` (what showed up, e.g. "小馄饨团购"): reads the round's `data-<date>.json` top-level
  `itemsLabel` field if set — **this is optional and round-specific, so add it each time a new
  round's data file is created** when the product list doesn't already read naturally on its own
  (e.g. 8 wonton-flavor labels joined together would be unreadable as an announcement). If
  `itemsLabel` isn't set, it falls back to `"{round label}团购"` (e.g. "9/1团购") — **never** to a
  list of every product. (This used to join every product's label with "、"; a big produce round
  with 50+ distinct items turned that into an unreadable wall of text when `itemsLabel` was
  forgotten, so the fallback was changed to the date-based phrase instead. Still set `itemsLabel`
  when you can — "小馄饨团购到啦" reads better than "9/7团购到啦" — but forgetting it is no longer
  a real problem.)
- `{location}` (pickup spot, e.g. "06-02"): `pickupLocation` in `message-template.json` — this is
  a fixed setting for this deployment (their actual unit), not per-round, so it normally only needs
  setting once.
- The rest of the wording (`groupAnnouncementText`, `mentionPrefix`, `mentionSeparator`) also lives
  in `message-template.json`, same reasoning as A3 — reword without touching `index.html`.

**No new JSON file was needed** — this reuses `message-template.json` (added fields:
`mentionPrefix`, `mentionSeparator`, `pickupLocation`, `groupAnnouncementText`) and the existing
`data-<date>.json` schema (added one new optional field: `itemsLabel`).

### When adding a new round (A, above), remember `itemsLabel`

Section A's "adding a new round" steps should now also include: set a short `itemsLabel` in the
new `data-<date>.json` if the round's products don't already read well joined together (most
rounds will want this — it's rare for raw product labels to double as a natural announcement
phrase).

---

## A5. Auto-lock after full payment

Once every member in a round has been marked paid, the round automatically locks: no more
marking (un)paid, no delivery-day adjustments (A2), no adding walk-in buyers — for anyone
with the link — until someone with the edit PIN unlocks it again. Added to stop an
already-settled round from being changed by an accidental tap.

**Where it lives:** a `__locked` boolean field written directly into the same Firestore
document as paid status (`paidStatus/{date}`) — not a separate collection, so it needs no
new Firestore rule; the existing `allow read, write: if true` rule for `paidStatus` already
covers it. `__locked` is never a real member's name, so it's automatically excluded
everywhere the page iterates members by name (`paidCount`, `collected`, etc.).

**How it locks:** `togglePaid()` in `index.html` checks, on every "mark paid" tap, whether
this tap is the last outstanding member for the round — if so, it writes
`{ [name]: true, __locked: true }` in that same Firestore call. This only fires on that
specific transition (someone completing the round), never on a general page load or
render, so unlocking a round to fix something doesn't get immediately re-locked just
because everyone still shows as paid at that moment — it only re-locks the next time
someone explicitly completes the round again via the paid toggle.

**How it unlocks:** while locked, the toolbar's edit button is replaced with "🔓 解锁".
Tapping it opens a password prompt using the same `EDIT_PIN` as delivery-day adjustments;
entering it correctly clears `__locked` for everyone, live, same as paid status. Unlocking
always requires re-entering the PIN — even on a device that already has edit mode
remembered (`wg_edit_unlocked` in localStorage) — since settling/reopening a round is
meant to be a deliberate act each time, not something a remembered device skips. There is
**no auto-unlock on page reload**: the lock is shared Firestore state, so it reads the
same on every device until someone enters the PIN.

**Known edge case (rare, low-stakes, left unfixed on purpose):** if two different devices
mark the very last two outstanding members paid at nearly the same instant — before
either has received the other's Firestore update — the round can end up fully paid
without auto-locking, since each device's local check still thinks the other member is
unpaid. Nothing about money or paid-status breaks; the round just stays editable until
someone explicitly toggles a payment again. This wasn't patched with a render-time
recheck because that would also make the manual unlock re-lock itself instantly (since
right after unlocking, everyone typically still shows as paid) — defeating the point of
being able to unlock at all. Not worth the added complexity for a small group; revisit
only if it actually causes a problem in practice.

---

## A6. Member block/unit directory (for organizing deliveries)

Each member can have a block/unit number on file (free text, e.g. "12栋 06-02"),
used only to help sort/plan deliveries. This is real address information tied to
real names, so it's held to a higher bar than everything else in this project:

- **Never in the GitHub repo.** Unlike everything else the dashboard reads
  (`data-<date>.json`, `manifest.json`, etc.), this does **not** live in a file
  that gets pushed to GitHub. It lives entirely in a Firestore collection
  (`memberInfo/directory`, one doc, fields `{ name: "block/unit text" }`), so it's
  never sitting in the public repo or its permanent git history — the whole reason
  it's there is so it isn't casually discoverable just by browsing the repo.
  It's still technically reachable by anyone who has the dashboard link (same
  trust model as paid status/adjustments — Firestore rules stay open to anyone
  with the link, not just the organizer), just not by browsing GitHub.
- **Never fed into any message.** `buildMemberMessage()` (the per-member payment
  message, A3) and `buildGroupAnnouncement()` (the arrival announcement, A4) never
  read `memberUnits` — this data has no path into anything that gets copied to
  WeChat. This restriction is absolute and hasn't changed; only where it's *shown
  on the dashboard* has (see next point).
- **Persistent, not per-round.** A member's unit doesn't reset or need re-entering
  when a new round starts — it's one directory shared across every round's data,
  loaded once at boot (`subscribeToMemberUnits()`), not tied to any `date`.
- **Shown on every member's card, to anyone who opens the link — by explicit
  request (2026-09-08), not the original design.** It was originally kept out of
  the plain card view and visible only inside the edit-mode-gated "🏠 门牌管理"
  panel; the user asked for it to always show on the card instead, for
  convenience, and accepted that this removes that privacy boundary (still not
  in the GitHub repo, still readable by anyone with the link like everything
  else, just no longer hidden behind edit mode for *viewing*). See the
  `.unitDisplay` line in `render()`. **Editing** it still requires unlocking edit
  mode and using the "🏠 门牌管理" panel — only *reading* changed.

**Requires a Firestore rules change** (the one thing this feature needs that no
other feature in this project has needed so far, since it's a brand-new
collection, not reusing `paidStatus` or `adjustments`). Add this to the existing
rules in Firebase console → Firestore Database → Rules, alongside the
`paidStatus`/`adjustments` blocks:

```
match /memberInfo/{docId} {
  allow read, write: if true;
}
```

Tell the user explicitly when handing over an `index.html` that uses this feature
for the first time: **the panel will fail (a red 🔧 error banner) until this rule
is added** — `index.html` alone isn't enough for this one.

**Data shape choice:** one free-text field per member rather than separate
block/unit fields — matches how `pickupLocation` is already stored as one string
elsewhere in this project. Split it into two fields only if asked.

### Suggested first message for this ask

> "Here are everyone's block/unit numbers: [list]" — paste the list and this gets
> written into the directory (needs Firestore write access from this session, or
> hand the user the `{name: unit}` pairs to type into the "🏠 门牌管理" panel
> themselves).

---

## A7. Product lookup (商品查询 — who ordered a given product)

The old design had a **总数量（单位）** row per unit (盒/kg/份/etc.) in the top
summary ticket; tapping one popped up every product contributing to that unit
and its subtotal. This was removed (2026-09-09) as redundant — the 备货清单
card right below already lists every product with its price and quantity, so
the same information was shown twice, once grouped by unit and once by
product.

**What replaced it, in two steps (both 2026-09-09, same day):**

1. First pass: the 备货清单 card became **"商品查询 — 备货清单 & 认购明细"**,
   with a `<select>` dropdown above the stocking table. The dropdown lists
   **only products actually ordered this round** (`flavorTotals[k] > 0` —
   nothing from `products` that got zero orders appears as an option).
   Picking one swaps the panel below from the full stocking list into
   `renderProductMembers()`'s output for just that product: every buyer's
   name and quantity (via `effectiveItems()`, so it reflects delivery-day
   adjustments the same way the stocking list itself does), plus a subtotal.
   Picking the first option ("📋 全部商品（本轮备货清单）", value `""`) — or
   just never touching the dropdown — shows the full list again
   (`renderAllProductsList()`).
   - Tried an in-between design first (a text search box filtering a
     tappable list of rows) before landing on a plain `<select>` — a native
     dropdown is the simpler control for "pick one item from a list you
     don't need to type-ahead search," and it's what got asked for
     specifically. Don't reintroduce the search-box version unless asked.
2. Second pass, same day: **every row in the always-visible 备货清单 table is
   now itself clickable**, independent of the dropdown. Clicking a product's
   name/qty/amount cells pops up the exact same per-product breakdown
   (`renderProductMembers()` again — no duplicate logic) in a modal overlay
   (`.productOverlay`/`.productOverlayCard`, styled like the old
   `.unitOverlay` this replaced), so you don't have to scroll/search the
   dropdown to check one product you're already looking at in the table.
   Click anywhere on the overlay (backdrop or card — no `stopPropagation`,
   matching the old unit overlay's "点击任意处关闭" behavior) to close it;
   Escape also closes it (`selectedProductOverlay` state, reset on round
   switch and before `exportReport()`'s print dialog, same handling the old
   `openUnit` state got).
   - Only the first cell of each stocking-list row carries
     `role="button" tabindex="0"` (for one keyboard stop per row via the
     existing delegated Enter/Space handler); the other two cells share the
     same `data-key` and click handler so the whole visual row is tappable,
     without adding two more redundant tab stops per product.

**Net result:** three ways to see who-ordered-what for a given product —
dropdown, or tap its row in the stocking list either while a specific product
is already selected or while viewing the full list — all backed by the same
`renderProductMembers()` function, so there's exactly one place to fix a bug
in that breakdown, not three.

---

## A8. Product catalog & price tracking (`product-catalog.json`)

**Claude-side only — this file is never fetched by `index.html` and never uploaded to
GitHub.** It's a build-time aid so Claude can keep product keys consistent, and now
prices too, across every round and every supplier (produce vendor, meat/dumpling
vendor, etc.) — not just within one round.

Each entry: `label`, `unit`, optional `aka` (alternate labels the same key has shipped
under) and `note` (for genuine ambiguity — see `mango_pzh`/`egg_my_box` for examples),
plus (added 2026-09-11):

- **`lastPrice`** — the most recent confirmed price seen for this key, across any
  round/supplier.
- **`lastRound`** — the `YYYY-MM-DD` of the round that price came from.

Only the latest price/round is kept — no full history array (deliberate choice, keep
it simple). Entries with no price ever recorded in the available round files (e.g.
`lotus_root`, `peach_rainbow_unclear` — they predate the round files in this project)
simply omit both fields.

**Workflow when building a new round:**
1. For each vendor line item, check whether it matches an existing key (by label or
   `aka`) before minting a new one — same rule as before.
2. If it matches an existing key, compare the vendor's stated price this round against
   that key's `lastPrice`.
   - **Same price:** proceed normally.
   - **Different price:** don't silently update it — tell the user the price changed
     (old → new) so they can confirm it's not a typo before it goes into the new
     round's `data-<date>.json`.
3. After the round's `data-<date>.json` is finalized (including any
   previously-`unverified` items the user confirms), update `lastPrice`/`lastRound`
   for every key used that round, and add any brand-new keys with their first price.
4. `unverified` items (price `null`) are never fed into `lastPrice` — only confirmed
   prices count. Once the user confirms a real price for a previously-unverified item,
   clear the `unverified` flag in that round's data file *and* add the key to the
   catalog with its now-confirmed `lastPrice`/`lastRound`.

**Example (2026-09-11 round):** two items ordered outside the vendor's posted list —
`CP猪血` ($7.8/盒/400g) and `马来西亚土鸡蛋` ($9.3/30粒/盒) — were entered as
`unverified`/`price: null` first. The user confirmed both prices in a follow-up
message; both were then unflagged in `data-2026-09-11.json` and added to
`product-catalog.json` with `lastPrice`/`lastRound: "2026-09-11"`. Note:
`egg_my_box`'s confirmed price ($9.3) happens to match the unrelated `egg_my` key
(different supplier, `盘`/tray unit) — coincidence, not merged, flagged via `note`.

---

## B. Setting up a brand-new dashboard from scratch (a different group)

`index.html` is fully generic — it only knows about `manifest.json`, the
`data-*.json` files it points to, `product-emoji-map.json`, and a Firebase project for
live paid-status sync. Nothing in it is specific to WG团购群 except the Firebase config.
To stand up an independent dashboard for a different group:

1. **New GitHub repo.** Create it, then enable Pages: Settings → Pages → Deploy from
   branch → `main` / root. Live URL will be `https://<github-username>.github.io/<repo>/`.
2. **Copy `index.html` and `product-emoji-map.json` as-is** from this project into the
   new repo — no changes needed yet except the Firebase config (step 4).
3. **New Firebase project.** console.firebase.google.com → create project → enable
   Firestore Database (start in production mode — the rules below lock it down anyway).
4. **Paste the new Firebase config** into `index.html`, replacing the
   `firebaseConfig` object (apiKey, authDomain, projectId, storageBucket,
   messagingSenderId, appId) with the new project's values (Firebase console → Project
   settings → your web app, or "Add app" if none exists yet). These values aren't
   secrets and are fine to be public — access control comes from the security rules,
   not from hiding the config.
5. **Set Firestore security rules** (Firebase console → Firestore Database → Rules) —
   copy this project's `firestore.rules` as-is (scoped to `paidStatus` and
   `adjustments`, nothing else):
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
   Also consider changing the `EDIT_PIN` constant near the top of `index.html`'s script
   if you don't want to share the same PIN across dashboards for different groups.
6. **Create the first round's files**: `manifest.json` with one entry, and
   `data-<date>.json` with that group's `groupName`, `products`, and `orders` (schema
   above in section A).
7. **Push everything** to the new repo (`index.html`, `manifest.json`,
   `data-<date>.json`, `product-emoji-map.json`, and the `firestore.rules` file for
   reference). Pages updates the live site within about a minute of a push to `main`.
8. Confirm the live URL loads, shows the first round, and that toggling paid status
   updates Firestore (check the Firebase console's Firestore data browser, or open the
   link in two tabs and confirm a toggle in one shows up in the other).

From then on, adding further rounds to that new dashboard follows the same steps as
section A. The emoji map (`product-emoji-map.json`) travels with `index.html` and keeps
working as-is since it's keyed on Chinese product-name keywords, not on any
group-specific data — extend it per-group only if that group sells product categories
the current map doesn't cover.

---

## Troubleshooting

**Two devices show different paid-status data shortly after a push:** almost always
GitHub Pages' CDN serving a stale cached `index.html`. Wait a minute or two, or reopen
in a private/incognito window. If still wrong, view page source and confirm the word
`firebase` appears (i.e. the live version really did update).

**Red 🔧 banner at the top of the page:** a Firestore read/write failed — the banner
shows the actual error message, which is the fastest way to debug it.

**"Pulling down doesn't refresh the page" when saved to the iOS Home Screen**
(added 2026-09-09): expected, not a bug — a page saved via "Add to Home Screen"
opens full-screen with no Safari chrome, and pull-to-refresh is a gesture Safari's
UI provides, not something the page itself can opt into or reimplement via a
manifest/meta tag. **Fix:** a `#refreshBtn` toolbar button (🔄 刷新) was added that
just calls `location.reload()` — a real navigation, not a custom re-fetch of
`manifest.json`/`data-<date>.json`, deliberately, so it re-runs every boot step
exactly once (product-emoji-map.json, message-template.json, Firestore
subscriptions, everything) with nothing to keep in sync by hand as future
boot-time fetches get added. If the person reports the button itself doesn't seem
to update anything, that's almost always the GitHub Pages CDN-caching issue above,
not this button — same fix (wait, or force-quit and reopen).

**"🖨️ 导出报告" needed several clicks before the print dialog actually opened**
(fixed 2026-09-08): `exportReport()` reset some UI state (filter/edit mode/open
panels) and called `render()`, then called `window.print()` inside a
`requestAnimationFrame` callback — the reasoning at the time was probably "give the
DOM a frame to settle before printing," but it wasn't actually needed: the print
content (`renderPrintSection()`) is built from the full, unfiltered member list on
*every* render regardless of the on-screen filter, and `@media print` hides
everything else via pure CSS, so nothing about print correctness depended on that
delay. What it did cause: deferring `window.print()` even by one animation frame
pushes it just outside the "direct result of a user gesture" window some browsers
require before honoring `print()`/`open()` — Safari and, notably, WeChat's in-app
browser (the actual audience for a WeChat group-buy link) are both strict about
this. That's why it was flaky rather than consistently broken: whether a given
click's deferred call still landed inside that browser's grace window varied.
**Fix:** call `window.print()` synchronously, in the same tick as the click handler
— no `requestAnimationFrame`, no other async hop in between. General rule for
anything else that opens a native browser dialog (`print()`, `open()`, a file
picker, etc.): call it directly from the event handler, not after an intervening
`render()`-triggered layout wait, a `Promise`, or a timer — if state needs to
change first, do the state change and `render()` synchronously, then call the
dialog-opening API immediately after, still inside the same handler invocation.

**A product's icon shows the default 🛒 instead of something specific:** its Chinese
label doesn't match any keyword in `product-emoji-map.json`. Extend the map (see
"Product emoji icons" above) rather than hardcoding an icon into a product's `label`.

**A fully-paid round won't let you add an adjustment or new buyer:** it's auto-locked
(see A5) — tap "🔓 解锁" in the toolbar and enter the edit PIN.

**The whole page is blank/frozen and nothing is clickable, with a
`TypeError: ... amountDelta.toFixed` (or similar) error in the browser console:**
two distinct things can cause this, both now fixed, but worth telling apart if it
ever recurs — check the browser console's expanded stack trace to know which:

1. **A genuinely malformed entry** in that round's `adjustments/{date}` Firestore
   doc — missing a field (`amountDelta`, `qtyDelta`, or `actualGrams`) for its type,
   e.g. from a bad hand-edit in the Firebase console. Guarded by
   `isValidAdjustmentShape()`, which filters anything malformed out before it can
   reach a `.toFixed()`/`formatQty()` call; a "🔧 发现 N 条调整记录格式有问题" banner
   appears with a one-tap "点击清理" button (in edit mode) that deletes the bad
   entries via `cleanupInvalidAdjustments()` — no Firebase console needed.
2. **A legitimate `"weight"` adjustment entry hitting code that never special-cased
   it.** This was the actual first real-world occurrence (2026-09-08): `printItemsLine()`
   (the print-report line-summary function) assumed every non-`"item"` adjustment was
   a dollar-amount `"credit"` and called `.toFixed()` on `a.amountDelta` — which
   `"weight"` entries never have by design (see A2). Unlike `adjustmentLineHtml()` and
   `buildMemberMessage()`, which both already special-cased `"weight"` correctly,
   `printItemsLine()` had been missed when the `"weight"` type was added. Fixed by
   giving it the same `if (a.type === "weight") { ... }` branch (shows
   `emojiLabel(info)}实收{grams}g`, informational only, matching the pattern
   elsewhere). **Lesson for next time a new adjustment `type` is added:** it has to be
   handled in *all four* places that iterate `adjustmentsForMember()` —
   `adjustmentLineHtml()`, `buildMemberMessage()`, `effectiveItems()`, and
   `printItemsLine()` — not just the on-screen card and the WeChat message. It's easy
   to update the two visible/obvious ones and forget the print-export path, since it's
   hidden by `@media print` and only becomes visible when someone actually prints —
   except it's built unconditionally on every single render (not just when printing),
   so a bug in it crashes the *entire* page, immediately, for everyone — not just the
   print feature.

Both fixes are defensive at the `adjustmentsForMember()`/render layer, not a promise
that every future adjustment type will be handled — check all four call sites by hand
whenever a new `type` value is introduced.

### Defensive audit (2026-09-08): missing/malformed data no longer crashes the page

The `printItemsLine()` bug above was one specific instance of a general risk this
architecture has: **the whole page is a single `app.innerHTML = ...` template string
(see `render()`), so any single thrown error while building it — anywhere — takes down
rendering for every visitor, not just the one feature that has the bug.** Prompted by
that bug recurring in spirit (a user report of "prevent this from happening again"),
every place that reads a *number* or a *product lookup* from data the organizer
hand-types was audited for the same failure shape: assuming a field exists/is the right
type, then immediately calling `.toFixed()` or doing arithmetic on it. Found and fixed:

- **A member's `items` referencing a product key that's missing from that round's
  `products` map** (a typo made while hand-authoring `data-<date>.json`, or a key
  renamed/removed after orders already referenced it) used to crash the *on-screen*
  member-card loop in `render()` outright (`info.price` on `undefined`) — this was the
  most likely one to actually get hit, since it's hand-authored data. Now shows a
  visible `⚠️ <key> 商品未找到，请检查 data 文件` line instead of throwing;
  `printItemsLine()` and `buildMemberMessage()` already had this guard (`if (!info)
  return`), the primary on-screen card loop just hadn't.
- **A member entry missing its `items` field entirely** (e.g. `{"name": "X"}` with no
  `items` key — an easy thing to drop while hand-typing a long `orders` array) used to
  crash `Object.entries(m.items)` wherever a member is touched (cost, the card loop,
  the message builder, the print line). Fixed once, at the single point every one of
  those reads from: `DATA.orders.map((m, i) => ({ ...m, items: m.items || {}, id: i
  }))` in `render()`.
- **A malformed entry in the `adjustments` Firestore doc** (e.g. a stray `null` — from
  a bad manual Firestore-console edit, or a bug in a bulk-import payload) used to crash
  `Object.values(adjustments).map(a => a.member)` in both `allMemberNamesInOrder()` and
  the walk-in-name computation inside `render()` — neither guarded `a` being truthy
  before reading `.member`, even though the established pattern for this exact risk
  (`e && e.member`) already existed in `invalidAdjustmentEntries()` a few lines away.
  Now both do `a && a.member`.
- **A product with a missing/`null` `price` but no explicit `unverified: true` flag**
  (forgetting to set the flag is an easy slip — two separate fields to remember) used to
  crash the on-screen 备货清单 stocking list AND its print-report twin
  (`info.price.toFixed(2)` on `null`/`undefined`). `isUnverified(key)` now treats
  `info.price == null` as unverified too, regardless of the explicit flag, so all three
  places that used to check `info.unverified` directly (备货清单 ×2, `renderUnitOverlay`)
  now call `isUnverified()` instead and get the fix automatically — as does anywhere
  that already called `isUnverified()` (the member card, `buildMemberMessage()`,
  `printItemsLine()`), with zero further changes needed there.
- **`cost()`** used to do `DATA.products[key].price * qty` unconditionally once the
  product existed — a `price` of `undefined` (field omitted, as opposed to explicitly
  `null`) produces `NaN`, which doesn't crash (`NaN.toFixed(2)` prints `"NaN"` rather
  than throwing) but silently poisons every downstream total (grand total, collected,
  per-member totals) into showing `$NaN`. Now explicitly treats `price == null` as $0,
  same as a missing product.
- **`formatQty()`/`formatAmt()`** called `.toFixed()` straight on their argument —
  `.toFixed` doesn't exist on strings, so a quantity accidentally written as a quoted
  string in `data-<date>.json` (`"0.5"` instead of `0.5` — an easy slip when hand-typing
  or copy-pasting JSON) would throw and, per the single-template-string architecture,
  crash the entire page. Both now do `Number(x)` first, so a string coerces cleanly
  and even a genuinely non-numeric value degrades to displaying `"NaN"` rather than
  throwing.
- **`loadGroupBuy()`** (switching rounds via the tab bar) had no `.catch()` at all on
  its fetch/JSON-parse chain — a 404'd or syntactically invalid `data-<date>.json`
  (again: hand-authored, so a missing comma/bracket/quote is a real possibility) failed
  completely silently; the tab click just did nothing, with no clue why, and no way to
  tell whether it was still loading or had already failed. Now catches the error, rolls
  `activeIndex` back to whichever round was already showing (so `DATA` still points at
  something real and the tab bar isn't stranded on a broken tab with no way back), and
  shows the actual error message in the same `storageDebug` 🔧 banner Firestore errors
  already use. The very first boot load (fetching `manifest.json` then the newest
  round) already had a fallback (`showLoadErrorFallback`, which replaces the whole page
  since there's no previously-working round to fall back to there) — its error message
  was hardcoded and uninformative regardless of cause; it now includes the real
  `Error.message` (e.g. the JSON parser's own syntax-error text and position).
- Added `if (!DATA) return;` at the very top of `render()` as cheap defense in depth —
  every current call path already only calls `render()` once `DATA` is set (or, on a
  failed round switch, leaves the *previous* round's `DATA` in place), so this
  shouldn't be reachable today, but costs nothing and means a future subscription or
  handler that forgets that invariant fails quietly instead of throwing on
  `DATA.orders`.

**The general principle, for anything added later:** any value that ultimately traces
back to hand-typed JSON (`data-<date>.json`'s `orders`/`products`, a bulk-import paste)
or an open-write Firestore doc should be treated as untrusted shape/type — check
existence before dereferencing (`DATA.products[k]` can be `undefined`), and wrap
anything reaching `.toFixed()` in `Number(...)` rather than assuming the caller already
passed a real number. Because `render()` is one giant template string, there is no
"just this one card fails to render" outcome — a single unguarded assumption anywhere
takes the *entire* page down for *every* visitor until someone finds and fixes it. When
in doubt, prefer degrading to a visible "⚠️ / 待确认" marker over either a silent wrong
number or a thrown error.

### Accessibility & escaping hardening (2026-09-09)

Prompted by reviewing a separate "Dashboard Template" design-system project (see the
new "Design conventions" bullet above) — its `DESIGN_SYSTEM.md` documents real
incidents in unescaped-HTML injection and unchecked color contrast, which turned out
to have live counterparts here. Three fixes, all invisible (no look-and-feel change):

1. **Unescaped member name reaching `innerHTML`.** A walk-in buyer's name comes from a
   free-text field (`adjDraft.name`), written to an open-write Firestore doc anyone
   with the link can write to, then was concatenated straight into `app.innerHTML`
   unescaped in two places — the on-screen row header (`.rowName`) and the print
   table's `<td>`. It was also written unescaped into `data-name="${m.name}"`/
   `data-member="${m.name}"` attribute values on the pay/copy/adjust buttons and inside
   `renderAdjForm()` — an unescaped `"` there could break out of the attribute.
   **Fixed:** every one of those spots now wraps the name in `escapeHtml()` (see
   `renderAdjForm()`'s `safeKey` for the attribute-value case). Also brought the local
   `escapeHtml()` up to parity with the Dashboard Template's canonical version, which
   additionally escapes `'` → `&#39;` (this file's copy previously didn't).
   **Standing rule:** any new user-editable string (a new form field, a new Firestore-
   backed value) that lands in `innerHTML` — as text OR as an attribute value — needs
   `escapeHtml()` around it, no exceptions; check both new call sites this creates.
2. **No interactive element was keyboard-reachable.** Every clickable control on this
   page (pay toggle, both tab bars, copy-message/announce/toolbar buttons, +调整,
   the unit-breakdown row, 撤销 undo links) is a plain `<div>` with a mouse-only click
   handler — no `tabindex`, no `role`, unusable without a mouse/touchscreen (this
   predates the receipt-style rewrite and was never revisited). **Fixed:** every one
   now carries `role="button"`/`role="tab"` + `tabindex="0"` (a locked pay button gets
   `tabindex="-1"` + `aria-disabled="true"` instead, since it's a no-op while locked),
   the two tab rows are wrapped in `role="tablist"` with `aria-selected` on each tab,
   the pay toggle exposes `aria-pressed`, "+ 调整" exposes `aria-expanded`, a `:focus-
   visible` outline was added for all of these (a `<div>` gets none by default), and a
   single delegated `keydown` listener on `#app` (added once at boot — `#app` itself is
   never replaced, only its `innerHTML`, so this survives every re-render) fires
   `el.click()` on Enter/Space for anything matching `role="button"`/`role="tab"`.
   Escape now also closes the unit-breakdown overlay (it already closed on click-
   outside). **Standing rule:** any new clickable element added later needs the same
   `role`/`tabindex` treatment — the delegated Enter/Space handler already covers it,
   so a new button just needs the attribute, not new JS; a real `<button>` element
   works too and needs neither.
3. **Light-theme `--muted` failed WCAG AA contrast.** Measured (relative-luminance
   formula) at ≈3.84:1 against `--paper` (`#fffcf6`) — below the 4.5:1 AA minimum for
   the many normal-size (11-14px) labels/item lines using it (`.statLabel`, `.itemLine`,
   `.progressLabel`, etc.). The dark-theme value was independently checked and already
   fine (≈6:1) — the two were never assumed to move together. **Fixed:** light-theme
   `--muted` changed from `#8a7f6e` to `#756a58` (≈5.18:1); dark theme untouched.
   Not audited yet, flagged for a future pass if it matters: `--warn-text`/`--warn-bg`,
   `.walkinTag`'s `--line`/`--muted` fill+text pairing.

None of this changed `README.md`'s feature list — nothing user-visible moved.

---

### Walk-in name double-@ fix (2026-09-11)

**Bug:** a walk-in buyer added via "+ 新增买家" showed up as `@@大燕子🐣⛄️❄️` in the
copied payment message instead of `@大燕子🐣⛄️❄️`. Root cause: the operator copied the
name straight out of a WeChat message where it appeared as a mention ("@某某") and
pasted the whole thing — including the "@" — into the walk-in name field. That stored
name then hit the `"@{name}"` greeting template in `buildMemberMessage()`, doubling
the "@".

**Fixed** in `handleAdjSave()`: a leading `@` (one or more) is now stripped from
`adjDraft.name` before it's saved as `memberName` —
`.trim().replace(/^@+/, "")`. This is a one-time, one-character-class strip of mention
syntax, not a general name-normalization — it doesn't touch emoji, kana, or any other
character the memory notes protect (see "Real member names must never appear in
docs..." rule; that rule is about not altering/scrubbing legitimate name content, a
leading "@" is never legitimate name content). Fixing it at save time (rather than
only at message-build time) means the correction also applies everywhere else
`m.name` is used — card header, print view, adjustment matching — not just the one
button that surfaced the bug.

**Not retroactive:** this only prevents it going forward. Any walk-in already saved
with a leading "@" in a live round's Firestore `adjustments/{date}` doc still has it
stored that way — there's no code path here that rewrites existing Firestore data, so
those need a manual fix (undo the adjustment via the "撤销" link and re-add the
walk-in without the "@").

`README.md` updated (both language sections, "+ 新增买家" bullet) to tell the operator
not to include "@" when entering a walk-in's name, as a belt-and-suspenders alongside
the code fix.

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

There used to be a Claude-artifact version (`.jsx`, `window.storage`-based) — abandoned
because of a platform postMessage cross-origin bug (`anthropics/claude-code#42064`).
Don't resurrect that approach unless asked; GitHub Pages + Firebase is the current and
working setup.

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
6. Add a new entry to `manifest.json`: `{ "date": "...", "label": "M/D", "file": "data-<date>.json" }`.
   Newest date goes first.
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

**Two copies exist and must be kept in sync:** `index.html` fetches the JSON file at
runtime. The abandoned/reference `groupbuy_dashboard.html` artifact-preview version
can't fetch local files, so it carries the same table embedded inline as a JS constant.
When editing the map, update both, or just tell the user only `index.html` matters for
the live site.

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

**index.html only:** `buildMemberMessage` depends on the adjustments/edit-mode data already loaded
into `index.html`'s state. The legacy/reference `groupbuy_dashboard.html` doesn't have that
infrastructure and was NOT given this feature — it only got the emoji-map sync (see A1). If asked
to add it there too, the adjustments system would need to be ported over first.

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
  WeChat.
- **Persistent, not per-round.** A member's unit doesn't reset or need re-entering
  when a new round starts — it's one directory shared across every round's data,
  loaded once at boot (`subscribeToMemberUnits()`), not tied to any `date`.
- **Only visible from the "🏠 门牌管理" panel**, which only appears in edit mode
  (same PIN gate as delivery-day adjustments) — it's not part of the plain card
  view that loads for anyone opening the link, so it doesn't clutter (or expose)
  the default view.

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

**A product's icon shows the default 🛒 instead of something specific:** its Chinese
label doesn't match any keyword in `product-emoji-map.json`. Extend the map (see
"Product emoji icons" above) rather than hardcoding an icon into a product's `label`.

**A fully-paid round won't let you add an adjustment or new buyer:** it's auto-locked
(see A5) — tap "🔓 解锁" in the toolbar and enter the edit PIN.

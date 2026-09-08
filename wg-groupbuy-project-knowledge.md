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
| `firestore.rules` | Firestore security rules (open read/write, scoped to the `paidStatus` and `adjustments` collections only). |
| `README.md` | User-facing docs (Chinese + English) for this specific deployment. |

There used to be a Claude-artifact version (`.jsx`, `window.storage`-based) — abandoned
because of a platform postMessage cross-origin bug (`anthropics/claude-code#42064`).
Don't resurrect that approach unless asked; GitHub Pages + Firebase is the current and
working setup.

**Whenever any project file changes** (`index.html`, `manifest.json`, `data-<date>.json`,
`firestore.rules`) — always send it to the user as a downloadable file (not just save it
to the project docs). They deploy by manually uploading each changed file to GitHub, so
without the actual download they have nothing to upload.

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
   if there is one; otherwise ask, don't assume.
6. Add a new entry to `manifest.json`: `{ "date": "...", "label": "M/D", "file": "data-<date>.json" }`.
   Newest date goes first.
7. Get both files into the live repo (commit + push if this session has repo access;
   otherwise hand the user the full contents of both files and point them to GitHub's
   "Add file → Upload files"). `index.html` doesn't need to change.

### `data-<date>.json` schema

```json
{
  "groupName": "WG团购群",
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

### Suggested first message for this ask

> "New group buy for [date]. Here's the 接龙: [paste message]"

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
     {"member": "Amy", "type": "credit", "amountDelta": -3, "note": "退款：等太久"}
   ]
   ```
   When computing `amountDelta` for an `"item"` type entry yourself, multiply by that
   product's `price` from the round's `data-<date>.json` — don't leave it for the page
   to infer, since the page trusts whatever `amountDelta` you send.

Entries can be undone individually from the dashboard (an "撤销" link next to each
adjustment line, visible in edit mode) — this deletes just that one Firestore field.

### Suggested first message for this ask

> "Delivery day for [date]: [describe what happened — shortages, refunds, extra sales]"

---

## B. Setting up a brand-new dashboard from scratch (a different group)

`index.html` is fully generic — it only knows about `manifest.json`, the
`data-*.json` files it points to, and a Firebase project for live paid-status sync.
Nothing in it is specific to WG团购群 except the Firebase config. To stand up an
independent dashboard for a different group:

1. **New GitHub repo.** Create it, then enable Pages: Settings → Pages → Deploy from
   branch → `main` / root. Live URL will be `https://<github-username>.github.io/<repo>/`.
2. **Copy `index.html` as-is** from this project into the new repo — no changes needed
   yet except the Firebase config (step 4).
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
   `data-<date>.json`, and the `firestore.rules` file for reference). Pages updates
   the live site within about a minute of a push to `main`.
8. Confirm the live URL loads, shows the first round, and that toggling paid status
   updates Firestore (check the Firebase console's Firestore data browser, or open the
   link in two tabs and confirm a toggle in one shows up in the other).

From then on, adding further rounds to that new dashboard follows the same steps as
section A.

---

## Troubleshooting

**Two devices show different paid-status data shortly after a push:** almost always
GitHub Pages' CDN serving a stale cached `index.html`. Wait a minute or two, or reopen
in a private/incognito window. If still wrong, view page source and confirm the word
`firebase` appears (i.e. the live version really did update).

**Red 🔧 banner at the top of the page:** a Firestore read/write failed — the banner
shows the actual error message, which is the fastest way to debug it.

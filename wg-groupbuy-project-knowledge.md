# WG团购群 — Group Buy Dashboard: Schema & Workflow

This project maintains a receipt-style payment-collection dashboard for group buys.
Two parallel outputs exist; ask the user which one they want updated if unclear:

1. **GitHub static site** (`index.html` + `manifest.json` + one `data-<date>.json` per
   group buy) — hosted for free, viewed by anyone with the URL, paid-status saved
   per-browser via localStorage.
2. **Claude artifact** (single `.jsx` file, data baked into a `GROUP_BUYS` array in the
   code) — paid-status shared live across everyone with the artifact link via
   `window.storage` (shared: true), keyed by date.

## When given a raw group order message (接龙)

The user will paste a WeChat-style order thread: a product/price list followed by
numbered member lines, often written inconsistently (some list flavors in order,
some combine orders, some use shorthand like "各1" for one of each, "原味"/"鲜肉" as
a bare alias for the base/signature flavor).

Steps:
1. Extract the product list into `products`: short English key → `{label (Chinese), price}`.
   Reuse the same keys across group buys if the product line is unchanged (sig, corn,
   mush, seaweed, chive, shrimp, salted, century) — new products get new short keys.
2. Parse every member line into `orders`: `{ name, items: {key: qty, ...} }`. Preserve
   the name exactly as written, including emoji/symbols.
3. Resolve ambiguous flavor references (e.g. "原味" or bare "鲜肉" typically means the
   base/signature flavor) using judgment, and flag the assumption to the user rather
   than silently guessing when genuinely unclear.
4. **Verify totals with a script** (don't hand-total) before presenting numbers —
   sum each member's cost, total boxes, and grand total, and sanity-check against any
   delivery-minimum mentioned in the message.
5. Output `data-<date>.json` in the schema below. Use the date embedded in the
   message if there is one; otherwise ask, don't assume.
6. For the GitHub target, also give the updated `manifest.json` with a new entry
   appended: `{ "date": "...", "label": "M/D", "file": "data-<date>.json" }`.
   For the artifact target, give a new object appended to the `GROUP_BUYS` array
   in the `.jsx` file instead.

## `data-<date>.json` schema

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

Notes:
- `groupName` stays "WG团购群" across group buys (shown as the page header) unless
  told otherwise.
- No `productLabel` or delivery-note field — those were removed from the display by
  request; don't reintroduce them unless asked.
- All page UI text is Mandarin (labels, buttons, section headers) — keep any new
  strings in Mandarin to match.

### Adding a new product

When a group buy introduces a product that hasn't appeared before:
1. Give it a new short English key (snake_case, e.g. `pork_belly`) — don't reuse or
   overload an existing key even if the Chinese name is similar.
2. Set `price` to whatever the message states per unit.
3. Add a `unit` field whenever the product isn't sold by the standard "盒" (box) —
   e.g. `"unit": "kg"` for anything priced "$X/斤" or "$X/kg", or any other unit the
   message states (斤, 包, 份, etc. — use whatever word the message uses). Omit
   `unit` entirely for standard box items; it defaults to "盒" automatically.
4. If a product's price or unit changes between group buys (e.g. seasonal pricing),
   update it only in that date's file — don't touch past dated files.

### Partial / fractional quantities

Quantities can be any decimal, not just whole numbers — this is how "半份" (half
portion), "1.5kg", etc. get represented: e.g. `{ "pork_belly": 0.5 }`. This works
for box items too if a vendor allows half-box orders. Don't round to the nearest
whole number — enter exactly what the member ordered.

### Combined / shared orders

When two or more members order together and will pay as a single lump sum (rather
than each having their own itemized order), represent it as **one** `orders` entry
whose `name` is the combined names, e.g. `"name": "Lesley & Choies"`. This becomes
one line item with one "mark paid" toggle — appropriate for a group buy where the
organizer collects one payment for the pair rather than splitting it. Don't try to
model per-person cost-splitting within a combined order unless asked — that's a
different (and currently unsupported) feature.

## Design conventions already established (don't relitigate unless asked)

- Receipt-style aesthetic: warm parchment background, dashed dividers, monospace
  numbers, serif header font.
- Auto light/dark mode via `prefers-color-scheme` (no manual toggle).
- Responsive: single column on mobile, two-column member grid above 860px.
- Each member card = itemized line per flavor with its own subtotal, then a total
  line — not a single joined string.
- Filter tabs: 全部 / 未付款 / 已付款.
- Pay toggle button text: "标记已付款" / "已付款 ✓".
- Totals are grouped by unit, not blindly summed — a summary with both "盒" and
  "kg" products shows separate rows/values per unit (e.g. "总数量（盒）: 45" and
  "总数量（kg）: 3.5") rather than one meaningless combined number.

## Suggested first message in a new chat

> "New group buy for [date]. Update [GitHub files / the artifact]. Here's the 接龙:
> [paste message]"

# WG团购群 — Group Buy Collection Dashboard

A simple, self-hosted receipt-style dashboard for tracking group buy orders and
payment collection. Built for the WG团购群 group, but reusable for any group buy —
just swap the data.

**Live site:** https://zoidz78.github.io/wg-groupbuy/

## What it does

- Shows every member's order broken down flavor-by-flavor with a subtotal per item,
  then their total
- Tracks who's paid with a tap ("标记已付款" / "已付款 ✓")
- Running totals: participants, quantity per unit (盒/kg/etc.), order total,
  collected, outstanding
- A prep/shopping list showing how much of each flavor to order overall
- Filter by 全部 / 未付款 / 已付款
- Supports multiple group buys as tabs (by date) once more than one exists
- Auto light/dark mode, responsive for both phone and desktop

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app — reads `manifest.json` and the referenced `data-*.json` files. You should rarely need to touch this. |
| `manifest.json` | Lists every group buy: `{ date, label, file }`. Newest date shows first. |
| `data-<date>.json` | One file per group buy: products, prices, and every member's order. |

## Adding a new group buy

1. Create a new `data-<date>.json` file (see schema below).
2. Add one line to `manifest.json`:
   ```json
   { "date": "2026-09-14", "label": "9/14", "file": "data-2026-09-14.json" }
   ```
3. Upload both files to this repo (Add file → Upload files). `index.html` doesn't
   need to change.

Once there are 2+ entries in `manifest.json`, a tab row appears at the top of the
page letting you switch between group buys.

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

- `products` — short key → `{ label (Chinese), price, unit? }`. `unit` is optional
  and defaults to `"盒"` (box) — set it explicitly (e.g. `"kg"`) for anything sold
  by weight or other non-box unit.
- `orders` — one entry per paying line item. `items` quantities can be decimals
  (e.g. `0.5` for a half portion/half kilo).
- **Combined orders**: if two members order together and pay as one lump sum, use
  a single entry with both names as one string, e.g. `"name": "Lesley & Choies"`.

## Notes

- Paid/unpaid status is saved in **each visitor's own browser** (localStorage) —
  it isn't shared across devices or people. For a version where "paid" status is
  shared live across everyone with the link, see the companion Claude artifact
  version of this project.
- All UI text is Mandarin by design — keep any new strings in Mandarin to match.

## Hosting

This repo is served via **GitHub Pages** (Settings → Pages → Deploy from branch →
`main` / root). Any push to `main` updates the live site within a minute or so.

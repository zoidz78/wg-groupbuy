# Product Requirement Document (PRD): WeChat Group Buy H5 Ordering App

## Project Overview
We are building a lightweight, mobile-responsive **H5 Web App** for WeChat group buy (团购) order collection. 
Instead of requiring complex backend workflows, WeChat Pay APIs, or native Mini Program approvals, this application operates as a fast front-end order generator backed by a real-time database (**Firebase Firestore**).

The app allows group members to select products from an active catalog, automatically formats their orders into standard WeChat 接龙 (thread) text strings, saves structured order records directly to Firestore, and copies the compiled 接龙 list to their clipboard for easy pasting back into WeChat.

---

## Target Tech Stack
* **Frontend:** HTML5, CSS3 (Tailwind CSS or clean CSS), Vanilla JS / React / Vue.
* **Database & Real-Time Sync:** Firebase Firestore (for atomic order indexes and state consolidation).
* **Hosting:** Static hosting (GitHub Pages, Vercel, or Netlify).
* **Target Environment:** Mobile WebView inside WeChat iOS/Android.

---

## Core System Architecture & User Flow

### 1. Member Workflow (Front-End H5)
1. **Access:** Member taps an H5 link or scans a QR code inside the WeChat group chat.
2. **Identification:** Member inputs their **WeChat Display Name** (微信昵称).
3. **Product Selection:** Member filters products by category tabs, browses available items, selects quantities (`+` / `-`), and adds notes or gift options where applicable.
4. **Order Submission & Atomic Lock:** Member taps **"Submit & Copy 接龙" (提交并复制接龙)**.
   * The frontend executes an **atomic transaction** against Firestore to assign a guaranteed, incremental index number (e.g., `#32`).
   * The structured order record is saved to Firestore.
   * The app generates the **entire master 接龙 thread text** (Items 1 through N) and writes it directly to the device clipboard.
5. **Chat Posting (Optional):** Member jumps back to WeChat and pastes the updated thread into the chat room for social proof.

### 2. Admin & Operational Workflow (Existing Dashboard Integration)
* **Single Source of Truth:** Firestore stores every submitted order as structured JSON. 
* **Zero Parsing Overhead:** The admin dashboard reads directly from Firestore to calculate round totals, track payments (PayNow in Singapore), toggle delivery/packing statuses, and render visual receipts.
* **Resilience:** Out-of-order pastes, missing chat messages, or chat typos do not impact order fulfillment.

---

## Functional Requirements

### 1. Concurrency Control (Firestore Atomic Transactions)
* Must use Firestore `runTransaction` when saving orders to prevent race conditions when multiple members submit simultaneously.
* Dynamic counter tracks the total number of orders submitted in the current round and increments safely.

### 2. Category Tab Navigation & Availability
* **Category Tabs:** Render category tabs (e.g., *Meats, Produce, Frozen, Gifts*) dynamically derived from the `category` field to simplify mobile navigation.
* **Active Status Filtering:** Only display items where `"active": true` during customer ordering. Hide or disable items marked `"active": false`.

### 3. 接龙 Text Formatting Engine
The app must format clipboard output to strictly match this pattern:

```text
[Index]. [WeChat Name]
[Emoji] [Product Label] $[Price]/[Unit] [-要 X 份 / Custom Notes]
[Gift Emoji][Gift Description]

Example Output String:
1. ZJ 
🐮小条金钱腱   $18/kg，称重
🐥甘榜鸡  $13/kg， 称重
🐂潮汕牛筋丸   $15.80/包
🐟金目鲈 $9.9

2. 木木三の柒 
🐮嫩滑牛肉片 $19/包/1kg
🐂美国安格斯牛肉饼 $10/130g*6片 
🇨🇳猪梅肉 $6.5/包/500g -要2包
👉🏻送小零食1包

4. UI/UX Specifications
 * Mobile-First Design: Optimized for 375px–430px mobile viewports inside WeChat WebView.
 * Weighed Item Indicators: Items with "weighMode": "weight" must clearly exhibit a "称重" badge.
 * Quantity Controls: Easy-tap + / - steppers for each item.
 * One-Tap Feedback: Clear visual modal/toast confirming: "接龙 text copied! Switch to WeChat and paste."
 * Search / Filter: Filter catalog items dynamically by label or alternative names (aka).
Data Schema & Product Catalog Reference
Below is the product catalog JSON schema used to populate the ordering menu and manage metadata (units, prices, categories, availability, weight flags, and piece counts).
{
  "_readme": "Build-time reference only. Consulted when building each new data-<date>.json to keep product keys/labels/units consistent across rounds.",
  "products": {
    "apple_envy": {
      "label": "Envy苹果(5粒/份)",
      "unit": "份",
      "lastPrice": 10.5,
      "lastRound": "2026-09-10",
      "piecesPerUnit": 5,
      "category": "fruit",
      "active": true
    },
    "asparagus": {
      "label": "芦笋(500g/份)",
      "unit": "份",
      "lastPrice": 7.8,
      "lastRound": "2026-09-10",
      "weighMode": "weight",
      "gramsPerUnit": 500,
      "category": "produce",
      "active": true
    },
    "beef_jinqian_jian": {
      "label": "小条金钱腱",
      "unit": "kg",
      "lastPrice": 18,
      "lastRound": "2026-09-11",
      "weighMode": "weight",
      "category": "meat",
      "active": true
    },
    "beef_patty_angus": {
      "label": "美国安格斯牛肉饼(130g*6片/包)",
      "unit": "包",
      "lastPrice": 10,
      "lastRound": "2026-09-11",
      "weighMode": "weight",
      "gramsPerUnit": 780,
      "piecesPerUnit": 6,
      "category": "meat",
      "active": true
    },
    "beef_short_rib": {
      "label": "牛肋条",
      "unit": "kg",
      "lastPrice": 22,
      "lastRound": "2026-09-11",
      "weighMode": "weight",
      "category": "meat",
      "active": true
    },
    "beef_slice_tender": {
      "label": "嫩滑牛肉片(1kg/包)",
      "unit": "包",
      "lastPrice": 19,
      "lastRound": "2026-09-11",
      "weighMode": "weight",
      "gramsPerUnit": 1000.0,
      "category": "meat",
      "active": true
    },
    "chicken_gambang": {
      "label": "甘榜鸡",
      "unit": "kg",
      "lastPrice": 13,
      "lastRound": "2026-09-11",
      "weighMode": "weight",
      "category": "meat",
      "active": true
    },
    "dumpling_cabbage_pork": {
      "label": "白菜猪肉水饺(1kg/包)",
      "unit": "包",
      "lastPrice": 12.9,
      "lastRound": "2026-09-11",
      "weighMode": "weight",
      "gramsPerUnit": 1000.0,
      "category": "frozen",
      "active": true
    },
    "fish_barramundi": {
      "label": "金目鲈(700-800g/条，已处理)",
      "unit": "条",
      "lastPrice": 9.9,
      "lastRound": "2026-09-11",
      "category": "seafood",
      "active": true
    },
    "fish_black_slice": {
      "label": "免浆黑鱼片(1kg/包)",
      "unit": "包",
      "lastPrice": 18,
      "lastRound": "2026-09-11",
      "weighMode": "weight",
      "gramsPerUnit": 1000.0,
      "category": "seafood",
      "active": true
    },
    "mantou_brownsugar": {
      "label": "红糖馒头(5粒/包)",
      "unit": "包",
      "lastPrice": 4,
      "lastRound": "2026-09-11",
      "piecesPerUnit": 5,
      "category": "bakery",
      "active": true
    },
    "mooncake_maoshanwang": {
      "label": "原味猫山王冰皮月饼",
      "unit": "盒",
      "lastPrice": 30,
      "lastRound": "2026-09-11",
      "category": "bakery",
      "active": true
    },
    "pork_meirou_cn": {
      "label": "湖南猪梅肉(500g/包)",
      "unit": "包",
      "lastPrice": 6.5,
      "lastRound": "2026-09-11",
      "weighMode": "weight",
      "gramsPerUnit": 500.0,
      "category": "meat",
      "active": true
    },
    "gift_snack_random": {
      "label": "随机小零食(赠品)",
      "unit": "包",
      "category": "gift",
      "active": false
    }
  }
}

Tasks for AI Developer / Coding Assistant
 * Build index.html & UI Layout: Create a clean, single-page mobile layout with dynamic category filter tabs, a search bar, and quantity controls (+ / -).
 * Setup Firestore Integration: Implement atomic order creation using firebase.firestore().runTransaction() to safely handle simultaneous orders and sequence counter assignment.
 * Write Text Generation Helper: Create a JavaScript function generateJieLongText() to fetch all active orders for the current round and construct the formatted WeChat string.
 * Implement Clipboard & Fallback: Trigger navigator.clipboard.writeText() on submission and present a clear confirmation toast.


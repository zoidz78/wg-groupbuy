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
3. **Product Selection:** Member browses available items, selects quantities (`+` / `-`), and adds notes or gift options where applicable.
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

### 2. 接龙 Text Formatting Engine
The app must format clipboard output to strictly match this pattern:

```text
[Index]. [WeChat Name]
[Emoji] [Product Label] $[Price]/[Unit] [-要 X 份 / Custom Notes]
[Gift Emoji][Gift Description]

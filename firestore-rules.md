# Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Tracks whether each member has paid for a given group buy event.
    // Doc ID = group buy date (e.g. "2026-09-07"). Open read/write so the
    // dashboard can sync payment status in real time for all viewers.
    match /paidStatus/{groupBuyDate} {
      allow read, write: if true;
    }

    // Stores order adjustments (quantity/amount deltas, weight notes, etc.)
    // for a given group buy event. Doc ID = group buy date.
    match /adjustments/{groupBuyDate} {
      allow read, write: if true;
    }

    // Stores member profile/reference info (e.g. display name mappings).
    // Doc ID = member/document identifier.
    match /memberInfo/{docId} {
      allow read, write: if true;
    }
  }
}
```

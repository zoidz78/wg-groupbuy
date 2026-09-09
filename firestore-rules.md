# Firestore Rules

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
    match /memberInfo/{docId} {
      allow read, write: if true;
    }
  }
}
```

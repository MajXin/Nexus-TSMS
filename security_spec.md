# Nexus TSMS Security Specification

## 1. Data Invariants
- A `TimetableSlot` must have a valid `teacherId` and `classId`.
- A `Quiz` can only be created by an 'Admin' or 'Teacher'.
- A `Submission` must correspond to an existing `Quiz` and be submitted by a registered 'Student'.
- `User` profile updates (like role changes) are restricted to 'Admin' only.

## 2. The "Dirty Dozen" Payloads (Red Team Test Cases)
1. **Unauthorized User Creation**: Student attempting to set their role to 'Admin' during registration.
2. **Quiz Mutability Attack**: Student attempting to modify the `correctAnswer` in a `Quiz` document.
3. **Ghost Slot Injection**: Injecting a timetable slot with a 1MB string as `teacherId`.
4. **Identity Spoofing**: Student trying to list other users' `submissions`.
5. **Notice Hijacking**: Student trying to update a `Notice` created by an Admin.
6. **Time Warp**: Submission with a future `completedAt` timestamp provided by the client.
7. **Negative Score**: Student submitting a `score` of `-100`.
8. **Shadow Field**: Adding `isVerified: true` to a User object to bypass verification if implemented.
9. **Relational Break**: Creating a `TimetableSlot` for a non-existent `classId`.
10. **Query Scrape**: Authenticated user trying to `list` all `users` with PII exposed.
11. **ID Poisoning**: Document IDs containing malicious characters or being excessively large.
12. **Double Booking Bypass**: (In context of rules, this usually requires transaction-like checks, but rules will enforce structure).

## 3. Test Runner Concept
The tests will ensure that any write that violates these invariants is rejected with `PERMISSION_DENIED`.

# TrustVet AI

Zero-knowledge vendor vetting on Midnight. Submit a financial threshold proof
without revealing the underlying balance; query pass/fail status; ask the AI
chat whether a vendor qualifies.

Built in 48 hours by a 2-person team. See `SCOPE.md` for what is and isn't
in scope — read it before adding anything.

## Role Split

**Person A — Blockchain + Backend**
- `circuit/` — the Compact `ThresholdVetting` circuit
- `backend/` — Express API: proof submission, indexer, chat tool endpoint
- Owns: one bulletproof data path (submit proof → on-chain → indexed → queryable)

**Person B — Frontend + AI**
- `frontend/` — React dashboard (submit form + vendor list) and chat UI
- Owns: wiring the UI to Person A's documented API contracts; mock until real

## Repo Layout

```
trustvet-ai/
├── circuit/          # Compact circuit source + compiled output
├── backend/          # Express API (submit, query, chat)
│   └── src/
│       └── routes/
├── frontend/          # React app (form, dashboard, chat)
│   └── src/
│       ├── components/
│       └── pages/
├── SCOPE.md
└── README.md
```

## Getting Started

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

## API Contract (Person A ships this first, Person B mocks against it)

Both `balance` and `threshold` are **private inputs** to the circuit — they're
used locally to generate the proof and must never be persisted, logged, or
returned by any endpoint. Only `proofId` and the resulting `status`
(pass/fail) are stored and queryable.

| Endpoint            | Method | Body / Params                         | Returns                          |
|---------------------|--------|----------------------------------------|-----------------------------------|
| `/api/submit`       | POST   | `{ balance, threshold, vendorId }`     | `{ proofId, status: "pending" }`  |
| `/api/vendors`      | GET    | —                                       | `[{ vendorId, status, proofId }]`|
| `/api/chat`         | POST   | `{ message }`                          | `{ reply }`                       |

See `backend/README.md` for details as they firm up.

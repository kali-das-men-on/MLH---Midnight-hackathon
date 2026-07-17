# TrustVet AI

Zero-knowledge vendor vetting on Midnight. A subcontractor submits a
financial threshold proof without revealing their balance *or* the required
threshold; a prime contractor queries pass/fail status and can ask an AI
assistant whether a vendor qualifies - grounded only in proof metadata.

Built in 48 hours by a 2-person team. See `SCOPE.md` for what is and isn't
in scope - read it before adding anything.

## Role Split

**Person A — Blockchain + Backend**
- `circuit/threshold-vetting/` — the Compact `ThresholdVetting` circuit
- `backend/` — Express + TypeScript API: proof submission, indexer, chat
- Owns: one bulletproof data path (submit proof → on-chain → indexed → queryable)

**Person B — Frontend + AI**
- `frontend/` — React + TypeScript dashboard (submit form + vendor list) and chat UI
- Owns: wiring the UI to Person A's documented API contracts; mock until real

## Repo Layout

```
trustvet-ai/
├── circuit/
│   └── threshold-vetting/
│       ├── Compact.toml
│       └── src/main.compact
├── backend/                  # Express + TypeScript API
│   └── src/index.ts
├── frontend/                 # React + TypeScript app
│   └── src/
│       ├── pages/
│       ├── components/
│       └── services/api.ts
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

`privateBalance` and `minimumThreshold` are **both private inputs** to the
circuit — used only in-memory to generate the proof, then discarded. No
endpoint ever persists, logs, or returns either value; only the boolean
result, a commitment hash, and a timestamp are public.

| Endpoint                    | Method | Body                                                    | Returns                                                   |
|-------------------------------|--------|------------------------------------------------------------|----------------------------------------------------------------|
| `/submit-proof`              | POST   | `{ subcontractorId, privateBalance, minimumThreshold }`    | `{ subcontractorId, pass, commitmentHash, timestamp }`         |
| `/proofs/recent`              | GET    | —                                                            | `[{ subcontractorId, pass, commitmentHash, timestamp }]`       |
| `/proofs/:subcontractorId`    | GET    | —                                                            | `{ subcontractorId, pass, commitmentHash, timestamp }`         |
| `/chat`                        | POST   | `{ subcontractorId, userMessage }`                          | `{ response, proofContext }`                                    |

See `backend/README.md` for details as they firm up.

# Backend

Owner: Person A

Express + TypeScript API. Both `privateBalance` and `minimumThreshold` are
private circuit inputs - used only in-memory to generate the proof, then
discarded. Nothing downstream (storage, `/proofs/*`, `/chat`) ever sees or
returns either value.

## Run
```bash
npm install
npm run dev
```

## Endpoints

| Endpoint                       | Method | Body                                                    | Returns                                                  |
|---------------------------------|--------|----------------------------------------------------------|-------------------------------------------------------------|
| `/submit-proof`                | POST   | `{ subcontractorId, privateBalance, minimumThreshold }`  | `{ subcontractorId, pass, commitmentHash, timestamp }`      |
| `/proofs/recent`                | GET    | -                                                          | `[{ subcontractorId, pass, commitmentHash, timestamp }]`    |
| `/proofs/:subcontractorId`      | GET    | -                                                          | `{ subcontractorId, pass, commitmentHash, timestamp }`      |
| `/chat`                          | POST   | `{ subcontractorId, userMessage }`                        | `{ response, proofContext }`                                 |

## Manual test
```bash
bash test.sh
```

## Definition of Done
- [ ] `/submit-proof` calls the real Compact circuit + local proof server
- [ ] `/proofs/*` read from a real indexer instead of the in-memory object
- [ ] `/chat` calls a real model instead of the hardcoded string, using
      `SYSTEM_PROMPT` + proof metadata as its only context

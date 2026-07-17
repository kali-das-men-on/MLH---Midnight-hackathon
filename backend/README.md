# Backend

Owner: Person A

Express API. Three endpoints only — see root README for the contract table.
Ship mocked responses first so Person B can wire the frontend immediately,
then replace mocks with real circuit/proof-server/indexer calls.

## Run
```bash
npm install
npm run dev
```

## Definition of Done
- [ ] `/api/submit` calls real proof server, submits to Midnight
- [ ] `/api/vendors` reads real indexer state
- [ ] `/api/chat` has a tool to query vendor status

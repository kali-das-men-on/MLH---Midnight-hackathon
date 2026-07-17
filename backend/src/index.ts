import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ============================================================================
// PROOF STORAGE (in-memory for the 48h build)
// ============================================================================
type StoredProof = {
  subcontractorId: string;
  pass: boolean;
  commitmentHash: string;
  timestamp: string;
  // privateBalance and minimumThreshold are NEVER stored here.
  // Both are private circuit inputs, used only in-memory to generate the
  // proof for the duration of this request, then discarded.
};

const proofDB: Record<string, StoredProof> = {};

// ============================================================================
// ENDPOINT 1: Submit Proof
// POST /submit-proof
// body: { subcontractorId, privateBalance, minimumThreshold }
// returns: { subcontractorId, pass, commitmentHash, timestamp }
// ============================================================================
app.post("/submit-proof", (req: Request, res: Response) => {
  const { subcontractorId, privateBalance, minimumThreshold } = req.body;

  if (!subcontractorId || privateBalance == null || minimumThreshold == null) {
    return res.status(400).json({
      error: "subcontractorId, privateBalance, minimumThreshold required",
    });
  }

  // TODO(Person A): replace this in-process simulation with a real call to
  // the Compact circuit + local proof server (circuit/threshold-vetting).
  const passed = privateBalance >= minimumThreshold;
  const commitmentHash = `0x${Math.random().toString(16).slice(2, 10)}`;
  const timestamp = new Date().toISOString();

  proofDB[subcontractorId] = {
    subcontractorId,
    pass: passed,
    commitmentHash,
    timestamp,
  };

  // Neither privateBalance nor minimumThreshold is echoed back - both stay
  // private, matching the circuit's privacy guarantee.
  res.json({ subcontractorId, pass: passed, commitmentHash, timestamp });

  console.log(`Proof submitted: ${subcontractorId} -> ${passed ? "PASS" : "FAIL"}`);
});

// ============================================================================
// ENDPOINT 2: List recent proofs
// GET /proofs/recent
// returns: [{ subcontractorId, pass, commitmentHash, timestamp }]
// ============================================================================
app.get("/proofs/recent", (_req: Request, res: Response) => {
  res.json(Object.values(proofDB));
});

// ============================================================================
// ENDPOINT 3: Get a single proof
// GET /proofs/:subcontractorId
// ============================================================================
app.get("/proofs/:subcontractorId", (req: Request, res: Response) => {
  const proof = proofDB[req.params.subcontractorId];
  if (!proof) {
    return res.status(404).json({ error: "Proof not found" });
  }
  res.json(proof);
});

// ============================================================================
// ENDPOINT 4: AI Chat (proof-plane only)
// POST /chat
// body: { subcontractorId, userMessage }
// returns: { response, proofContext }
//
// System prompt keeps the model on proof-plane data only. Since threshold is
// now private (not just balance), the model never sees or mentions a dollar
// figure at all - only the boolean pass/fail, hash, and timestamp.
// ============================================================================
const SYSTEM_PROMPT = `You are TrustVet, a procurement vetting assistant.

You answer questions about vendor eligibility based ONLY on on-chain proof
metadata: { pass: boolean, commitmentHash: string, timestamp: string }.

RULES:
- NEVER mention or guess at dollar figures, balances, or thresholds - you do
  not have access to them and they are never provided to you.
- If asked for the underlying balance or threshold, say "I only verify a
  pass/fail result, not the underlying figures."
- If no proof exists for a vendor, say "No proof found for this vendor."

Example good response:
Q: "Does Acme qualify?"
A: "Yes, Acme has a valid vetting proof as of Jan 20."

Example bad response (DO NOT DO):
A: "Acme has over $250k in reserves."`;

app.post("/chat", async (req: Request, res: Response) => {
  const { subcontractorId, userMessage } = req.body;
  const proof = proofDB[subcontractorId];

  if (!proof) {
    return res.json({
      response: `No proof found for vendor ${subcontractorId}.`,
      proofContext: null,
    });
  }

  // TODO(Person A / owner of AI integration): replace with a real model call
  // using SYSTEM_PROMPT + proof as the only context the model receives.
  const response = `${subcontractorId} has a ${
    proof.pass ? "valid" : "invalid"
  } vetting proof. Proof date: ${proof.timestamp}.`;

  res.json({
    response,
    proofContext: {
      pass: proof.pass,
      commitmentHash: proof.commitmentHash,
      timestamp: proof.timestamp,
    },
  });

  console.log(`Chat: ${subcontractorId} | "${userMessage}" -> "${response}"`);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`TrustVet backend on http://localhost:${PORT}`);
  console.log(`  POST   /submit-proof  { subcontractorId, privateBalance, minimumThreshold }`);
  console.log(`  GET    /proofs/recent`);
  console.log(`  GET    /proofs/:subcontractorId`);
  console.log(`  POST   /chat  { subcontractorId, userMessage }`);
});

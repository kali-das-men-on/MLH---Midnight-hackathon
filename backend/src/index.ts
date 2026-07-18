import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
  status: "pending" | "closed";
  // privateBalance and minimumThreshold are NEVER stored here.
};

const proofDB: Record<string, StoredProof> = {};

// Thresholds are set by the prime contractor ahead of time, per vendor.
// Subcontractors never choose or see their own threshold - they only ever
// submit a balance against whatever the prime has configured for them.
const thresholdDB: Record<string, number> = {};

// ============================================================================
// ENDPOINT: Set a vendor's required threshold (prime contractor action)
// POST /vendors/:subcontractorId/threshold
// body: { minimumThreshold }
// returns: { subcontractorId, status: "threshold_set" }
//
// Must be called before that vendor can submit a proof. The subcontractor
// never sees or chooses this value - it's the prime's requirement.
// ============================================================================
app.post("/vendors/:subcontractorId/threshold", (req: Request, res: Response) => {
  const { subcontractorId } = req.params;
  const { minimumThreshold } = req.body;

  if (minimumThreshold == null) {
    return res.status(400).json({ error: "minimumThreshold required" });
  }

  thresholdDB[subcontractorId] = minimumThreshold;
  res.json({ subcontractorId, status: "threshold_set" });
});

// ============================================================================
// ENDPOINT 1: Submit Proof
// POST /submit-proof
// body: { subcontractorId, privateBalance, minimumThreshold }
// returns: { subcontractorId, pass, commitmentHash, timestamp }
// ============================================================================
app.post("/submit-proof", (req: Request, res: Response) => {
  const { subcontractorId, privateBalance } = req.body;

  if (!subcontractorId || privateBalance == null) {
    return res.status(400).json({
      error: "subcontractorId, privateBalance required",
    });
  }

  const minimumThreshold = thresholdDB[subcontractorId];
  if (minimumThreshold == null) {
    return res.status(400).json({
      error: "No threshold configured for this vendor yet. The prime contractor must set one first.",
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
    status: "pending",
  };

  res.json({ subcontractorId, status: "received" });

  console.log(`Proof submitted: ${subcontractorId} -> ${passed ? "PASS" : "FAIL"}`);
});

// ============================================================================
// ENDPOINT: Close a proof (prime contractor action)
// POST /proofs/:subcontractorId/close
// returns: { subcontractorId, status: "closed" }
//
// Once closed, the result becomes visible on the dashboard as final. Nothing
// here notifies the subcontractor - that's the prime's responsibility,
// outside this app.
// ============================================================================
app.post("/proofs/:subcontractorId/close", (req: Request, res: Response) => {
  const proof = proofDB[req.params.subcontractorId];
  if (!proof) {
    return res.status(404).json({ error: "Proof not found" });
  }
  proof.status = "closed";
  res.json({ subcontractorId: proof.subcontractorId, status: "closed" });
});

// ============================================================================
// ENDPOINT 2: List recent proofs
// GET /proofs/recent
// returns: [{ subcontractorId, pass, commitmentHash, timestamp, status }]
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

  const proofContext = {
    pass: proof.pass,
    commitmentHash: proof.commitmentHash,
    timestamp: proof.timestamp,
  };

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Proof metadata for ${subcontractorId}: ${JSON.stringify(
            proofContext
          )}\n\nQuestion: ${userMessage}`,
        },
      ],
      max_tokens: 150,
    });

    const response = completion.choices[0]?.message?.content || "No response generated.";

    res.json({ response, proofContext });

    console.log(`Chat: ${subcontractorId} | "${userMessage}" -> "${response}"`);
  } catch (err) {
    console.error("Groq API call failed:", err);
    res.status(500).json({
      response: "Something went wrong generating a response. Please try again.",
      proofContext,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`TrustVet backend on http://localhost:${PORT}`);
  console.log(`  POST   /submit-proof  { subcontractorId, privateBalance, minimumThreshold }`);
  console.log(`  GET    /proofs/recent`);
  console.log(`  GET    /proofs/:subcontractorId`);
  console.log(`  POST   /chat  { subcontractorId, userMessage }`);
});
import { Router } from "express";

const router = Router();

// POST /api/submit
// body: { balance, threshold, vendorId }
// returns: { proofId, status: "pending" }
//
// balance and threshold are PRIVATE inputs to the circuit. They're used only
// in-memory to generate the witness/proof and must never be written to the
// indexer, logs, or any response. Only proofId + status get stored.
//
// TODO(Person A): call proof server, then submit to Midnight, then index.
router.post("/", async (req, res) => {
  const { balance, threshold, vendorId } = req.body;
  if (balance == null || threshold == null || !vendorId) {
    return res.status(400).json({ error: "balance, threshold, vendorId required" });
  }

  // Mock response until circuit + proof server are wired in.
  res.json({ proofId: `mock-${Date.now()}`, status: "pending" });
});

export default router;

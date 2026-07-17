import { Router } from "express";

const router = Router();

// GET /api/vendors
// returns: [{ vendorId, status, proofId }]
// TODO(Person A): read from indexer.
router.get("/", async (req, res) => {
  res.json([
    { vendorId: "acme-co", status: "pass", proofId: "mock-1" },
    { vendorId: "widgets-inc", status: "fail", proofId: "mock-2" },
  ]);
});

export default router;

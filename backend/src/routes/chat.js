import { Router } from "express";

const router = Router();

// POST /api/chat
// body: { message }
// returns: { reply }
// TODO(Person B / whoever owns the AI system prompt): wire to Claude API,
// give it a tool to query /api/vendors so it can answer "does X qualify?"
router.post("/", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "message required" });

  res.json({ reply: `(mock) You asked: "${message}". Wire this up to the real model.` });
});

export default router;

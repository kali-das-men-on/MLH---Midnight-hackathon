export const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export type Proof = {
  subcontractorId: string;
  pass: boolean;
  commitmentHash: string;
  timestamp: string;
  status: "pending" | "closed";
};

export async function submitProof(
  subcontractorId: string,
  privateBalance: number
): Promise<{ subcontractorId: string; status: string }> {
  const response = await fetch(`${API_URL}/submit-proof`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subcontractorId, privateBalance }),
  });
  return response.json();
}

export async function setThreshold(
  subcontractorId: string,
  minimumThreshold: number
): Promise<{ subcontractorId: string; status: string }> {
  const response = await fetch(`${API_URL}/vendors/${subcontractorId}/threshold`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ minimumThreshold }),
  });
  return response.json();
}

export async function getRecentProofs(): Promise<Proof[]> {
  const response = await fetch(`${API_URL}/proofs/recent`);
  return response.json();
}

export async function closeProof(subcontractorId: string): Promise<{ subcontractorId: string; status: string }> {
  const response = await fetch(`${API_URL}/proofs/${subcontractorId}/close`, {
    method: "POST",
  });
  return response.json();
}

export async function chat(
  subcontractorId: string,
  userMessage: string
): Promise<{ response: string; proofContext: Omit<Proof, "subcontractorId"> | null }> {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subcontractorId, userMessage }),
  });
  return response.json();
}
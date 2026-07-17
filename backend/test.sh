#!/bin/bash
echo "Testing backend..."
curl -X POST http://localhost:5000/submit-proof \
  -H "Content-Type: application/json" \
  -d '{"subcontractorId":"sleep_test","privateBalance":300000,"minimumThreshold":250000}'

echo ""
echo "Getting proofs..."
curl http://localhost:5000/proofs/recent

echo ""
echo "Chat..."
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"subcontractorId":"sleep_test","userMessage":"Does this vendor pass?"}'

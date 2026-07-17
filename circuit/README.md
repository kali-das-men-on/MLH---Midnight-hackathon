# Compact Circuit — ThresholdVetting

Owner: Person A

## Goal
One circuit. Both inputs private: balance and threshold. Output: boolean
pass/fail. Neither the balance nor the required threshold ever leaves the
machine or appears on-chain — only the boolean does.

## Files
- `threshold_vetting.compact` — circuit source (write this first)
- `build/` — compiled artifacts (gitignored until it compiles cleanly, then
  commit the working version as a checkpoint)

## Definition of Done (Friday)
- [ ] Circuit compiles with `compactc`
- [ ] Local witness test: balance >= threshold → true, else → false
- [ ] Proof generation works against local proof server

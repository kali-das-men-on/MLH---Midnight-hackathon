# Compact Circuit — ThresholdVetting

Owner: Person A

## Goal
One circuit. Both `privateBalance` and `minimumThreshold` are private —
neither the balance nor the required bar ever leaves the subcontractor's
machine or appears on-chain. Only `pass` (boolean), a `commitmentHash`, and
`timestamp` become public.

## Layout
```
circuit/
└── threshold-vetting/
    ├── Compact.toml
    └── src/
        └── main.compact
```

## Toolchain setup
```bash
# Install Midnight (follow official docs for your OS)
# Java, Rust, and Midnight compiler versions all matter — verify each:
midnight --version
java -version
rustc --version

# Compile
cd circuit
midnight compile --input threshold-vetting
```
If any version check fails, don't proceed — sort it out first (Discord if stuck).

## Definition of Done (Friday)
- [ ] `midnight compile --input threshold-vetting` succeeds
- [ ] Local witness test: balance >= threshold → true, else → false
- [ ] Proof generation works against local proof server


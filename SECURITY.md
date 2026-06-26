# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Tree Ascension:

1. **Do not** open a public issue
2. Report via GitHub Security Advisories
3. Include a description and steps to reproduce

## Security Measures

### Save Data Integrity
- DJB2 hash with salt detects accidental save corruption
- Note: This is not cryptographic protection — single-player game, client-side only

### Dependency Security
- `npm audit` in CI for vulnerability scanning
- TruffleHog secret scanning in CI pipeline
- No `eval()`, `Function()` constructor, or `innerHTML` usage (enforced by ESLint)

### Data Scope
- All game data stored client-side via `localStorage`
- No server-side data persistence
- No PII collected or transmitted

## Threat Model

Tree Ascension is a client-side only game. The relevant threats are:

- **Save tampering:** Detected by hash check, but not prevented (single-player)
- **XSS via injected content:** Prevented by React's JSX auto-escaping
- **Dependency vulnerabilities:** Monitored via npm audit + Dependabot
- **Secret leakage:** Prevented by TruffleHog + Gitleaks scanning

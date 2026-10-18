# CLAUDE.md

## Build & Test Commands
- **Development:** `npm run dev` or `bun dev`
- **Build:** `npm run build` or `bun build`
- **Test:** `npm run test` or `bun test`
- **Lint & Format:** `npm run lint` / `npm run format`

## Code Style & Architectural Taste
- **Paradigm:** Prefer functional patterns, immutable data structures, and explicit error handling. Avoid deeply nested inheritance.
- **TypeScript:** Strict mode enabled. Never use `any`; use `unknown` or explicit types/generics.
- **Naming:** CamelCase for files and component functions; camelCase for variables/methods. Use descriptive suffixes (e.g., `UserService`, `useAuth`).
- **Dependencies:** Keep external packages lean. Prefer native web APIs over utility libraries when possible.

## Compound Engineering Harness Guidelines
- **Always Consult Memory:** Before starting any plan or task, look for existing lessons in `docs/solutions/` or system instructions here.
- **The 80% Rule:** Spend the majority of time formatting structured markdown specifications in `docs/plans/` before writing any codebase modifications.
- **Execution Hook:** When writing code, execute iteratively. Keep files atomic and highly focused.
- **The Compounding Loop:** Upon completing any non-trivial fix or architecture milestone, trigger the `/ce-compound` utility to codify lessons learned into `docs/solutions/` so future loops don't repeat mistakes.

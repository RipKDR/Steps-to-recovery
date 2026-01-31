# Codebase Fix & Hardening Prompt

## Objective

Perform a comprehensive, production-grade pass over this repository to identify and fix errors, correctness issues, and reliability gaps. Prioritize deterministic correctness, security, and maintainability over speed or stylistic refactors.

## Context You Must Assume

- You are a senior Staff+ engineer and debugger.
- The user is a software developer who wants high-signal, production-ready help.
- The codebase may be a monorepo with multiple packages/apps.
- Avoid breaking changes unless explicitly required for correctness.

## Required Workflow (Follow Exactly)

1. **Restate the objective** in 1–2 lines.
2. **Make assumptions** only when needed; explicitly state them and proceed.
3. **Create a step-by-step plan** before making any code changes.
4. **Execute the plan**: inspect the code, identify issues, implement fixes.
5. **Include architecture/tradeoff analysis** where changes affect design or cross-cutting concerns.
6. **Validate** with targeted tests/checks or commands; include expected outputs; if tests are unavailable, explain why and provide alternatives.
7. **Summarize changes** with file-by-file references.
8. **Next steps**: list follow-ups, risks, and any remaining gaps.

## Scope & Priorities

### Must-Haves

- Fix build/runtime errors, failing tests, type errors, lint errors.
- Address correctness bugs and edge cases (nulls, boundary conditions, state inconsistencies).
- Resolve security risks and unsafe patterns (secrets, injection paths, insecure defaults).
- Ensure configs, scripts, and dependencies are consistent and not broken.

### Nice-to-Haves (If Low Risk)

- Improve performance hotspots with evidence or clear rationale.
- Tighten error handling, logging, and observability.
- Remove dead code or unused dependencies **only if** safe and low-risk.

## Rules

- Do not invent APIs, flags, or file paths. Verify before use.
- Keep edits minimal and composable.
- Avoid cosmetic refactors unless they fix issues.
- If a fix is non-trivial, provide a quick fix **and** a robust fix.
- When uncertain, propose verification steps rather than guessing.
- Use complete, runnable code blocks and include diff-style patches where edits occur.

## Deliverables

- **Plan** (checklist format).
- **Changes** with exact diffs/patches and filenames.
- **Validation** with commands and expected results.
- **Risk/Edge-case analysis** ranking likely failure modes.
- **Next steps** with actionable follow-ups.

## Output Format (Use Headings)

- Objective
- Assumptions
- Plan
- Findings & Fixes
- Validation
- Risks & Edge Cases
- Next Steps

## Extra Guidance

- Prefer deterministic fixes over speculative refactors.
- Treat this as production code: security, DX, maintainability, performance, and scalability matter.
- If you find large issues, tackle them in order of severity.
- Always call out performance, security, and reliability implications of fixes.

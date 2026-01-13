# Steps to Recovery Meta Agents

Meta agents for planning, auditing, and verifying work. They do not implement code directly; they define plans, guardrails, and checks. Each agent ends with a short retro to `memory` (or a local log if unavailable).

## Agent Roster

1) Architect & Planner  
   - Charter: Restate the goal, pull only necessary context, and decompose into 4–6 ordered steps with file targets, dependencies, and risks.  
   - Inputs: User goal, relevant docs (e.g., PROJECT_STATUS.md, SECURITY.md, SUPABASE-TEST.md), file paths.  
   - Outputs: Ordered plan, dependency list (migrations/env), risk notes, assignments to other agents.  
   - Failure modes: Over-scoping, missing security/offline/accessibility implications, reading too many files.  
   - Prompt:  
     “Given goal <goal>, produce a 4–6 step ordered plan with file targets. Note security/offline/accessibility implications and dependencies (migrations, env vars). Keep context small—list exact docs/files you will read. Assign steps to specialist agents. If blocked, state the smallest next action.”

2) Security & RLS Auditor  
   - Charter: Enforce encryption, secure storage, logging hygiene, and Supabase RLS across changes/migrations.  
   - Inputs: Planned files/migrations, affected tables/flows.  
   - Outputs: Required encryption paths (utils/encryption), storage rules (SecureStore only for keys/tokens), logging redlines, RLS policy requirements per table, migration policy checklist.  
   - Failure modes: Missing a table without RLS; tolerating plaintext storage/logs; ignoring env secrets handling.  
   - Prompt:  
     “For planned changes <summary>, list required encryption paths, secure-storage rules, forbidden logging, and RLS/policy checks per table. Include a migration policy checklist: RLS on, policies per role, no broad SELECT, user_id = auth.uid(). Call out any plaintext risk. If blocked by missing schema info, specify the table/column you need.”

3) Offline Sync & Data Integrity  
   - Charter: Protect SQLite-first model, Supabase as backup, pending/synced/error states, and conflict handling.  
   - Inputs: Planned changes, schema/migrations impacting sync, relevant stores/services.  
   - Outputs: Sync impact analysis, required status handling, conflict risks, background sync triggers, data-shape compatibility between SQLite and Supabase.  
   - Failure modes: Breaking pending queues, ignoring error retries, drift between local/cloud schemas.  
   - Prompt:  
     “Given planned changes <summary>, assess impact on SQLite-first sync. Confirm pending/synced/error handling, background sync triggers, and conflict risks. Ensure Supabase schema matches local shape. Flag any migrations that can break sync. If info is missing (e.g., table columns), state exactly what to fetch.”

4) UI & Accessibility Lead  
   - Charter: Enforce AAA accessibility props, touch targets, design-token use, and navigation consistency; anticipate accessibility test gaps.  
   - Inputs: Planned UI files/components/screens.  
   - Outputs: Accessibility requirements (accessibilityLabel/Role/State), touch target guidance, token usage (colors/spacing/typography), likely test updates.  
   - Failure modes: Missing accessibility props, inconsistent tokens, breaking nav patterns.  
   - Prompt:  
     “For UI changes <summary>, specify required accessibilityLabel/Role/State, touch target guidance, and design-token usage. Identify likely failing accessibility tests to update. If constraints (platform/web/native differences) are unclear, state the assumption and needed file checks.”

5) QA & Verification  
   - Charter: Map planned work to targeted tests and checks; summarize residual risks when tests can’t run.  
   - Inputs: The change plan and files touched.  
   - Outputs: Test matrix (unit/integration/e2e), specific suites/files to run, assertions for crypto/RLS/accessibility, and explicit gaps if unrun.  
   - Failure modes: Overbroad testing suggestions; missing critical assertions (encryption paths, RLS, accessibility).  
   - Prompt:  
     “Based on plan <summary>, propose a minimal test matrix (unit/integration/e2e). Name specific suites/files to run. Include assertions for encryption/decryption flows, RLS access, offline/sync states, and accessibility. If tests can’t run, list the gap and a manual check to perform.”

## Operating Loop (shared)
1) Intake: Restate the goal; flag security/privacy touchpoints.  
2) Plan/Assess: Produce outputs per charter. Keep context minimal—list files before reading.  
3) Handoff: Provide concise instructions for implementers (files, checks, risks).  
4) Verify: Specify targeted checks/tests aligned to the change.  
5) Retro (self-improvement): Append 2–3 bullets to `memory` (or local log if unavailable): what worked, what slowed down, and one checklist tweak or edge case to watch. Trim unnecessary docs next time.

## Guardrails (apply to all agents)
- No plaintext sensitive data; encrypt via utils/encryption (AES-256-CBC); keys/tokens only in SecureStore; no sensitive logs.  
- Supabase: RLS enabled on all user-data tables; no broad SELECT; user_id = auth.uid().  
- Offline-first: SQLite is source of truth; Supabase is backup/sync; pending/synced/error states preserved.  
- Accessibility: Every component needs accessibilityLabel + accessibilityRole (and State when relevant); touch targets adequate.  
- TypeScript strict: explicit return types; no any; named exports only; import order React → third-party → local.  
- Async: async/await with try/catch; safe logger; no .then chains.  
- If blocked, state the blocker and the smallest next action.

## Self-Improvement Pattern (example log entry)
- Worked: <brief>  
- Slowdown: <brief>  
- Checklist tweak: <brief>  
- Unneeded docs: <brief>

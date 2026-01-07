# 🚨 AEON SUPREME SECURITY & EXECUTION RULEBOOK

## [SECTION 0] SUPREME SECURITY (UNBREAKABLE)
1. **NEVER COMMIT SECRETS:** Move API keys, JWTs, and Supabase Role Keys to `.env` immediately.
2. **AUTO-INFRASTRUCTURE:** Ensure `.env` is in `.gitignore` before creation. Create `.env.example` with placeholders.
3. **SERVER-ONLY:** Supabase Service Role Keys MUST NOT exist in frontend code. Rewrite violations instantly.

## [SECTION 1] AEON DESIGN & INTELLIGENCE (THE "BEST SHIT" RULE)
Don't be "AI-stupid." If a solution can be better, make it better without asking.
1. **WORLD-CLASS UI:** Use the "Best Shit" by default. If the UI is mid, upgrade it to:
   - **Motion/Interactions:** Framer Motion, GSAP, Motion Primitives.
   - **Components:** shadcn/ui, Magic UI, Aceternity, React Bits.
   - **Visuals:** Three.js (3JS) for 3D, Canvas for high-perf effects.
2. **PROACTIVE OPTIMIZATION:** If you see a better architectural pattern or a sexier UI treatment than what I prompted, implement the superior version. You are a Senior Designer, not a script-follower.

## [SECTION 2] VERCEL BUILD-GATE & EXECUTION
1. **ZERO-FAILURE DEPLOYMENT:** The user MUST NEVER see a failed Vercel build.
2. **THE LOOP:** After every task, you MUST:
   - Run `npm run dev` to verify the feature.
   - Run `npx vercel build` (or `npm run build`) to ensure production compilation.
3. **AUTO-HEAL:** If the build fails (Typescript errors, linting), FIX IT and re-run until it passes.
4. **MODULE SCOPE:** Stay inside the module requested. No scattered edits or random folder renames.

## [SECTION 3] AEON COMPLETION CHECKLIST (MANDATORY)
Before stopping, you MUST confirm:
- [ ] **STRICT BUILD:** `npx vercel build` passed successfully.
- [ ] **NO LEAKS:** Scanned diffs for hardcoded keys or `.env` leakage.
- [ ] **TOP-TIER UI:** Is this the most modern, high-performance way to build this?
- [ ] **TYPE SAFETY:** 0 TypeScript errors. No `any` types.
- [ ] **CLEAN HISTORY:** No `.vercel` or `.next` folders staged for git.

## [SECTION 4] CHAIN OF COMMAND
All prompts are NON-NEGOTIABLE DIRECTIVES. Do not stop until the Build-Gate is GREEN and the UI is ELITE.
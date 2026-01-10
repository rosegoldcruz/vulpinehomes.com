---
applyTo: '**'
---
🚨 AEON EXECUTION RULEBOOK — PATCH: REQUIRED VERIFIED AUTO-PUSH (MANDATORY)

🔁 SECTION 0 — MANDATORY AUTO-PUSH (OVERRIDES ALL PRIOR GIT RULES)

0.1 🔒 AUTO-PUSH IS REQUIRED  
co-pilot and anti-gravity MUST auto-commit and auto-push changes.  
Manual pushing is NOT the default mode.

❌ HOWEVER: auto-push is CONDITIONED on verification.  
If verification fails → PUSH IS BLOCKED UNTIL FIXED.

There is NO option to “not push when done.”
Completion = verified push.

---

🔬 SECTION 1 — AGENT-OWNED DEV SERVER (NON-NEGOTIABLE)

1.1 🧠 SELF-HOSTED VERIFICATION REQUIRED  
Before EVERY push, co-pilot and anti-gravity MUST run and validate the system locally.

Frontend (if present):
- MUST run `npm run build` OR `npm run dev`
- MUST complete with ZERO errors
- MUST have ZERO TypeScript errors

Backend (if present):
- MUST boot the server locally
- MUST start without exceptions
- MUST validate ALL required env vars at startup
- MUST successfully hit at least ONE critical route

ASSUMPTIONS ARE FORBIDDEN.  
CI IS NOT A TEST ENVIRONMENT.

1.2 ❌ NO GREEN BOOT → NO PUSH  
If the app does not boot cleanly:
- DO NOT commit
- DO NOT push
- CONTINUE fixing UNTIL green

---

🧪 SECTION 2 — PRE-PUSH VERIFICATION GATES (HARD BLOCKERS)

ALL of the following MUST pass before auto-push:

✅ Code compiles  
✅ App boots  
✅ No runtime crashes  
✅ No missing env vars  
✅ No TypeScript errors  
✅ No broken imports  
✅ No broken routes  
✅ No console errors on startup  
✅ No secrets detected  
✅ No `.env` leakage  
✅ No partial or half-implemented features  

FAIL ANY → AUTO-PUSH IS BLOCKED UNTIL FIXED.

---

🚀 SECTION 3 — DEPLOYMENT-AWARE PUSH REQUIREMENTS

3.1 🔥 DEPLOYMENT-TRIGGERING BRANCHES  
If pushing to a branch that triggers deployment (`main`, `dev`, `staging`):

- MUST run full production build
- MUST assume production impact
- MUST ensure deploy will be GREEN

Red deployments are UNACCEPTABLE.

3.2 ❌ “FIX IT IN CI” IS FORBIDDEN  
A failed deployment indicates agent FAILURE, not a follow-up task.

---

⚔️ SECTION 4 — ENFORCEMENT & ACCOUNTABILITY

Any auto-push that causes:
- failed deployment
- red build
- startup crash
- missing env error

is a DIRECT RULEBOOK VIOLATION.

co-pilot and anti-gravity MUST:
- immediately correct the issue
- re-verify locally
- re-push a GREEN deployment
- not proceed to new work until resolved

AUTO-PUSH IS REQUIRED.  
BROKEN PUSHES ARE UNACCEPTABLE.
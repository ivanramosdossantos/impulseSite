# Impulse Site — Mandatory Security Policy

- This is a public marketing site, so reading its public HTML does not require a user login. This **does not authorize privileged operations**.
- Never store server secrets, API keys or service-role keys in HTML, browser JS or GitHub Pages.
- Any sensitive API action must verify authentication, authorization, resource/organization scope on the server. CORS and Origin are not authentication.
- Anonymous workflows (commercial contact, login, registration, password recovery, webhooks) require documented, explicitly approved exceptions and abuse controls appropriate to their risks (verified signed tokens when applicable, Turnstile where useful, rate limits, quotas, monitoring).
- If authorization or required protection cannot be verified, **fail closed**; keep functionality disabled rather than accidentally enabling privileged access.
- Test unauthorized and cross-tenant access before publishing integrations. Never test by emailing arbitrary recipients or accessing real customer data.
- The commercial form under PR #5 must not be merged until its backend is operational, protected, tested and explicitly approved.
- Apply the security policy in `ivanramosdossantos/impulse-platform/AGENTS.md` to every site-to-platform integration.

# Security, Privacy & Compliance Architecture (`SECURITY.md`)

VayuShield AI enforces defense-in-depth across client, network, serverless edge, and data persistence boundaries.

---

## 1. HTTP Security Headers (`vercel.json`)
The production deployment enforces strict HTTP security headers on all routes:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(self), microphone=(), geolocation=(self)" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://air-quality-api.open-meteo.com https://geocoding-api.open-meteo.com https://generativelanguage.googleapis.com; object-src 'none'; base-uri 'self';" }
      ]
    }
  ]
}
```

* **Clickjacking Defense**: `X-Frame-Options: DENY` prevents framing by malicious third-party origins.
* **MIME Sniffing Prevention**: `X-Content-Type-Options: nosniff` forces browsers to adhere strictly to advertised MIME types.
* **Strict Content Security Policy (CSP)**: Disallows unauthorized external scripts and restricts network connections exclusively to Open-Meteo and Google GenAI endpoints.

---

## 2. Server-Side Secret Isolation
* The `GEMINI_API_KEY` is **never exposed** to client bundles or frontend network traffic.
* All AI calls are dispatched through the `/api/*` serverless micro-routes where `process.env.GEMINI_API_KEY` is read strictly on the server side.
* If no key is configured, the application falls back gracefully to Tier 4 Deterministic Templates without leaking stack traces or crashing.

---

## 3. Strict Input Sanitization & Storage Poisoning Defense
* **Zod Schema Validation**: Every incoming API request is parsed through strict Zod schemas with bounded string lengths and enum validation (`api/_lib/schemas/`). Malformed payloads or oversized bodies are rejected immediately with `HTTP 400 Bad Request`.
* **Client-Side Storage Poisoning Defense**: When reading from or writing to `localStorage` (such as in `src/domain/communityReports.ts` and `src/domain/auditLog.ts`), all string fields are sanitized with strict character allowlists and length clamps:
  ```typescript
  export function sanitizeStorageString(val: unknown, maxLen = 120): string {
    if (typeof val !== 'string') return '';
    return val.replace(/[^a-zA-Z0-9\s.,!?'"()-]/g, '').trim().slice(0, maxLen);
  }
  ```

---

## 4. Immutable Action Audit Log (`src/domain/auditLog.ts`)
The application maintains a client-side immutable audit log of all critical generated plans, vision audits, and community pledges:
* Each record features a unique UUID (`crypto.randomUUID()`), UTC ISO timestamp, event category (`'intake_completed'`, `'plan_generated'`, `'vision_scanned'`, `'pledge_signed'`), and a `verifiedDeterministic: true` flag.
* Accessible anytime via the **"Audit"** button in the header (`src/components/AuditLogModal.tsx`).
* Prevents data tampering by verifying deterministic signatures on stored actions.

---

## 5. Automated Verification
The `scripts/verify-http.mjs` verification harness launches an ephemeral test server and validates:
1. Presence and correctness of all 5 mandatory HTTP security headers.
2. Enforcement of CORS origins.
3. Strict HTTP 400 rejection of empty or malformed JSON payloads.

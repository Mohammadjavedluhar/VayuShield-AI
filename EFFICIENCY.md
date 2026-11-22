# Computational Efficiency & Network Resilience (`EFFICIENCY.md`)

VayuShield AI has been engineered for extreme performance, minimal bandwidth consumption, and high availability on low-spec mobile devices and slow 3G/4G cellular connections across South Asia.

---

## 1. Bundle Size & Code Splitting
* **Initial Production Bundle**:
  * CSS Bundle: $\sim 67.16\,\text{kB}$ ($10.65\,\text{kB}$ gzipped)
  * JavaScript Bundle: $\sim 467.11\,\text{kB}$ ($132.07\,\text{kB}$ gzipped)
* **Zero Bloat Dependencies**:
  * Uses lightweight Lucide React icon components.
  * No heavy charting libraries; utilizes native SVG and CSS hardware-accelerated animations for dials, timelines, and progress meters.
  * Built using Vite 8 with ESBuild minification, tree-shaking unused icon paths and modules.

---

## 2. In-Memory Prompt Response Caching (Tier 1)
Implemented in [`api/_lib/aiCache.ts`](file:///c:/Users/HP/Downloads/javed%20challange6/api/_lib/aiCache.ts):
* Every incoming prompt is cryptographically hashed using SHA-256 (`crypto.createHash('sha256')`).
* Identical household scenarios or repeat questions are served directly from an in-memory LRU cache in **$< 5\text{ ms}$**, consuming **0 Gemini API tokens** and incurring **0 external network latency**.
* Configured with a sliding 15-minute Time-To-Live (TTL), matching standard atmospheric telemetry refresh rates.

---

## 3. Batched Open-Meteo REST Telemetry
* Atmospheric telemetry (hourly $PM_{2.5}$, $PM_{10}$, $NO_2$, temperature, relative humidity, wind speed) is retrieved via a single batched HTTP request to Open-Meteo European Air Quality Model.
* Synthetic fallback models (`src/services/openMeteoSynthetic.ts`) provide immediate local diurnal profiles if third-party weather APIs fail, guaranteeing that the dashboard never stalls on an empty loading spinner.

---

## 4. Deterministic Tier 4 Instant Fallbacks
When a user is offline, roaming, or when API quotas are exceeded, the **Tier 4 Deterministic Engine** activates instantly:
* Pre-compiled templates for:
  * Incense burning & puja room hazard mitigations
  * Unvented LPG and biomass chulha combustion
  * Single-pane window draft sealing
  * Saturated HEPA/MERV filter life checks
  * Certified Corsi-Rosenthal box fan CADR calculations
* Operates in **$< 1\text{ ms}$** execution time with zero network I/O.

# Accessibility & Senior-Friendly Design (`ACCESSIBILITY.md`)

VayuShield AI is designed to meet **WCAG 2.1 Level AA and AAA** guidelines, ensuring complete usability for senior citizens, low-vision users, and non-English speakers across urban South Asia.

---

## 1. Interactive Senior-Friendly Font Scaler
Elderly family members are the most clinically vulnerable to acute winter smog exacerbations (COPD, stroke, cardiovascular events). To ensure effortless readability:
* An interactive **Text Size Toggle** is integrated directly into the header navigation (`src/components/Navbar.tsx`).
* Supports **100% (Standard)**, **125% (Comfort)**, and **150% (Senior)** root font scaling.
* Implemented via CSS variable scaling (`src/hooks/useTextScale.ts` & `src/index.css`), preserving full layout proportions without text truncation or overflow collisions.
* Preferences are automatically remembered across browser sessions in local storage.

---

## 2. Minimum Touch Targets ($44 \times 44\,\text{px}$)
In compliance with WCAG Success Criterion 2.5.5 (Target Size):
* Every button, tab switch, slider thumb, language selector, and modal close control enforces a minimum target size of **`min-h-[44px] min-w-[44px]`**.
* Generous interactive hit areas ensure easy tapping on mobile touchscreen devices, even for seniors with tremors or reduced motor control.

---

## 3. Dual-Encoding: Icons + Text Labels
In compliance with WCAG Success Criterion 1.4.1 (Use of Color):
* Color is **never** used as the sole conveyor of information.
* Every AQI category, severity indicator, and ventilation recommendation pairs high-contrast background tokens with:
  1. A distinct SVG icon (e.g., 🛡️ for protected, ⚠️ for high severity, 🚨 for critical).
  2. An explicit textual rating label (e.g., `"Hazardous"`, `"Critical"`, `"Tight Certified"`).
* Ensures complete clarity for individuals with red-green deuteranopia or color perception deficiencies.

---

## 4. Dual-Language Localization (English & Hindi)
* Complete bilingual support across all UI controls, tooltips, health advisories, and simulator outputs.
* Instant 1-click language switch (`EN` $\leftrightarrow$ `हिन्दी`) via the navigation bar (`src/i18n/translations.ts`).
* Hindi translations use colloquial, culturally resonant terminology understood by elderly family members (e.g., *"धूप-अगरबत्ती"*, *"चूल्हा"*, *"वायु प्रदूषण"*).

---

## 5. Screen Readers & Keyboard Navigation
* **Skip to Main Content**: Integrated at the very top of `App.tsx` (`<a href="#main-content">Skip to main content</a>`).
* **Semantic ARIA Attributes**:
  * Modals feature `role="dialog"`, `aria-modal="true"`, and explicit `aria-label` closures.
  * Form inputs are strictly associated with unique IDs and `<label htmlFor="...">` elements.
  * Progress bars include `role="status"` and live region notifications.
* **Full Keyboard Operability**: Complete tab navigation with high-visibility cyan focus rings (`focus:ring-2 focus:ring-cyan-500/50`).

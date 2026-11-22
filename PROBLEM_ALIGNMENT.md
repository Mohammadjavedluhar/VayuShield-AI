# Problem Statement Alignment & Scientific Methodology

## 1. Executive Summary & Regional Context
During the winter months (October through February), the Indo-Gangetic Plains (IGP) and South Asian urban centers (Delhi-NCR, Lahore, Patna, Lucknow) suffer from catastrophic air pollution episodes. Ambient particulate concentrations ($PM_{2.5}$) routinely breach $400\text{–}800\,\mu\text{g/m}^3$, exceeding the World Health Organization (WHO) 24-hour guideline of $15\,\mu\text{g/m}^3$ by over 30- to 50-fold.

VayuShield AI addresses the systemic gap between raw atmospheric data and actionable, personalized household protection. Rather than delivering passive, panic-inducing AQI numbers, the platform provides a deterministic clinical and behavioral shielding system.

---

## 2. Atmospheric Physics: Winter Smog & Thermal Inversions
The primary meteorologic driver of severe winter pollution in South Asia is the **nocturnal radiation inversion layer**:
1. **Radiation Cooling**: Overnight surface radiative cooling creates a cold air layer near the ground capped by warmer air aloft.
2. **Boundary Layer Compression**: The planetary boundary layer collapses from $\sim 1500\,\text{m}$ in summer afternoons to $< 100\text{–}200\,\text{m}$ in winter early mornings (06:00–09:00).
3. **Trapped Particulate Inhalation**: Ground-level vehicular emissions, municipal waste burning, and agricultural stubble drift are mechanically trapped in this shallow breathing zone.

### Implementation & Source Code Mapping
* **Inversion Modeling**: [`src/domain/commute/inversionModel.ts`](file:///c:/Users/HP/Downloads/javed%20challange6/src/domain/commute/inversionModel.ts) computes hour-by-hour inversion intensity penalties based on solar angles and diurnal boundary layer mixing.
* **School & Elderly Departure Delay**: [`src/domain/commuteGuard.ts`](file:///c:/Users/HP/Downloads/javed%20challange6/src/domain/commuteGuard.ts) recommends shifting school bus transit and morning senior walks past 09:00 AM when solar thermal convection disperses the surface inversion layer.

---

## 3. Low-Emission Daily Routines & Shift in Exercise Windows
Strenuous outdoor exercise during morning peak inversions multiplies minute ventilation ($\dot{V}_E$) from $6\,\text{L/min}$ (at rest) to $60\text{–}100\,\text{L/min}$, delivering an acute, hazardous particulate dose directly to the pulmonary alveoli.

* **Diurnal Window Optimization**: [`src/domain/cleanHours/diurnalGenerator.ts`](file:///c:/Users/HP/Downloads/javed%20challange6/src/domain/cleanHours/diurnalGenerator.ts) continuously identifies the safest 2- to 3-hour daily exercise and natural ventilation window (typically 12:30 PM to 03:30 PM) when atmospheric mixing is at its peak.
* **Routine Action Checklists**: [`src/domain/cleanHours/actionChecklist.ts`](file:///c:/Users/HP/Downloads/javed%20challange6/src/domain/cleanHours/actionChecklist.ts) provides time-gated behavioral recommendations (e.g., wet-mopping rather than dry-sweeping to prevent particulate resuspension).

---

## 4. DIY Indoor Air Quality (IAQ) & Corsi-Rosenthal Box Sizing
Commercial HEPA air purifiers cost between ₹14,000 and ₹35,000 with replacement filters costing ₹3,000–₹5,000, placing clean indoor air out of reach for middle- and lower-income families.

* **Corsi-Rosenthal Box Engine**: [`src/domain/impact/crSizingCalculator.ts`](file:///c:/Users/HP/Downloads/javed%20challange6/src/domain/impact/crSizingCalculator.ts) implements the peer-reviewed Corsi-Rosenthal (CR) box sizing formula using room volume ($V = L \times W \times H$) and target air changes per hour ($\text{ACH} \ge 5.0$).
* **CADR & Clearance Time**:
  $$\text{Required CADR (CFM)} = \frac{V \times \text{ACH}}{60}$$
  $$\text{Time to 90\% Clearance (min)} = \frac{\ln(10) \times V}{\text{Effective CADR} \times 60}$$
* **Economic Democratization**: Demonstrates how a DIY 20-inch box fan unit fitted with MERV-13 filters delivers $> 280\,\text{CFM}$ CADR for $< \text{₹}2,400$, achieving an 84% cost savings over commercial units.

---

## 5. Location & Household Personalization
VayuShield AI explicitly factors in household clinical vulnerabilities and socioeconomic realities:
* **Vulnerability Scoring**: [`src/domain/impact/vulnerabilityCalculator.ts`](file:///c:/Users/HP/Downloads/javed%20challange6/src/domain/impact/vulnerabilityCalculator.ts) stratifies family risk based on:
  * Clinical respiratory conditions: Asthma (+35 pts), COPD/cardiac history (+40 pts)
  * Vulnerable demographics: School-age children (+20 pts), elderly dependents (+20 pts)
  * Household exposure vectors: Unvented biomass/LPG stoves, lack of air scrubbers
* **Natural Language Intake Extraction**: [`api/intake.ts`](file:///c:/Users/HP/Downloads/javed%20challange6/api/intake.ts) uses Gemini 2.5 to translate unformatted user statements into clinical risk profiles without requiring complex dropdown forms.

---

## 6. Quantified Scientific Impact Metrics
All calculations in VayuShield AI are grounded in validated environmental epidemiology formulas:
1. **US EPA Particulate Inhalation Dose**:
   $$\text{Daily Dose } (\mu\text{g}) = \sum (C_i \times \dot{V}_i \times T_i)$$
   Implemented in [`src/domain/impact/doseCalculator.ts`](file:///c:/Users/HP/Downloads/javed%20challange6/src/domain/impact/doseCalculator.ts).
2. **Berkeley Earth Cigarette Equivalence**:
   $$1 \text{ Cigarette / day} \approx 22\,\mu\text{g/m}^3 \text{ } PM_{2.5} \text{ over 24 hours}$$
   Implemented in [`src/domain/impact/savingsCalculator.ts`](file:///c:/Users/HP/Downloads/javed%20challange6/src/domain/impact/savingsCalculator.ts).
3. **Transport & Energy Emission Factors**:
   Computes weekly $\text{CO}_2$ reductions from transit shifts (solo car $0.17\,\text{kg/km}$ vs. electric metro $0.035\,\text{kg/km}$) and induction cooking swaps ($1.5\,\text{kg CO}_2/\text{day}$ saved).

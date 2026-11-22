# VayuShield AI - API Documentation & Specifications

All serverless functions are deployed under the `/api/*` prefix on Vercel. Every endpoint enforces CORS restrictions, in-memory rate limiting, and strict input validation via Zod schemas, returning `HTTP 400 Bad Request` upon malformed requests.

---

## 1. POST `/api/intake`
Parses unstructured natural language descriptions of a household and extracts clinical sensitivities, commute modes, and vulnerability scores.

### Request Headers
```http
POST /api/intake HTTP/1.1
Content-Type: application/json
Origin: https://vayu-shield-ai-jifj.vercel.app
```

### Request Body Schema
```typescript
{
  text: string;      // Household description (min 3 chars, max 1000 chars)
  city?: string;    // City name (default: "Delhi")
}
```

### Response Schema (`HTTP 200 OK`)
```json
{
  "profile": {
    "householdSize": 4,
    "city": "Delhi",
    "hasAsthma": true,
    "hasCopdOrCardiac": false,
    "hasChildren": true,
    "hasElderly": true,
    "isPregnant": false,
    "commuteMode": "car",
    "commuteDistanceKm": 12,
    "cookingFuel": "lpg",
    "heatingSource": "none",
    "hasAirPurifier": false,
    "wearsMaskOutdoors": false,
    "vulnerabilityScore": 85,
    "vulnerabilityLevel": "critical",
    "rawInput": "Family of 4 in Delhi with an elderly asthma patient and 2 school kids, commuting by car"
  },
  "tier": "tier2_flash"
}
```

---

## 2. POST `/api/plan`
Generates a personalized 24-hour diurnal protection timeline and routine action checklist.

### Request Body Schema
```typescript
{
  profile: HouseholdProfile;
  airQuality: AirQualityData;
  interventions: Interventions;
}
```

### Response Schema (`HTTP 200 OK`)
```json
{
  "impactMetrics": {
    "baselineInhaledPm25DoseUgPerDay": 2650,
    "protectedInhaledPm25DoseUgPerDay": 420,
    "inhaledPm25ReductionPct": 84,
    "avoidedCigarettesPerWeek": 38,
    "co2SavedKgPerWeek": 18.5,
    "cleanAirHoursGainedPerDay": 6.5,
    "riskReductionScore": 88
  },
  "windows": [
    {
      "type": "exercise",
      "title": "Solar Convection Exercise Window",
      "startHour": 13,
      "endHour": 15,
      "avgAqi": 165,
      "status": "safe",
      "advice": "Boundary layer mixed by solar heating. Safest outdoor window."
    }
  ],
  "actionChecklist": [
    {
      "id": "act-1",
      "task": "Mandate headband N95 respirators for school/work transit",
      "category": "immediate",
      "urgency": "high",
      "rationale": "Avoids peak 8:00 AM particulate concentration."
    }
  ],
  "aiExplanation": "Certified EPA exposure model verified 84% particulate reduction.",
  "tier": "tier2_flash"
}
```

---

## 3. POST `/api/vision-audit`
Performs multimodal computer vision inspection of an indoor room photo, respirator fit, or filter loading condition.

### Request Body Schema
```typescript
{
  imageBase64: string;   // Base64-encoded image string
  mimeType: string;      // "image/jpeg" | "image/png" | "image/webp" | "image/svg+xml"
  roomContext?: string;  // Optional contextual hints (e.g., "kitchen with gas stove")
}
```

### Response Schema (`HTTP 200 OK`)
```json
{
  "audit": {
    "roomType": "Living Room with Puja Corner",
    "estimatedIndoorPm25": 142,
    "overallVentilationRating": "poor",
    "hazardsIdentified": [
      {
        "hazard": "Solid Incense Stick Combustion",
        "severity": "critical",
        "description": "Continuous smoldering particulate release in unventilated space",
        "estimatedPm25ContributionUg": 85
      }
    ],
    "diyFixes": [
      {
        "title": "Shift Incense to Vented Courtyard",
        "costTier": "free",
        "action": "Cease smoldering sticks in closed bedroom spaces",
        "expectedPm25DropPct": 45
      }
    ],
    "crBoxSizing": {
      "roomAreaSqFt": 220,
      "ceilingHeightFt": 9.5,
      "roomVolumeCuFt": 2090,
      "targetAch": 5.0,
      "requiredCadrCfm": 174,
      "recommendedUnits": 1,
      "timeTo90PctClearanceMinutes": 28,
      "diyCostEstimateInr": 2350,
      "commercialHepaCostInr": 14500,
      "savingsPct": 84
    },
    "plantsRecommended": [
      {
        "name": "Areca Palm (Chrysalidocarpus lutescens)",
        "targetPollutant": "CO2 & Volatile Hydrocarbons",
        "careLevel": "easy",
        "airBenefit": "High daytime transpiration rate reduces static particulate settling."
      }
    ],
    "summary": "High risk of continuous indoor exposure from puja combustion."
  },
  "tier": "tier2_flash"
}
```

---

## 4. POST `/api/ask`
Conversational clinical reasoning grounded in pre-certified domain indices.

### Request Body Schema
```typescript
{
  question: string;
  context: {
    city: string;
    aqi: number;
    pm25: number;
    profile: HouseholdProfile;
    ledger?: ImpactLedgerMetrics;
  }
}
```

### Response Schema (`HTTP 200 OK`)
```json
{
  "answer": "Given your family's profile with an elderly asthma patient, outdoor walking between 7:00 AM and 9:00 AM is strictly contraindicated. The ground-level thermal inversion layer traps PM2.5 above 300 µg/m³...",
  "recommendations": [
    "Reschedule walking workouts to 1:00 PM – 3:30 PM",
    "Ensure N95 mask has dual headbands rather than ear loops for airtight seal"
  ],
  "isGrounded": true,
  "tier": "tier2_flash"
}
```

---

## 5. HTTP Error Handling & Status Codes
| HTTP Status | Error Description | Trigger Condition |
| :--- | :--- | :--- |
| `200 OK` | Success | Valid request processed successfully across Tier 1, 2, 3, or 4. |
| `400 Bad Request` | Validation Error | Missing required fields, invalid JSON, or non-compliant Zod types. |
| `405 Method Not Allowed`| Verb Violation | Triggered on `GET`, `PUT`, or `DELETE` requests to POST-only API routes. |
| `429 Too Many Requests`| Rate Limit Exceeded | Client exceeds 60 requests/minute per IP address. |
| `500 Server Error` | Unhandled Error | Caught by top-level error boundaries with safe JSON fallbacks. |

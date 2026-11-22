export interface SamplePhoto {
  id: string;
  name: string;
  description: string;
  context: string;
  svgPreview: string;
}

export const SAMPLE_PHOTOS: SamplePhoto[] = [
  {
    id: 'incense',
    name: '🪔 Living Room with Incense / Dhoop',
    description: 'Puja corner with burning incense sticks, closed room, and heavy rugs.',
    context: 'Living room puja altar with solid incense burning and sealed windows.',
    svgPreview:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" fill="%232b2118"/><rect x="40" y="80" width="320" height="150" fill="%233e3124" rx="10"/><circle cx="200" cy="110" r="30" fill="%23eab308" opacity="0.3"/><rect x="195" y="125" width="10" height="50" fill="%23d97706"/><path d="M198 120 Q180 80 200 40 T220 20" stroke="%23cbd5e1" stroke-width="4" fill="none" opacity="0.7"/><text x="200" y="240" fill="%23fbbf24" font-family="sans-serif" font-size="14" text-anchor="middle">Incense Altar &amp; Closed Room</text></svg>',
  },
  {
    id: 'kitchen',
    name: '🍳 Kitchen with Unvented Gas Stove',
    description: 'LPG combustion burner, active spice frying, and no active exhaust hood.',
    context: 'Kitchen cooking station with unvented gas burner and frying oil splatter.',
    svgPreview:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" fill="%231e293b"/><rect x="60" y="130" width="280" height="100" fill="%23334155" rx="8"/><circle cx="150" cy="130" r="35" fill="%230ea5e9" opacity="0.4"/><circle cx="250" cy="130" r="35" fill="%230ea5e9" opacity="0.4"/><ellipse cx="150" cy="110" rx="30" ry="8" fill="%23f97316"/><path d="M150 90 Q160 50 140 20" stroke="%23e2e8f0" stroke-width="3" fill="none" opacity="0.6"/><text x="200" y="245" fill="%2338bdf8" font-family="sans-serif" font-size="14" text-anchor="middle">Unvented Gas Stove &amp; Cooking Fumes</text></svg>',
  },
  {
    id: 'window',
    name: '🪟 Drafty Window Facing Road Smog',
    description: 'Single-pane glass with visible perimeter gap drafts and black road dust.',
    context: 'Bedroom window facing arterial road with unsealed sash and morning smog infiltration.',
    svgPreview:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" fill="%23475569"/><rect x="80" y="30" width="240" height="180" fill="%2364748b" stroke="%23cbd5e1" stroke-width="8" rx="4"/><line x1="200" y1="30" x2="200" y2="210" stroke="%23cbd5e1" stroke-width="6"/><line x1="80" y1="120" x2="320" y2="120" stroke="%23cbd5e1" stroke-width="6"/><rect x="84" y="34" width="232" height="172" fill="%2394a3b8" opacity="0.4"/><text x="200" y="240" fill="%23f1f5f9" font-family="sans-serif" font-size="14" text-anchor="middle">Single-Pane Window Draft Leaks</text></svg>',
  },
  {
    id: 'balcony',
    name: '🌫️ Balcony View of Heavy Winter Smog',
    description: 'Dense winter thermal inversion obscuring buildings 50 meters away.',
    context: 'Apartment balcony looking onto heavy grey smog with severe inversion layer.',
    svgPreview:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" fill="%236b7280"/><rect x="0" y="160" width="400" height="100" fill="%23374151"/><rect x="50" y="90" width="60" height="120" fill="%234b5563" opacity="0.5"/><rect x="160" y="60" width="80" height="150" fill="%234b5563" opacity="0.3"/><rect x="280" y="110" width="70" height="100" fill="%234b5563" opacity="0.4"/><text x="200" y="240" fill="%23f3f4f6" font-family="sans-serif" font-size="14" text-anchor="middle">Dense Ambient Winter Smog View</text></svg>',
  },
  {
    id: 'mask_fit',
    name: '😷 N95 Mask Fit & Nose Seal Check',
    description: 'Respirator facial seal check, nose clip contouring, and perimeter gap detection.',
    context: 'N95 respirator mask fit inspection with unpinched nose bridge and cheek leakage',
    svgPreview:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" fill="%230f172a"/><path d="M140 100 Q200 60 260 100 Q280 180 200 210 Q120 180 140 100 Z" fill="%23f8fafc" stroke="%2338bdf8" stroke-width="4"/><line x1="170" y1="90" x2="230" y2="90" stroke="%2394a3b8" stroke-width="6"/><path d="M140 110 Q90 120 130 170" stroke="%23cbd5e1" stroke-width="3" fill="none"/><path d="M260 110 Q310 120 270 170" stroke="%23cbd5e1" stroke-width="3" fill="none"/><text x="200" y="245" fill="%2338bdf8" font-family="sans-serif" font-size="14" text-anchor="middle">N95 Mask Fit &amp; Leakage Check</text></svg>',
  },
  {
    id: 'filter_saturated',
    name: '🌪️ Saturated HEPA / MERV Filter',
    description: 'Examine filter pleats for gray/black particulate loading and CADR airflow drop.',
    context: 'air cleaner filter replacement check with dark dust loading and saturated pleats',
    svgPreview:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" fill="%231e293b"/><rect x="60" y="40" width="280" height="160" fill="%23334155" stroke="%2394a3b8" stroke-width="4"/><line x1="100" y1="40" x2="100" y2="200" stroke="%23475569" stroke-width="8"/><line x1="140" y1="40" x2="140" y2="200" stroke="%23334155" stroke-width="8"/><line x1="180" y1="40" x2="180" y2="200" stroke="%231e293b" stroke-width="8"/><line x1="220" y1="40" x2="220" y2="200" stroke="%230f172a" stroke-width="8"/><line x1="260" y1="40" x2="260" y2="200" stroke="%231e293b" stroke-width="8"/><line x1="300" y1="40" x2="300" y2="200" stroke="%23475569" stroke-width="8"/><text x="200" y="240" fill="%23f87171" font-family="sans-serif" font-size="14" text-anchor="middle">Saturated Dark Gray HEPA Pleats</text></svg>',
  },
];

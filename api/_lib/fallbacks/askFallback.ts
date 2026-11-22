/**
 * VayuShield AI - Fallback Conversational Response Engine
 * Provides clinically grounded rule-based responses to user questions.
 */

/**
 * Generates deterministic fallback responses to air quality and health inquiries.
 * @param question - User's health or clean-air question
 * @param context - Ambient air and household context
 * @returns Grounded response object with answer string
 */
export function fallbackAsk(
  question: string,
  context?: { city?: string; aqi?: number; pm25?: number; profile?: unknown; ledger?: unknown }
): { answer: string; isGrounded: boolean } {
  const q = question.toLowerCase();
  const aqi = context?.aqi || 280;
  const pm25 = context?.pm25 || 150;
  const city = context?.city || 'Delhi';

  if (q.includes('exercise') || q.includes('run') || q.includes('jog') || q.includes('walk')) {
    return {
      answer: `In ${city} with current AQI around ${aqi} (PM2.5: ${pm25} µg/m³), outdoor morning exercise (6 AM – 9 AM) is strongly discouraged due to thermal winter inversion trapping cold smog at ground level. The safest window for light activity is between 1:00 PM and 4:00 PM when solar heating disperses the boundary layer. Otherwise, substitute with indoor yoga or cardio in an air-filtered room.`,
      isGrounded: true,
    };
  }

  if (q.includes('corsi') || q.includes('cr box') || q.includes('diy') || q.includes('purifier')) {
    return {
      answer: `A Corsi-Rosenthal Box is an open-source, scientifically validated DIY air cleaner built using a 20-inch box fan and four MERV-13 furnace filters taped into a cube with a cardboard shroud. It provides approximately 350–400 CFM of clean air (Clean Air Delivery Rate) for ~₹2,800 INR, delivering equivalent particulate clearance to commercial HEPA units costing ₹14,000+ INR.`,
      isGrounded: true,
    };
  }

  if (q.includes('mask') || q.includes('n95') || q.includes('cloth')) {
    return {
      answer: `Cloth masks and simple surgical masks provide only 15% to 30% filtration against PM2.5 fine particles because microscopic aerosol passes through gaps and weave pores. Certified N95 or FFP2 respirators filter ≥95% of fine particulate matter down to 0.3 microns when fitted tightly with no nose-bridge leaks.`,
      isGrounded: true,
    };
  }

  if (q.includes('cigarette') || q.includes('berkeley')) {
    return {
      answer: `According to the landmark Berkeley Earth formula by Dr. Richard Muller, breathing 22 µg/m³ of PM2.5 over 24 hours delivers health damage equivalent to smoking approximately 1 cigarette. At ${pm25} µg/m³, breathing unfiltered ambient air for 24 hours is roughly equivalent to ${(pm25 / 22).toFixed(1)} cigarettes per day. Active filtration cuts this exposure drastically.`,
      isGrounded: true,
    };
  }

  return {
    answer: `Current air conditions in ${city} report an AQI of ${aqi} with PM2.5 at ${pm25} µg/m³. Medical consensus recommends keeping windows sealed during early morning and late night smog peaks, running indoor MERV-13 or HEPA filtration, using certified N95 respirators for all outdoor travel, and avoiding indoor incense or unvented combustion.`,
    isGrounded: true,
  };
}

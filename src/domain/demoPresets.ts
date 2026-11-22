export interface DemoPreset {
  id: string;
  badge: string;
  title: string;
  city: string;
  lat: number;
  lon: number;
  aqi: number;
  pm25: number;
  householdSize: number;
  hasAsthma: boolean;
  hasChildren: boolean;
  hasElderly: boolean;
  commuteMode: 'car' | 'twoWheeler' | 'metro';
  cookingFuel: 'lpg' | 'induction' | 'biomassChulha';
  useN95: boolean;
  usePurifier: boolean;
  description: string;
}

export const JUDGE_PRESETS: DemoPreset[] = [
  {
    id: 'delhi_severe',
    badge: 'Scenario A (Critical Smog)',
    title: 'Severe Delhi Winter Inversion (AQI 420)',
    city: 'Delhi',
    lat: 28.6139,
    lon: 77.209,
    aqi: 420,
    pm25: 310,
    householdSize: 5,
    hasAsthma: true,
    hasChildren: true,
    hasElderly: true,
    commuteMode: 'twoWheeler',
    cookingFuel: 'lpg',
    useN95: true,
    usePurifier: true,
    description: 'Joint family with asthmatic child and elderly parent facing acute thermal inversion smog in Anand Vihar.',
  },
  {
    id: 'jaipur_moderate',
    badge: 'Scenario B (No Purifier)',
    title: 'Moderate Jaipur Morning Haze (AQI 165)',
    city: 'Jaipur',
    lat: 26.9124,
    lon: 75.7873,
    aqi: 165,
    pm25: 85,
    householdSize: 3,
    hasAsthma: false,
    hasChildren: true,
    hasElderly: false,
    commuteMode: 'car',
    cookingFuel: 'lpg',
    useN95: false,
    usePurifier: false,
    description: 'Young middle-class family without air purifier seeking low-cost DIY Corsi-Rosenthal protection.',
  },
  {
    id: 'society_drive',
    badge: 'Scenario C (Community Drive)',
    title: 'Community Society Drive – 25 Families',
    city: 'Lucknow',
    lat: 26.8467,
    lon: 80.9462,
    aqi: 290,
    pm25: 180,
    householdSize: 4,
    hasAsthma: true,
    hasChildren: true,
    hasElderly: true,
    commuteMode: 'metro',
    cookingFuel: 'induction',
    useN95: true,
    usePurifier: true,
    description: 'Residential welfare association pooling collective pledges to eradicate waste burning and carpool.',
  },
];

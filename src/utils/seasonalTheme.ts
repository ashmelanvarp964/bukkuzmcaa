export type SeasonId = 'winter';
export type SeasonMode = 'winter';

export interface SeasonTheme {
  id: SeasonId;
  name: string;
  seasonLabel: string;
  icon: string;
  tagline: string;
  monthsDescription: string;
  // Primary CSS variables
  colors: {
    accent: string;
    accentHover: string;
    accentLight: string;
    accentDark: string;
    glow: string;
    borderGlow: string;
    badgeBg: string;
    badgeBorder: string;
  };
  // Tailwind class strings
  classes: {
    textAccent: string;
    textAccentLight: string;
    bgAccent: string;
    bgAccentHover: string;
    borderAccent: string;
    glowShadow: string;
    gradientHeading: string;
    heroAtmosphere: string;
    kickerColor: string;
    pillBg: string;
  };
  // Three.js 3D Canvas Palette
  canvas: {
    fogColor: number;
    sunColor: number;
    ambientColor: number;
    rimColor: number;
    grassColor: number;
    leavesColor: number;
    portalColor: number;
    particleColor: number;
    particleColors: number[];
    particleType: 'snow';
    particleLabel: string;
    deepslateColor: number;
  };
}

export const SEASONS: Record<SeasonId, SeasonTheme> = {
  winter: {
    id: 'winter',
    name: 'Winter',
    seasonLabel: 'Frost & Snow',
    icon: '❄️',
    tagline: 'Snowy tundra & glacial peaks',
    monthsDescription: 'Permanent Winter Edition',
    colors: {
      accent: '#38bdf8', // sky-400
      accentHover: '#0284c7', // sky-600
      accentLight: '#bae6fd',
      accentDark: '#0369a1',
      glow: 'rgba(56, 189, 248, 0.35)',
      borderGlow: 'rgba(56, 189, 248, 0.4)',
      badgeBg: 'rgba(56, 189, 248, 0.15)',
      badgeBorder: 'rgba(56, 189, 248, 0.3)',
    },
    classes: {
      textAccent: 'text-sky-400',
      textAccentLight: 'text-sky-300',
      bgAccent: 'bg-sky-400',
      bgAccentHover: 'hover:bg-sky-300',
      borderAccent: 'border-sky-500/40',
      glowShadow: 'shadow-sky-500/25',
      gradientHeading: 'from-sky-300 via-cyan-200 to-blue-400',
      heroAtmosphere: 'from-[#080F18]/90 via-[#0A1624]/60 to-[#080B0D]',
      kickerColor: 'text-sky-300',
      pillBg: 'bg-sky-500/10',
    },
    canvas: {
      fogColor: 0x07111a,
      sunColor: 0xa5f3fc,
      ambientColor: 0x1e3a5f,
      rimColor: 0x38bdf8,
      grassColor: 0xf1f5f9, // Pure Snow layer
      leavesColor: 0x94a3b8, // Frosted Pine
      portalColor: 0x38bdf8,
      particleColor: 0xffffff,
      particleColors: [0xffffff, 0xf8fafc, 0xe0f2fe, 0xbae6fd, 0xdbeafe],
      particleType: 'snow',
      particleLabel: 'Falling Snow & Frost',
      deepslateColor: 0x182028,
    },
  },
};

/**
 * Returns the permanent Winter theme for BukkuzMC.
 */
export function getSeasonForMonth(): SeasonId {
  return 'winter';
}

export function getMonthName(date = new Date()): string {
  return date.toLocaleString('default', { month: 'short' });
}

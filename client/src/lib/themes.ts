// Theme type definitions and preset themes

export interface ThemeColors {
  // Base colors
  background: string;
  foreground: string;
  border: string;
  input: string;
  ring: string;

  // Card
  card: string;
  cardForeground: string;

  // Primary
  primary: string;
  primaryForeground: string;
  primaryBorder: string;

  // Secondary
  secondary: string;
  secondaryForeground: string;

  // Destructive
  destructive: string;
  destructiveForeground: string;

  // Muted
  muted: string;
  mutedForeground: string;

  // Accent
  accent: string;
  accentForeground: string;

  // Popover
  popover: string;
  popoverForeground: string;

  // Sidebar
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;

  // Chart colors
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;

  // Mood colors
  moodTerrible: string;
  moodBad: string;
  moodOkay: string;
  moodGood: string;
  moodGreat: string;

  // Streak and duration
  streak: string;
  duration: string;

  // Interactive overlays
  elevate1: string;
  elevate2: string;
  buttonOutline: string;
}

export interface Theme {
  name: string;
  label: string;
  description: string;
  mode: 'dark' | 'light';
  colors: ThemeColors;
}

// Purple - Ambient starry night theme (Default)
export const cosmicPurpleTheme: Theme = {
  name: 'cosmic',
  label: 'Purple',
  description: 'Ambient purple starry night aesthetic',
  mode: 'dark',
  colors: {
    background: '270 50% 8%',
    foreground: '270 20% 98%',
    border: '270 30% 20%',
    input: '270 30% 20%',
    ring: '270 80% 70%',

    card: '270 40% 12%',
    cardForeground: '270 20% 98%',

    primary: '270 80% 70%',
    primaryForeground: '270 50% 5%',
    primaryBorder: '270 80% 80%',

    secondary: '270 30% 20%',
    secondaryForeground: '270 20% 98%',

    destructive: '0 72% 45%',
    destructiveForeground: '270 20% 98%',

    muted: '270 30% 20%',
    mutedForeground: '270 20% 70%',

    accent: '280 75% 65%',
    accentForeground: '270 20% 98%',

    popover: '270 45% 10%',
    popoverForeground: '270 20% 98%',

    sidebar: '270 55% 6%',
    sidebarForeground: '270 20% 95%',
    sidebarPrimary: '270 80% 70%',
    sidebarPrimaryForeground: '270 50% 5%',
    sidebarAccent: '270 30% 20%',
    sidebarAccentForeground: '270 20% 95%',
    sidebarBorder: '270 30% 18%',
    sidebarRing: '270 80% 70%',

    chart1: '270 80% 70%',
    chart2: '280 75% 65%',
    chart3: '260 70% 68%',
    chart4: '290 70% 70%',
    chart5: '250 75% 72%',

    moodTerrible: '0 73% 51%',
    moodBad: '25 95% 53%',
    moodOkay: '47 96% 53%',
    moodGood: '160 70% 50%',
    moodGreat: '270 80% 70%',

    streak: '270 80% 70%',
    duration: '280 75% 65%',

    elevate1: '270 80% 90% / 0.06',
    elevate2: '270 80% 90% / 0.12',
    buttonOutline: '270 80% 70% / 0.25',
  }
};

// Green - Emerald starry night theme
export const cosmicGreenTheme: Theme = {
  name: 'cosmic-green',
  label: 'Green',
  description: 'Mystical emerald starry night aesthetic',
  mode: 'dark',
  colors: {
    background: '150 50% 8%',
    foreground: '150 20% 98%',
    border: '150 30% 20%',
    input: '150 30% 20%',
    ring: '150 80% 60%',

    card: '150 40% 12%',
    cardForeground: '150 20% 98%',

    primary: '150 80% 60%',
    primaryForeground: '150 50% 5%',
    primaryBorder: '150 80% 70%',

    secondary: '150 30% 20%',
    secondaryForeground: '150 20% 98%',

    destructive: '0 72% 45%',
    destructiveForeground: '150 20% 98%',

    muted: '150 30% 20%',
    mutedForeground: '150 20% 70%',

    accent: '160 75% 55%',
    accentForeground: '150 20% 98%',

    popover: '150 45% 10%',
    popoverForeground: '150 20% 98%',

    sidebar: '150 55% 6%',
    sidebarForeground: '150 20% 95%',
    sidebarPrimary: '150 80% 60%',
    sidebarPrimaryForeground: '150 50% 5%',
    sidebarAccent: '150 30% 20%',
    sidebarAccentForeground: '150 20% 95%',
    sidebarBorder: '150 30% 18%',
    sidebarRing: '150 80% 60%',

    chart1: '150 80% 60%',
    chart2: '160 75% 55%',
    chart3: '140 70% 58%',
    chart4: '170 70% 60%',
    chart5: '130 75% 62%',

    moodTerrible: '0 73% 51%',
    moodBad: '25 95% 53%',
    moodOkay: '47 96% 53%',
    moodGood: '150 80% 55%',
    moodGreat: '160 85% 60%',

    streak: '150 80% 60%',
    duration: '160 75% 55%',

    elevate1: '150 80% 90% / 0.06',
    elevate2: '150 80% 90% / 0.12',
    buttonOutline: '150 80% 60% / 0.25',
  }
};

// Yellow - Golden starry night theme
export const cosmicYellowTheme: Theme = {
  name: 'cosmic-yellow',
  label: 'Yellow',
  description: 'Radiant golden starry night aesthetic',
  mode: 'dark',
  colors: {
    background: '45 50% 8%',
    foreground: '45 20% 98%',
    border: '45 30% 20%',
    input: '45 30% 20%',
    ring: '45 90% 65%',

    card: '45 40% 12%',
    cardForeground: '45 20% 98%',

    primary: '45 90% 65%',
    primaryForeground: '45 50% 5%',
    primaryBorder: '45 90% 75%',

    secondary: '45 30% 20%',
    secondaryForeground: '45 20% 98%',

    destructive: '0 72% 45%',
    destructiveForeground: '45 20% 98%',

    muted: '45 30% 20%',
    mutedForeground: '45 20% 70%',

    accent: '50 85% 60%',
    accentForeground: '45 20% 98%',

    popover: '45 45% 10%',
    popoverForeground: '45 20% 98%',

    sidebar: '45 55% 6%',
    sidebarForeground: '45 20% 95%',
    sidebarPrimary: '45 90% 65%',
    sidebarPrimaryForeground: '45 50% 5%',
    sidebarAccent: '45 30% 20%',
    sidebarAccentForeground: '45 20% 95%',
    sidebarBorder: '45 30% 18%',
    sidebarRing: '45 90% 65%',

    chart1: '45 90% 65%',
    chart2: '50 85% 60%',
    chart3: '40 80% 63%',
    chart4: '55 85% 65%',
    chart5: '35 80% 68%',

    moodTerrible: '0 73% 51%',
    moodBad: '25 95% 53%',
    moodOkay: '47 96% 53%',
    moodGood: '150 70% 50%',
    moodGreat: '45 90% 65%',

    streak: '45 90% 65%',
    duration: '50 85% 60%',

    elevate1: '45 90% 90% / 0.06',
    elevate2: '45 90% 90% / 0.12',
    buttonOutline: '45 90% 65% / 0.25',
  }
};

// Red - Crimson starry night theme
export const cosmicRedTheme: Theme = {
  name: 'cosmic-red',
  label: 'Red',
  description: 'Passionate crimson starry night aesthetic',
  mode: 'dark',
  colors: {
    background: '0 50% 8%',
    foreground: '0 20% 98%',
    border: '0 30% 20%',
    input: '0 30% 20%',
    ring: '0 80% 65%',

    card: '0 40% 12%',
    cardForeground: '0 20% 98%',

    primary: '0 80% 65%',
    primaryForeground: '0 50% 5%',
    primaryBorder: '0 80% 75%',

    secondary: '0 30% 20%',
    secondaryForeground: '0 20% 98%',

    destructive: '0 72% 45%',
    destructiveForeground: '0 20% 98%',

    muted: '0 30% 20%',
    mutedForeground: '0 20% 70%',

    accent: '350 75% 60%',
    accentForeground: '0 20% 98%',

    popover: '0 45% 10%',
    popoverForeground: '0 20% 98%',

    sidebar: '0 55% 6%',
    sidebarForeground: '0 20% 95%',
    sidebarPrimary: '0 80% 65%',
    sidebarPrimaryForeground: '0 50% 5%',
    sidebarAccent: '0 30% 20%',
    sidebarAccentForeground: '0 20% 95%',
    sidebarBorder: '0 30% 18%',
    sidebarRing: '0 80% 65%',

    chart1: '0 80% 65%',
    chart2: '350 75% 60%',
    chart3: '10 75% 63%',
    chart4: '340 75% 65%',
    chart5: '20 70% 68%',

    moodTerrible: '0 73% 51%',
    moodBad: '25 95% 53%',
    moodOkay: '47 96% 53%',
    moodGood: '150 70% 50%',
    moodGreat: '0 80% 65%',

    streak: '0 80% 65%',
    duration: '350 75% 60%',

    elevate1: '0 80% 90% / 0.06',
    elevate2: '0 80% 90% / 0.12',
    buttonOutline: '0 80% 65% / 0.25',
  }
};

// LIGHT MODE VARIANTS

// Purple Light - Daytime purple theme
export const cosmicPurpleLightTheme: Theme = {
  name: 'cosmic-light',
  label: 'Purple Light',
  description: 'Soft lavender and periwinkle aesthetic',
  mode: 'light',
  colors: {
    background: '270 60% 90%',
    foreground: '270 50% 12%',
    border: '270 45% 75%',
    input: '270 50% 85%',
    ring: '270 70% 50%',

    card: '270 55% 88%',
    cardForeground: '270 50% 12%',

    primary: '270 70% 50%',
    primaryForeground: '270 60% 95%',
    primaryBorder: '270 70% 45%',

    secondary: '270 45% 82%',
    secondaryForeground: '270 50% 15%',

    destructive: '0 72% 45%',
    destructiveForeground: '0 0% 100%',

    muted: '270 40% 83%',
    mutedForeground: '270 30% 35%',

    accent: '280 60% 55%',
    accentForeground: '280 60% 95%',

    popover: '270 55% 88%',
    popoverForeground: '270 50% 12%',

    sidebar: '270 58% 86%',
    sidebarForeground: '270 50% 15%',
    sidebarPrimary: '270 70% 50%',
    sidebarPrimaryForeground: '270 60% 95%',
    sidebarAccent: '270 45% 82%',
    sidebarAccentForeground: '270 50% 15%',
    sidebarBorder: '270 45% 78%',
    sidebarRing: '270 70% 50%',

    chart1: '270 70% 50%',
    chart2: '280 60% 55%',
    chart3: '260 65% 52%',
    chart4: '290 60% 55%',
    chart5: '250 65% 58%',

    moodTerrible: '0 73% 51%',
    moodBad: '25 95% 53%',
    moodOkay: '47 96% 53%',
    moodGood: '160 70% 40%',
    moodGreat: '270 70% 50%',

    streak: '270 70% 50%',
    duration: '280 60% 55%',

    elevate1: '270 30% 10% / 0.04',
    elevate2: '270 30% 10% / 0.08',
    buttonOutline: '270 70% 50% / 0.2',
  }
};

// Green Light - Daytime emerald theme
export const cosmicGreenLightTheme: Theme = {
  name: 'cosmic-green-light',
  label: 'Green Light',
  description: 'Fresh mint and seafoam aesthetic',
  mode: 'light',
  colors: {
    background: '150 58% 90%',
    foreground: '150 50% 12%',
    border: '150 42% 74%',
    input: '150 48% 85%',
    ring: '150 65% 45%',

    card: '150 52% 88%',
    cardForeground: '150 50% 12%',

    primary: '150 65% 45%',
    primaryForeground: '150 58% 95%',
    primaryBorder: '150 65% 40%',

    secondary: '150 42% 82%',
    secondaryForeground: '150 50% 15%',

    destructive: '0 72% 45%',
    destructiveForeground: '0 0% 100%',

    muted: '150 38% 83%',
    mutedForeground: '150 28% 35%',

    accent: '160 60% 48%',
    accentForeground: '160 58% 95%',

    popover: '150 52% 88%',
    popoverForeground: '150 50% 12%',

    sidebar: '150 55% 86%',
    sidebarForeground: '150 50% 15%',
    sidebarPrimary: '150 65% 45%',
    sidebarPrimaryForeground: '150 58% 95%',
    sidebarAccent: '150 42% 82%',
    sidebarAccentForeground: '150 50% 15%',
    sidebarBorder: '150 42% 77%',
    sidebarRing: '150 65% 45%',

    chart1: '150 65% 45%',
    chart2: '160 60% 48%',
    chart3: '140 60% 46%',
    chart4: '170 60% 48%',
    chart5: '130 65% 50%',

    moodTerrible: '0 73% 51%',
    moodBad: '25 95% 53%',
    moodOkay: '47 96% 53%',
    moodGood: '150 65% 42%',
    moodGreat: '160 70% 48%',

    streak: '150 65% 45%',
    duration: '160 60% 48%',

    elevate1: '150 30% 10% / 0.04',
    elevate2: '150 30% 10% / 0.08',
    buttonOutline: '150 65% 45% / 0.2',
  }
};

// Yellow Light - Daytime golden theme
export const cosmicYellowLightTheme: Theme = {
  name: 'cosmic-yellow-light',
  label: 'Yellow Light',
  description: 'Warm cream and butter aesthetic',
  mode: 'light',
  colors: {
    background: '45 62% 90%',
    foreground: '45 50% 12%',
    border: '45 48% 74%',
    input: '45 52% 85%',
    ring: '45 80% 55%',

    card: '45 58% 88%',
    cardForeground: '45 50% 12%',

    primary: '45 80% 55%',
    primaryForeground: '45 62% 10%',
    primaryBorder: '45 80% 50%',

    secondary: '45 48% 82%',
    secondaryForeground: '45 50% 15%',

    destructive: '0 72% 45%',
    destructiveForeground: '0 0% 100%',

    muted: '45 42% 83%',
    mutedForeground: '45 32% 35%',

    accent: '50 75% 58%',
    accentForeground: '50 62% 12%',

    popover: '45 58% 88%',
    popoverForeground: '45 50% 12%',

    sidebar: '45 60% 86%',
    sidebarForeground: '45 50% 15%',
    sidebarPrimary: '45 80% 55%',
    sidebarPrimaryForeground: '45 62% 10%',
    sidebarAccent: '45 48% 82%',
    sidebarAccentForeground: '45 50% 15%',
    sidebarBorder: '45 48% 77%',
    sidebarRing: '45 80% 55%',

    chart1: '45 80% 55%',
    chart2: '50 75% 58%',
    chart3: '40 75% 56%',
    chart4: '55 75% 60%',
    chart5: '35 80% 58%',

    moodTerrible: '0 73% 51%',
    moodBad: '25 95% 53%',
    moodOkay: '47 96% 53%',
    moodGood: '150 70% 40%',
    moodGreat: '45 80% 55%',

    streak: '45 80% 55%',
    duration: '50 75% 58%',

    elevate1: '45 30% 10% / 0.04',
    elevate2: '45 30% 10% / 0.08',
    buttonOutline: '45 80% 55% / 0.2',
  }
};

// Red Light - Daytime crimson theme
export const cosmicRedLightTheme: Theme = {
  name: 'cosmic-red-light',
  label: 'Red Light',
  description: 'Soft rose and coral aesthetic',
  mode: 'light',
  colors: {
    background: '0 56% 90%',
    foreground: '0 50% 12%',
    border: '0 44% 74%',
    input: '0 50% 85%',
    ring: '0 70% 55%',

    card: '0 52% 88%',
    cardForeground: '0 50% 12%',

    primary: '0 70% 55%',
    primaryForeground: '0 0% 100%',
    primaryBorder: '0 70% 50%',

    secondary: '0 44% 82%',
    secondaryForeground: '0 50% 15%',

    destructive: '0 72% 45%',
    destructiveForeground: '0 0% 100%',

    muted: '0 40% 83%',
    mutedForeground: '0 30% 35%',

    accent: '350 65% 58%',
    accentForeground: '0 0% 100%',

    popover: '0 52% 88%',
    popoverForeground: '0 50% 12%',

    sidebar: '0 54% 86%',
    sidebarForeground: '0 50% 15%',
    sidebarPrimary: '0 70% 55%',
    sidebarPrimaryForeground: '0 0% 100%',
    sidebarAccent: '0 44% 82%',
    sidebarAccentForeground: '0 50% 15%',
    sidebarBorder: '0 44% 77%',
    sidebarRing: '0 70% 55%',

    chart1: '0 70% 55%',
    chart2: '350 65% 58%',
    chart3: '10 68% 56%',
    chart4: '340 68% 58%',
    chart5: '20 65% 60%',

    moodTerrible: '0 73% 51%',
    moodBad: '25 95% 53%',
    moodOkay: '47 96% 53%',
    moodGood: '150 70% 40%',
    moodGreat: '0 70% 55%',

    streak: '0 70% 55%',
    duration: '350 65% 58%',

    elevate1: '0 30% 10% / 0.04',
    elevate2: '0 30% 10% / 0.08',
    buttonOutline: '0 70% 55% / 0.2',
  }
};

// Export all themes as a map (only base themes - light variants accessed via mode toggle)
export const themes: Record<string, Theme> = {
  cosmic: cosmicPurpleTheme,
  'cosmic-green': cosmicGreenTheme,
  'cosmic-yellow': cosmicYellowTheme,
  'cosmic-red': cosmicRedTheme,
};

// Internal map for accessing light variants programmatically
export const lightThemeVariants: Record<string, Theme> = {
  'cosmic-light': cosmicPurpleLightTheme,
  'cosmic-green-light': cosmicGreenLightTheme,
  'cosmic-yellow-light': cosmicYellowLightTheme,
  'cosmic-red-light': cosmicRedLightTheme,
};

// Combined map for theme lookups (used internally)
const allThemes: Record<string, Theme> = {
  ...themes,
  ...lightThemeVariants,
};

// Helper to get theme by name with fallback (searches all themes including light variants)
export function getTheme(themeName: string): Theme {
  return allThemes[themeName] || cosmicPurpleTheme;
}

// Get list of all available themes
export function getAvailableThemes(): Theme[] {
  return Object.values(themes);
}

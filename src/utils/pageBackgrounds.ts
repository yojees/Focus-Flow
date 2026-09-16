import curvedOrange from '../assets/images/abstract_curved_orange_1789567571909.jpg';
import curvedLight from '../assets/images/abstract_curved_light_1789567585384.jpg';
import softEmber from '../assets/images/abstract_soft_ember_1789567597262.jpg';
import waveRibbed from '../assets/images/abstract_wave_ribbed_1789567610518.jpg';
import circularDark from '../assets/images/abstract_circular_dark_1789567622053.jpg';

export interface PageBackgroundConfig {
  imageSrc: string;
  overlayOpacity: number; // 0.65 to 0.82
}

/**
 * Suggested page background mapping per specification:
 * - Overview: smooth orange/red abstract curved image
 * - Focus: dark curved orange light image
 * - Tasks: softer orange/black abstract image
 * - Calendar: curved orange light image
 * - Analytics: abstract wave/ribbed image
 * - Progress: orange circular/abstract image
 * - Garden: abstract wave/ribbed image
 * - Notes: softer dark abstract image
 * - Sounds: darker abstract image (higher opacity)
 * - Challenges: abstract orange shapes image
 * - Settings: darkest/minimal image
 */
export const PAGE_BACKGROUNDS: Record<string, PageBackgroundConfig> = {
  overview: {
    imageSrc: curvedOrange,
    overlayOpacity: 0.72,
  },
  focus: {
    imageSrc: curvedLight,
    overlayOpacity: 0.70,
  },
  tasks: {
    imageSrc: softEmber,
    overlayOpacity: 0.74,
  },
  calendar: {
    imageSrc: curvedLight,
    overlayOpacity: 0.72,
  },
  analytics: {
    imageSrc: waveRibbed,
    overlayOpacity: 0.72,
  },
  progress: {
    imageSrc: circularDark,
    overlayOpacity: 0.72,
  },
  garden: {
    imageSrc: waveRibbed,
    overlayOpacity: 0.74,
  },
  notes: {
    imageSrc: softEmber,
    overlayOpacity: 0.76,
  },
  sounds: {
    imageSrc: softEmber,
    overlayOpacity: 0.80,
  },
  challenges: {
    imageSrc: circularDark,
    overlayOpacity: 0.72,
  },
  settings: {
    imageSrc: curvedLight,
    overlayOpacity: 0.82,
  },
};

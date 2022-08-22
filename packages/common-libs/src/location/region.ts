export const AUSTRALIAN_REGIONS = [
  'QLD1',
  'NSW1',
  'TAS1',
  'SA1',
  'VIC1',
] as const;

export type AustralianRegion = typeof AUSTRALIAN_REGIONS[number];

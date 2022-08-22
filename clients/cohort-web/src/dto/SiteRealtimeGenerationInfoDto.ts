export type SiteRealtimeGenerationInfoDto = {
  siteName: string;
  color: string;
  name: string;
  data: Array<{
    x: Date;
    y: number;
  }>;
  from: Date;
  to: Date;
};

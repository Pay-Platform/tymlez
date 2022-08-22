import type { FC } from 'react';
declare type Continents = 'af' | 'as' | 'au' | 'eu' | 'na' | 'sa';
interface WorldMapProps {
    colors: Record<Continents, string>;
}
export declare const WorldMap: FC<WorldMapProps>;
export {};

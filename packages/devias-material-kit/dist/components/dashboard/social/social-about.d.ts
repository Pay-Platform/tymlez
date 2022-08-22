import type { FC } from 'react';
interface SocialAboutProps {
    currentCity: string;
    currentJobCompany: string;
    currentJobTitle: string;
    email: string;
    originCity: string;
    previousJobCompany: string;
    previousJobTitle: string;
    profileProgress: number;
    quote: string;
}
export declare const SocialAbout: FC<SocialAboutProps>;
export {};

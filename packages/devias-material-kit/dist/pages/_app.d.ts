import type { FC } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import type { EmotionCache } from '@emotion/cache';
import '../i18n';
declare type EnhancedAppProps = AppProps & {
    Component: NextPage;
    emotionCache: EmotionCache;
};
declare const App: FC<EnhancedAppProps>;
export default App;

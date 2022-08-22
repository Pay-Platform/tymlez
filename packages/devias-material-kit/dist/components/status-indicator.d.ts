import type { FC } from 'react';
interface StatusIndicatorProps {
    size?: 'small' | 'medium' | 'large';
    status?: 'online' | 'offline' | 'away' | 'busy';
}
export declare const StatusIndicator: FC<StatusIndicatorProps>;
export {};

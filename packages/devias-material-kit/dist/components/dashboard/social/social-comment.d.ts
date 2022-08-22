import type { FC } from 'react';
interface SocialCommentProps {
    authorAvatar: string;
    authorName: string;
    createdAt: number;
    message: string;
}
export declare const SocialComment: FC<SocialCommentProps>;
export {};

import type { FC } from 'react';
import type { Comment } from '../../../types/social';
interface SocialPostCardProps {
    authorAvatar: string;
    authorName: string;
    comments: Comment[];
    createdAt: number;
    isLiked: boolean;
    likes: number;
    media?: string;
    message: string;
}
export declare const SocialPostCard: FC<SocialPostCardProps>;
export {};

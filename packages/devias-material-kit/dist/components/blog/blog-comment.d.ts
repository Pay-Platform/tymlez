import type { FC } from 'react';
interface BlogPostCommentProps {
    authorAvatar: string;
    authorName: string;
    authorRole: string;
    content: string;
    createdAt: number;
    isLiked: boolean;
    likes: number;
}
export declare const BlogComment: FC<BlogPostCommentProps>;
export {};

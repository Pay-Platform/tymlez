import type { FC } from 'react';
interface BlogPostCardProps {
    authorAvatar: string;
    authorName: string;
    category: string;
    cover: string;
    publishedAt: number;
    readTime: string;
    shortDescription: string;
    title: string;
}
export declare const BlogPostCard: FC<BlogPostCardProps>;
export {};

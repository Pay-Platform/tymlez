import type { Post } from '../types/blog';
declare class BlogApi {
    getPosts(): Promise<Post[]>;
    getPost(): Promise<Post>;
}
export declare const blogApi: BlogApi;
export {};

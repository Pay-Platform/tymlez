import type { Connection, Post, Profile } from '../types/social';
declare class SocialApi {
    getProfile(): Promise<Profile>;
    getConnections(): Promise<Connection[]>;
    getPosts(): Promise<Post[]>;
    getFeed(): Promise<Post[]>;
}
export declare const socialApi: SocialApi;
export {};

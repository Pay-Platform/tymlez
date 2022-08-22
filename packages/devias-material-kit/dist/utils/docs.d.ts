export interface Article {
    slug?: string;
    content?: string;
}
export declare const getArticleSlugs: () => string[];
export declare const getArticleBySlug: (slug: string, fields?: string[]) => Article;
export declare const getArticles: (fields?: string[]) => Article[];

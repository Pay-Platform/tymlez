import type { NextPage } from 'next';
export interface Article {
    content?: string;
    slug?: string;
    title?: string;
}
export declare const getStaticPaths: () => {
    paths: {
        params: {
            slug: string;
        };
    }[];
    fallback: boolean;
};
export declare const getStaticProps: ({ params }: {
    params: any;
}) => {
    props: {
        article: import("../../utils/docs").Article;
    };
};
declare const Article: NextPage<{
    article?: Article;
}>;
export default Article;

import type { FC } from 'react';
import type { Review } from '../../../types/job';
interface CompanyReviewsProps {
    reviews: Review[];
    averageRating: number;
}
export declare const CompanyReviews: FC<CompanyReviewsProps>;
export {};

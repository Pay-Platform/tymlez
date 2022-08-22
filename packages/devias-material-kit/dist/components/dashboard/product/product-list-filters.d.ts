import type { FC } from 'react';
export interface Filters {
    name?: string;
    category: string[];
    status: string[];
    inStock?: boolean;
}
interface ProjectListFiltersProps {
    onChange?: (filters: Filters) => void;
}
export declare const ProjectListFilters: FC<ProjectListFiltersProps>;
export {};

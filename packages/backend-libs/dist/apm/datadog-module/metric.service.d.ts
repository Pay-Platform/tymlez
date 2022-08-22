export declare class MetricService {
    private dogstatsd;
    count(event: string, count: number, tags?: {
        [key: string]: string;
    }): Promise<unknown>;
}

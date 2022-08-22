import { PipeTransform } from '@nestjs/common';
export declare class HandleDateParameter implements PipeTransform<string, Date | undefined> {
    transform(value: string): Date | undefined;
}

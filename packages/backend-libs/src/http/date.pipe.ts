import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class HandleDateParameter
  implements PipeTransform<string, Date | undefined>
{
  transform(value: string): Date | undefined {
    if (!value) {
      return;
    }
    const date = new Date(value);
    if (date instanceof Date && !isNaN(date.getDate())) {
      return date;
    }
    throw new BadRequestException('value is not date');
  }
}

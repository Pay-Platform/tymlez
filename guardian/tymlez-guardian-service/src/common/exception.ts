import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(public code: HttpStatus, public data: any) {
    super(data, code);
    this.name = 'BusinessException';
  }
}

import { Controller, Get, Param } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private service: AuditService) {}

  @Get('/get-vp-documents/:deviceId')
  async getAudit(@Param('deviceId') deviceId: string): Promise<any[]> {
    return await this.service.getVpDocumentsByDeviceId(deviceId);
  }
}

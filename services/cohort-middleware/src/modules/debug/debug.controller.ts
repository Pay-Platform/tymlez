import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles, RolesGuard, JwtAuthGuard } from '@tymlez/backend-libs';
import type { ICohortRole } from '@tymlez/cohort-api-interfaces';

@Controller('debug')
export class DebugController {
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles<ICohortRole>('admin', 'cohort-staff')
  @Get('cohort-staff-info')
  getCohortStaffInfo(): { canAccessCohort: boolean } {
    return {
      canAccessCohort: true,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles<ICohortRole>('admin', 'qld-government-staff')
  @Get('qld-government-staff-info')
  getQldGovernmentStaffInfo(): { canAccessQldGovernment: boolean } {
    return {
      canAccessQldGovernment: true,
    };
  }
}

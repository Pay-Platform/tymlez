import { Controller, Get, Post, Body } from '@nestjs/common';
import type { PolicyConfig } from '@tymlez/guardian-api-client';
import type { PolicyPackage } from '../../schemas/policy-package.schema';
import type { ImportPolicyPackageDto } from './dto/import-policy.dto';
import { PolicyService } from './policy.service';

@Controller('policy')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Get('/list')
  async getAll(): Promise<PolicyConfig[]> {
    return await this.policyService.getAll();
  }

  @Post('/import-package')
  async importPackage(
    @Body() payload: ImportPolicyPackageDto,
  ): Promise<PolicyPackage> {
    return this.policyService.importPackage(payload);
  }
}

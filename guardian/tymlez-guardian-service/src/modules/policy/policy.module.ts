import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PolicyService } from './policy.service';
import { PolicyController } from './policy.controller';
import {
  PolicyPackage,
  PolicyPackageSchema,
} from '../../schemas/policy-package.schema';

@Module({
  controllers: [PolicyController],
  providers: [PolicyService],
  imports: [
    MongooseModule.forFeature([
      {
        name: PolicyPackage.name,
        schema: PolicyPackageSchema,
      },
    ]),
  ],
})
export class PolicyModule {}

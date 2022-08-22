import { IsBoolean, IsNotEmptyObject } from 'class-validator';
import type { IImportPolicyPackage } from '../../../interfaces/policy-package';

export interface IImportPolicyPackageDto {
  publish: boolean;
  package: IImportPolicyPackage;
}

export class ImportPolicyPackageDto implements IImportPolicyPackageDto {
  @IsBoolean()
  publish: boolean;

  @IsNotEmptyObject()
  package: IImportPolicyPackage;
}

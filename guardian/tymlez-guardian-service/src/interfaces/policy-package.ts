import type { PolicyConfig, Schema } from '@tymlez/guardian-api-client';

export interface IImportPolicyPackageRequestBody {
  package: IImportPolicyPackage;
  publish: boolean;
}

export interface IImportPolicyPackage {
  policy: PolicyConfig;
  schemas: Schema[];
}

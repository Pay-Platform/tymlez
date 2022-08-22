import { Injectable } from '@nestjs/common';
import assert from 'assert';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { Session } from '@tymlez/guardian-api-client';
import { v4 as uuidv4 } from 'uuid';
import { PolicyPackage } from '../../schemas/policy-package.schema';
import type { IImportPolicyPackage } from '../../interfaces/policy-package';
import type { IImportPolicyPackageDto } from './dto/import-policy.dto';
import { ServiceBase } from '../serviceBase';

@Injectable()
export class PolicyService extends ServiceBase {
  constructor(
    @InjectModel(PolicyPackage.name)
    private policyPackageModel: Model<PolicyPackage>,
  ) {
    super();
  }

  async importPackage(input: IImportPolicyPackageDto) {
    const { package: inputPackage, publish } = { ...input };

    assert(inputPackage, `package is missing`);
    // TODO replace by get all policies
    const policyPackage = await this.policyPackageModel.findOne({
      'policy.inputPolicyTag': inputPackage.policy.policyTag,
    });

    if (policyPackage) {
      console.log(
        `Skip because policy package '${inputPackage.policy.policyTag}' was imported before.`,
      );
      return policyPackage;
    }
    const session = await this.loginAs('RootAuthority');
    const importedPolicy = await this.importPolicyPackage(
      session,
      inputPackage,
    );

    let allSchemas = await this.api.schema().getAll(session);

    const unpublishedSchema = allSchemas.filter(
      (schema) => schema.status !== 'PUBLISHED',
    );
    console.log(
      `Publishing schemas`,
      unpublishedSchema.map((schema) => ({
        id: schema.id,
        uuid: schema.uuid,
        name: schema.name,
        status: schema.status,
      })),
    );

    for await (const schema of unpublishedSchema) {
      console.log('Publishing schema', schema.name);
      await this.api.schema().publish(session, schema.id, '1.0.0');
    }

    if (
      publish &&
      !['PUBLISH', 'PUBLISHED'].includes(importedPolicy.status as string)
    ) {
      const policyId = importedPolicy.id as string;
      console.log(`Publishing policy`, importedPolicy, {
        importedPolicy,
        id: policyId,
        name: importedPolicy.name,
        policyTag: importedPolicy.policyTag,
        config: {
          id: (importedPolicy.config as any)?.id,
        },
      });
      await this.api.policy().publish(session, policyId, '1.0.0');
    }
    allSchemas = await this.api.schema().getAll(session);
    console.log('allSchemas', allSchemas);
    const newPolicyPackage = {
      _id: new Types.ObjectId(),
      policy: {
        ...importedPolicy,
        inputPolicyTag: inputPackage.policy.policyTag,
      },
      schemas: allSchemas.map((schema) => ({
        ...schema,
        inputName: inputPackage.schemas.find((inputSchema) =>
          schema.name?.startsWith(inputSchema.name),
        )?.name,
      })),
      createdDate: new Date(),
    };

    this.policyPackageModel.create(newPolicyPackage);
    return newPolicyPackage;
  }

  async importPolicyPackage(
    session: Session,
    inputPackage: IImportPolicyPackage,
  ) {
    const rootAuthority = await this.getProfile(session);
    assert(rootAuthority.did, `rootAuthority.did is missing`);

    const newPolicyConfigId = uuidv4();

    const packageImportData: IImportPolicyPackage = {
      ...inputPackage,
      policy: {
        ...inputPackage.policy,
        config: {
          ...inputPackage.policy.config,
          id: newPolicyConfigId,
        },
        owner: rootAuthority.did,
        status: undefined,
        // topicId: undefined,
      },
    };
    const existingSchemas = await this.api.schema().getAll(session);

    await Promise.all(
      packageImportData.schemas
        .filter(
          (schema) => !existingSchemas.find((x) => x.name === schema.name),
        )
        .map((schema) => this.api.schema().create(session, schema)),
    );

    let allPolicies = await this.api.policy().getAll(session);
    const findPolicies = await allPolicies.find(
      (x) => x.policyTag === packageImportData.policy.policyTag,
    );
    if (!findPolicies) {
      const result = await this.api
        .policy()
        .create(session, packageImportData.policy);

      console.log('created policies result', result);

      allPolicies = await this.api.policy().getAll(session);

      const importedPolicy = allPolicies.find(
        (p) => p.policyTag === packageImportData.policy.policyTag,
      );

      assert(
        importedPolicy,
        `Failed to import policy package ${
          (inputPackage.policy.config as any).id
        } ${inputPackage.policy.name}`,
      );
      return importedPolicy;
    }
    return findPolicies;
  }

  async getAll() {
    const session = await this.loginAs('RootAuthority');
    return await this.api.policy().getAll(session);
  }
}

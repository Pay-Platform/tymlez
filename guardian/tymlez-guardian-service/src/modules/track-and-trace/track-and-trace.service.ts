import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import assert from 'assert';
import { waitFor } from '@tymlez/common-libs';
import { DeviceConfig } from '../../schemas/device-config.schema';
import { ServiceBase } from '../serviceBase';
import { ProcessedMrv } from '../../schemas/processed-mrv.schema';
import type { GenerateMvcDto } from './dto/generate-mrv.dto';
import type { InstallerRegisterDto } from './dto/installer-register.dto';
import type { UserType } from '../user/interfaces';
import type { DeviceRegisterDto } from './dto/device-register.dto';
import { PolicyPackage } from '../../schemas/policy-package.schema';
import { VCDocumentLoader } from './documents/vc-document-loader';
import { BusinessException } from '../../common/exception';

@Injectable()
export class TrackAndTraceService extends ServiceBase {
  @Inject('VCDocumentLoaderName') vcDocumentLoader: VCDocumentLoader;
  constructor(
    @InjectModel(ProcessedMrv.name)
    private processedMrvModel: Model<ProcessedMrv>,

    @InjectModel(DeviceConfig.name)
    private deviceConfigModel: Model<DeviceConfig>,

    @InjectModel(PolicyPackage.name)
    private policyPackageModel: Model<PolicyPackage>,
  ) {
    super();
  }

  async listDeviceByPolicyTag(policyTag: string) {
    const deviceConfigs = await this.deviceConfigModel.find({
      where: { policyTag },
    });
    return deviceConfigs;
  }

  async getLatestMrv(policyTag: string, deviceId: string) {
    const mrv = await this.processedMrvModel.findOne({
      policyTag,
      deviceId,
      order: { timestamp: 'DESC' },
    });
    if (!mrv) {
      throw new BusinessException(404, {
        message: 'No mrv found ',
        deviceId,
        policyTag,
      });
    }
    return mrv;
  }

  async registerInstaller(installer: InstallerRegisterDto) {
    const {
      username,
      policyTag,
      installerInfo,
      schemaName = 'TymlezInstaller',
    } = installer;

    assert(username, `username is missing`);
    assert(
      username === 'Installer' || username === 'Installer2',
      `Unexpected username '${username}', expect one of the installers`,
    );
    assert(policyTag, `policyTag is missing`);
    assert(installerInfo, `installerInfo is missing`);

    const session = await this.loginAs(username as UserType);
    const allPolicies = await this.api.policy().getAll(session);
    const policy = allPolicies.find((p) => p.policyTag === policyTag);
    assert(policy, `Cannot find ${policyTag} package`);

    const installerBlock = await this.getPolicyBlockData(
      session,
      policy.id as string,
      'init_installer_steps',
    );

    assert(
      installerBlock.blockType === 'interfaceStepBlock',
      `installerBlock.blockType is ${installerBlock.blockType}, expect interfaceStepBlock`,
    );

    if (
      installerBlock.blocks?.[installerBlock.index as number] &&
      installerBlock.blocks?.[installerBlock.index as number]?.blockType !==
        'requestVcDocumentBlock'
    ) {
      console.log(
        `Skip because installer '${JSON.stringify(
          installerInfo,
        )}' was registered before.`,
        installerBlock,
      );
      return {};
    }
    const allSchemas = await this.api.schema().getAll(session);

    const actualInstallerSchema = allSchemas.find(
      (schema) =>
        schema.name.toLocaleLowerCase() === schemaName.toLocaleLowerCase(),
    ) as any;

    await this.setPolicyBlockData(
      session,
      policy.id as string,
      'choose_role_user_role',
      { role: 'INSTALLER' },
    );

    // assert(actualInstallerSchema, `Cannot find ${schemaName} schema`);
    if (!actualInstallerSchema) {
      console.log('Skip setup installer as no schema found');
      return;
    }

    await this.setPolicyBlockData(
      session,
      policy.id as string,
      'add_new_installer_request',
      {
        document: {
          type: actualInstallerSchema?.iri?.replace('#', ''),
          '@context': [actualInstallerSchema?.contextURL],
          ...installerInfo,
        },
      },
    );
    return {};
  }

  async registerDevice(device: DeviceRegisterDto) {
    const {
      username,
      deviceId,
      deviceInfo,
      policyTag,
      deviceSchemaName = 'TymlezDevice',
    } = device;

    assert(username, `username is missing`);
    assert(
      username === 'Installer' || username === 'Installer2',
      `Unexpected username '${username}', expect one of the installers`,
    );
    assert(policyTag, `policyTag is missing`);
    assert(deviceId, `deviceId is missing`);
    assert(deviceInfo, `deviceInfo is missing`);
    assert(deviceInfo.deviceType, `deviceType is missing`);

    const deviceConfigKey = `${policyTag}-${deviceId}`;

    const existingDeviceConfig = await this.deviceConfigModel.findOne({
      key: deviceConfigKey,
    });

    if (existingDeviceConfig) {
      console.log(
        `Skip because device '${deviceId}' with policy '${policyTag}' was added before.`,
      );
      return existingDeviceConfig;
    }
    const session = await this.loginAs(username as UserType);

    const policyPackage = await this.policyPackageModel.findOne({
      'policy.inputPolicyTag': policyTag,
    });

    assert(policyPackage, `Cannot find ${policyTag} package`);

    const allSchemas = await this.api.schema().getAll(session);

    const actualDeviceSchema: any = allSchemas.find(
      (schema) =>
        schema.name.toLocaleLowerCase() ===
        deviceSchemaName.toLocaleLowerCase(),
    );

    const updateDeviceData = {
      document: {
        type: actualDeviceSchema?.iri?.replace('#', ''),
        '@context': [actualDeviceSchema?.contextURL],
        ...deviceInfo,
      },
    };

    await this.setPolicyBlockData(
      session,
      policyPackage.policy.id,
      'add_sensor_bnt',
      updateDeviceData,
    );

    let addedDevice;
    let installedDevices;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      installedDevices = await this.getPolicyBlockData(
        session,
        policyPackage.policy.id,
        'sensors_grid',
      );

      addedDevice = (installedDevices.data as any[]).find((dv) =>
        dv.document.credentialSubject.some((x: any) => x.deviceId === deviceId),
      );
      if (addedDevice) {
        break;
      }
      await waitFor(1000);
    }

    assert(
      addedDevice,
      `Number of new devices is not detected, expect found 1 device`,
    );

    console.log(
      `Getting device config for ${deviceId} with policy ${policyTag}`,
    );

    const deviceConfig: any = await this.setPolicyBlockData(
      session,
      policyPackage.policy.id,
      'download_config_btn',
      {
        owner: addedDevice.owner,
        document: addedDevice.document,
      },
    );
    const newDeviceConfig = {
      key: deviceConfigKey,
      deviceId,
      deviceType: deviceInfo.deviceType,
      policyTag,
      config: deviceConfig.body,
    } as DeviceConfig;

    console.log('add device to db', JSON.stringify(newDeviceConfig, null, 4));
    newDeviceConfig.config.schema = JSON.stringify(
      newDeviceConfig.config.schema,
    );
    this.deviceConfigModel.create(newDeviceConfig);
    return newDeviceConfig;
  }

  async generateMrv(mrv: GenerateMvcDto) {
    console.log('Generate MRV', mrv);

    const { setting, deviceId, policyTag: inputPolicyTag } = mrv;

    const deviceConfigKey = `${inputPolicyTag}-${deviceId}`;
    const deviceConfig = await this.deviceConfigModel.findOne({
      key: deviceConfigKey,
    });
    console.log('device key', deviceConfigKey, deviceConfig);

    if (!deviceConfig || !deviceConfig.config) {
      throw new BusinessException(400, {
        deviceId,
        message: `Cannot find device config for ${deviceId}`,
      });
    }

    const mrvKey = `${inputPolicyTag}-${deviceId}-${setting.mrvTimestamp}`;
    const processedMrv = await this.processedMrvModel.findOne({ key: mrvKey });

    if (processedMrv) {
      console.log(`Skip because MRV ${mrvKey} already processed`);
      throw new BusinessException(200, {
        deviceId,
        message: `Skip because MRV ${mrvKey} already processed`,
      });
    }

    const {
      // topic,
      // hederaAccountId,
      hederaAccountKey,
      installer,
      did,
      didDocument,
      policyId,
      schema,
      context,
      policyTag,
    } = deviceConfig.config || {};

    this.vcDocumentLoader.setDocument(JSON.parse(schema));
    this.vcDocumentLoader.setContext(context);
    // const hederaHelper = HederaHelper.setOperator(
    //   hederaAccountId,
    //   hederaAccountKey,
    // ).setAddressBook(null as any, null as any, topic);

    let document;
    let vc;
    try {
      const vcSubject: any = { ...context, ...setting, policyId };
      // vcSubject.policyId = policyId;
      // vcSubject.accountId = hederaAccountId;
      console.log('vcSubject', vcSubject);
      vc = await this.vcDocumentLoader.vcHelper.createVC(
        vcSubject,
        didDocument,
        did,
      );
      document = vc;

      console.log('created vc', document);
      console.log(JSON.stringify(document, null, 2));
    } catch (err) {
      console.error(err);
      throw err;
    }
    // overwrite the context to ipfs
    const session = await this.loginAs('Installer');

    //const schemas = await this.api.schema().getAll(session);

    // const mvrSchema: any = schemas.find(
    //   (x) => x.name === 'TymlezMrv' && x.status === 'PUBLISHED',
    // );

    // set context url to schema  url
    // document.credentialSubject[0]['@context'] = [
    //   mvrSchema?.contextURL ||
    //   'https://ipfs.io/ipfs/bafkreie2u7xmzi5d2dyl5nhsn3tsg4gipyrv3f64qsjkcnbvp3xp2sanlu',
    // ];

    const body = {
      document,
      owner: installer,
      policyTag,
    };

    const result = await this.api.external().send(session, body);

    console.log('created VP document request result', result);

    try {
      console.info(
        'start Transaction',
        JSON.stringify(vc, undefined, 2),
        typeof hederaAccountKey,
      );
      // await hederaHelper.DID.createVcTransaction(vc, hederaAccountKey);
      console.info('end Transaction');
    } catch (e) {
      console.error(e);
      throw e;
    }
    const toBeInserted = {
      _id: new Types.ObjectId(),
      key: mrvKey,
      deviceId,
      policyTag,
      timestamp: setting.mrvTimestamp,
      createdDate: new Date(),
      updatedDate: new Date(),
    };

    await this.processedMrvModel.create(toBeInserted);
    return toBeInserted;
  }
}

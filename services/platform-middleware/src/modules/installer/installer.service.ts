import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type {
  IAddInstallerResult,
  IInstaller,
  IQueryInstaller,
  ISummary,
} from '@tymlez/platform-api-interfaces';
import { storeFile } from '@tymlez/backend-libs';
import { Installer } from './entities/installer.entity';
import type { User } from '../auth/entities/User.entity';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class InstallerService {
  constructor(
    @InjectRepository(Installer)
    private readonly installerRepository: EntityRepository<Installer>,
    private readonly authService: AuthService,
    private readonly em: EntityManager,
  ) {}

  public async addInstaller(
    installer: IInstaller,
    userId: string,
  ): Promise<IAddInstallerResult> {
    const message = [];
    // validation error

    if (installer.certificateDocs.length === 0) {
      message.push('Require at least 1 certificate document');
    }

    //check if certificateNo already exists
    if (await this.checkExistCertificateNo(installer.certificateNo)) {
      message.push('Certificate Number already exists');
    }

    if (message.length === 0) {
      const createdBy = await this.authService.getUserById(userId);
      const toBeInsert = new Installer();

      toBeInsert.name = installer.name;
      toBeInsert.company = installer.company;
      toBeInsert.certificateNo = installer.certificateNo;
      toBeInsert.certificateUrl = installer.certificateUrl;
      toBeInsert.createdBy = createdBy as User;
      // Save document to S3
      toBeInsert.certificateDocs = await Promise.all(
        installer.certificateDocs.map(async (doc) => {
          return await storeFile(
            `/installers/${installer.company}/${doc.name}`,
            Buffer.from(doc.content as string, 'base64'),
          );
        }),
      );

      await this.em.persistAndFlush(toBeInsert);

      return {
        success: true,
      };
    }
    return {
      success: false,
      message,
    };
  }

  public async getAll(query: any): Promise<IQueryInstaller> {
    const [installers, total] = await this.installerRepository.findAndCount(
      {},
      {
        orderBy: { name: 'ASC' },
        limit: query.pageSize,
        offset: query.page * query.pageSize,
        populate: true,
      },
    );
    return {
      total,
      installers: installers.map((installer) => {
        return {
          ...installer,
          createdBy: {
            id: installer.createdBy?.id,
            email: installer.createdBy?.email,
          },
        };
      }) as any as IInstaller[],
    };
  }

  public async getInstallerById(id: string): Promise<IInstaller> {
    const installer = await this.installerRepository.findOne(id, {
      populate: true,
    });

    return installer as any as IInstaller;
  }

  public async updateInstaller(
    installer: IInstaller,
  ): Promise<IAddInstallerResult> {
    const message = [];

    if (installer.id === undefined) {
      message.push('No installer to update');
      return { success: false, message };
    }

    const toBeUpdate = (await this.installerRepository.findOne(
      installer.id,
    )) as Installer;

    //check if certificateNo already exists
    if (
      toBeUpdate.certificateNo !== installer.certificateNo &&
      (await this.checkExistCertificateNo(installer.certificateNo))
    ) {
      message.push('Certificate Number already exists');
    }

    if (message.length !== 0) {
      return {
        success: false,
        message,
      };
    }

    toBeUpdate.name = installer.name;
    toBeUpdate.company = installer.company;
    toBeUpdate.certificateNo = installer.certificateNo;
    toBeUpdate.certificateUrl = installer.certificateUrl;
    toBeUpdate.certificateDocs = [
      ...toBeUpdate.certificateDocs,
      ...(await Promise.all(
        installer.certificateDocs.map(async (doc) => {
          return await storeFile(
            `/installers/${installer.company}/${doc.name}`,
            Buffer.from(doc.content as string, 'base64'),
          );
        }),
      )),
    ];
    await this.em.persistAndFlush(toBeUpdate);
    return {
      success: true,
    };
  }

  public async getSummary(): Promise<ISummary> {
    const total = await this.installerRepository.count();
    // TODO: read the total device from guardian
    return {
      totalInstaller: total,
      totalDevice: 0,
      status: 'All Verified',
    };
  }

  private async checkExistCertificateNo(certNo: string): Promise<boolean> {
    const installer = await this.installerRepository.findOne({
      certificateNo: certNo,
    });
    if (installer === null) {
      return false;
    }
    return true;
  }
}

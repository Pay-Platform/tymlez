import { EntityRepository } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type {
  IAddQueryResult,
  ICircuit,
  IQueryCircuit,
} from '@tymlez/platform-api-interfaces';
import type { CircuitDto } from './dto/circuit.dto';
import { Circuit } from './entities/Circuit.entity';
import type { Meter } from './entities/Meter.entity';
import { MeterInfoService } from './meter-info.service';

@Injectable()
export class CircuitService {
  constructor(
    @InjectRepository(Circuit)
    private readonly circuitRepository: EntityRepository<Circuit>,
    private readonly meterService: MeterInfoService,
    private readonly em: EntityManager,
  ) {}

  public async getCircuitDetail(circuitName: string): Promise<ICircuit | null> {
    return await this.circuitRepository.findOne({ name: circuitName });
  }

  public async getCircuitsByMeter(meterName: string): Promise<ICircuit[]> {
    return await this.circuitRepository.find({ meter: { name: meterName } });
  }

  public async getCircuitsBySite(siteName: string): Promise<ICircuit[]> {
    const meters = await this.meterService.getMetersBySite(siteName);
    if (meters.length === 0) {
      return [];
    }

    const meterNames = meters.map((x) => `'${x.name}'`);
    const qb = this.em
      .createQueryBuilder(Circuit)
      .where(`meter_name in (${meterNames})`)
      .select(`*`);

    return await qb.execute('all');
  }

  async getAllCircuits(query: any): Promise<IQueryCircuit> {
    const [circuits, total] = await this.circuitRepository.findAndCount(
      {},
      {
        orderBy: { name: 'ASC' },
        limit: query.pageSize,
        offset: query.page * query.pageSize,
      },
    );
    return { total, circuits };
  }

  private checkInputInfo(circuit: CircuitDto) {
    const message = [];
    if (circuit.name === '') {
      message.push(`Name should not be empty`);
    }
    if (circuit.label === '') {
      message.push('Label should not be empty');
    }

    return message;
  }

  public async addCircuit(circuit: CircuitDto): Promise<IAddQueryResult> {
    const message = this.checkInputInfo(circuit);
    const existingCircuit = await this.getCircuitDetail(circuit.name);
    if (existingCircuit !== null) {
      message.push('Circuit name already exists');
    }
    const meter = await this.meterService.getMeterDetail(circuit.meter.name);
    if (meter === null) {
      message.push('Meter does not exist');
    }

    if (message.length === 0) {
      const toBeInsert = new Circuit();
      toBeInsert.name = circuit.name;
      toBeInsert.label = circuit.label;
      toBeInsert.meter = { ...(meter as Meter) };
      toBeInsert.createdAt = new Date();
      toBeInsert.tags = ['initial'];
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

  public async updateCircuit(circuit: CircuitDto): Promise<IAddQueryResult> {
    const message = this.checkInputInfo(circuit);

    const toBeUpdate = (await this.getCircuitDetail(circuit.name)) as ICircuit;
    if (message.length !== 0) {
      return {
        success: false,
        message,
      };
    }

    toBeUpdate.name = circuit.name;
    toBeUpdate.label = circuit.label;
    toBeUpdate.meter = circuit.meter;
    await this.em.persistAndFlush(toBeUpdate);
    return {
      success: true,
    };
  }
}

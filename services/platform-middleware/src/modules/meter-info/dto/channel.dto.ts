import { IsNotEmpty, IsNumber } from 'class-validator';
import type {
  IChannel,
  ICircuit,
  IMeter,
} from '@tymlez/platform-api-interfaces';

export class ChannelDto implements IChannel {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  meter: IMeter;

  @IsNotEmpty()
  circuit: ICircuit;

  @IsNotEmpty()
  @IsNumber()
  index: number;

  @IsNotEmpty()
  label: string;
}

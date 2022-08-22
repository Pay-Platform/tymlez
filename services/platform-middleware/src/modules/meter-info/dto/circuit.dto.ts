import { IsNotEmpty } from 'class-validator';
import type { ICircuit, IMeter } from '@tymlez/platform-api-interfaces';

export class CircuitDto implements ICircuit {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  meter: IMeter;

  @IsNotEmpty()
  label: string;
}

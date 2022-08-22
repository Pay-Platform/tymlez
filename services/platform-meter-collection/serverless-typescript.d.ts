import { ValueOf } from 'type-fest';
import type { AWS } from '@serverless/typescript';

export type ServerlessAwsFunctionConfig = ValueOf<Required<AWS>['functions']>;

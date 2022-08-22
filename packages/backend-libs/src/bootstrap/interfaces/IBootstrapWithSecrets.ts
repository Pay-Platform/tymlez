/* eslint-disable camelcase */

import type {
  IBootstrap,
  IMeterDetail,
  ISiteDetail,
  ISolarDetail,
  IUserDetail,
} from './IBootstrap';
import type {
  IMeterSecret,
  ISolarSecret,
  IUserSecret,
} from './IBootstrapSecrets';

export interface IBootstrapWithSecrets extends IBootstrap {
  site_details: Record<string, ISiteDetailWithSecrets>;
  user_details: Record<string, IUserDetailWithSecrets>;
}

export interface ISiteDetailWithSecrets extends ISiteDetail {
  meter_details: Record<string, IMeterDetailWithSecrets>;
  solar_details?: Record<string, ISolarDetailWithSecrets>;
}

export interface IMeterDetailWithSecrets extends IMeterDetail, IMeterSecret {}

export interface ISolarDetailWithSecrets extends ISolarDetail, ISolarSecret {}

export interface IUserDetailWithSecrets extends IUserDetail, IUserSecret {}

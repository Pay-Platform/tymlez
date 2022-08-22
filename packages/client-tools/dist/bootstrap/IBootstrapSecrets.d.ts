export interface IBootstrapSecrets {
    site_details?: Record<string, ISiteSecret | undefined>;
    user_details?: Record<string, IUserSecret | undefined>;
}
export interface ISiteSecret {
    meter_details?: Record<string, IMeterSecret | undefined>;
    solar_details?: Record<string, ISolarSecret | undefined>;
}
export interface IMeterSecret {
    api_key: string;
}
export interface IUserSecret {
    password: string;
}
export interface ISolarSecret {
    inverter_key?: string;
}

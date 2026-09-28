import type {MonitoringConfig} from './monitoring.mjs';
export function getMonitoringConfig(environment?: Record<string,string|undefined>): MonitoringConfig;
export function isPublicLocation(config: MonitoringConfig, location: Location): boolean;

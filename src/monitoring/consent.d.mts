import type { MonitoringConfig } from "./monitoring.mjs";
export type ConsentSnapshot = Readonly<{ available: boolean; open: boolean; choice: "granted" | "denied" | null; message: string }>;
export const CONSENT_KEY: string;
export const EMPTY_SNAPSHOT: ConsentSnapshot;
export interface ConsentController {
  refresh(): void;
  choose(choice: "granted" | "denied"): void;
  openSettings(): void;
  closeSettings(): void;
  getSnapshot(): ConsentSnapshot;
  subscribe(listener: () => void): () => void;
}
export function createConsentController(config: MonitoringConfig, win: Window): ConsentController;

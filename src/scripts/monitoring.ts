import {createMonitor, type Monitor, type MonitoringConfig} from '../monitoring/monitoring.mjs';
import {createConsentController} from '../monitoring/consent.mjs';
let monitor: Monitor | undefined;

export function initMonitoring() {
  const panel=document.querySelector<HTMLElement>('[data-analytics-choice]');
  if (!panel || panel.dataset.initialized) return;
  panel.dataset.initialized='true';
  let config: MonitoringConfig;
  try { config=JSON.parse(panel.dataset.config || '{}'); } catch { return; }
  const controller=createConsentController(config,window);
  monitor=createMonitor(config,window);
  const available=panel.querySelector<HTMLElement>('[data-analytics-available]')!;
  const unavailable=panel.querySelector<HTMLElement>('[data-analytics-unavailable]')!;
  const actions=panel.querySelector<HTMLElement>('[data-analytics-actions]')!;
  const message=panel.querySelector<HTMLElement>('[data-analytics-message]')!;
  let settingsTrigger: HTMLElement | undefined;
  const render=()=>{
    const state=controller.getSnapshot();
    panel.hidden=!state.open; available.hidden=!state.available;
    unavailable.hidden=state.available; actions.hidden=!state.available;
    message.textContent=state.message; message.hidden=!state.message;
    if (!state.open) settingsTrigger?.focus();
  };
  controller.subscribe(render);
  document.querySelectorAll<HTMLElement>('[data-analytics-settings]').forEach(button=>button.addEventListener('click',()=>{
    settingsTrigger=button; controller.openSettings();
    panel.querySelector<HTMLButtonElement>(controller.getSnapshot().available ? '[data-analytics-allow]' : '[data-analytics-close]')?.focus();
  }));
  panel.querySelector('[data-analytics-allow]')?.addEventListener('click',()=>controller.choose('granted'));
  panel.querySelector('[data-analytics-decline]')?.addEventListener('click',()=>controller.choose('denied'));
  panel.querySelector('[data-analytics-close]')?.addEventListener('click',()=>controller.closeSettings());
  panel.addEventListener('keydown',event=>{if(event.key==='Escape')controller.closeSettings();});
  window.addEventListener('pageshow',()=>controller.refresh());
  controller.refresh();
}

/** Called only after the same-origin server accepts an inquiry. No contact fields enter analytics. */
export async function recordAcceptedInquiry(receipt: string) {
  return monitor?.confirmLead({receipt,formType:'recommendation'}) ?? false;
}

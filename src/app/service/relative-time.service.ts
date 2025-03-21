import { Injectable } from '@angular/core';

const DATE_UNITS: Record<string, number> = {
  year: 31536000,
  month: 2629800,
  day: 86400,
  hour: 3600,
  minute: 60,
  second: 1
};

@Injectable({
  providedIn: 'root'
})


export class RelativeTimeService {
  private rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

  constructor() {}

  getRelativeTime(timestamp: string | number | Date): string {
    const from = new Date(timestamp).getTime();
    const now = new Date().getTime();
    const elapsed = (from - now) / 1000; // Diferencia en segundos

    for (const unit in DATE_UNITS) {
      if (Math.abs(elapsed) > DATE_UNITS[unit]) {
        return this.rtf.format(Math.floor(elapsed / DATE_UNITS[unit]), unit as Intl.RelativeTimeFormatUnit);
      }
    }
    return this.rtf.format(0, 'second'); 
  }
}
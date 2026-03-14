import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toast$ = new BehaviorSubject<Toast | null>(null);
  currentToast = this.toast$.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success', duration: number = 3000) {
    this.toast$.next({ message, type, duration });
    setTimeout(() => this.toast$.next(null), duration);
  }

  success(message: string) { this.show(message, 'success'); }
  error(message: string) { this.show(message, 'error', 4000); }
  info(message: string) { this.show(message, 'info'); }
  warning(message: string) { this.show(message, 'warning', 4000); }
}

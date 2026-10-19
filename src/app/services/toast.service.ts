import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Toast, ToastType } from '../models/toast.interface';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();

  private counter = 0;

  show(message: string, type: ToastType = 'info', duration: number = 3500): string {
    const id = `toast-${Date.now()}-${++this.counter}`;
    const newToast: Toast = { id, message, type, duration };

    const currentToasts = this.toastsSubject.getValue();
    // Keep at most 5 toasts visible at once
    const updated = [...currentToasts, newToast].slice(-5);
    this.toastsSubject.next(updated);

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    return id;
  }

  success(message: string, duration: number = 3500): string {
    return this.show(message, 'success', duration);
  }

  error(message: string, duration: number = 4500): string {
    return this.show(message, 'error', duration);
  }

  info(message: string, duration: number = 3500): string {
    return this.show(message, 'info', duration);
  }

  warning(message: string, duration: number = 4000): string {
    return this.show(message, 'warning', duration);
  }

  dismiss(id: string): void {
    const currentToasts = this.toastsSubject.getValue();
    const updated = currentToasts.filter((t) => t.id !== id);
    if (updated.length !== currentToasts.length) {
      this.toastsSubject.next(updated);
    }
  }

  clear(): void {
    this.toastsSubject.next([]);
  }
}

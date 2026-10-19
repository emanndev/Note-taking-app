import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { Toast, ToastType } from '../../models/toast.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit, OnDestroy {
  // Direct inputs for backward compatibility with local usage
  @Input() message: string = '';
  @Input() show: boolean = false;
  @Input() type: ToastType = 'success';

  // Global toasts stream
  toasts: Toast[] = [];
  private sub?: Subscription;

  constructor(public toastService: ToastService) {}

  ngOnInit(): void {
    this.sub = this.toastService.toasts$.subscribe((toasts) => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }

  closeLocal(): void {
    this.show = false;
  }
}
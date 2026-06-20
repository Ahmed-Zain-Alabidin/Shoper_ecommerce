import { Component, input, output, OnInit, signal } from '@angular/core';
import { LucideCheckCircle, LucideXCircle, LucideX } from '@lucide/angular';

export type ToastType = 'success' | 'error' | 'info';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [LucideCheckCircle, LucideXCircle, LucideX],
  template: `
    <div
      class="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-semibold transition-all duration-300"
      [class]="visible() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
      [class.bg-white]="true"
      [class.border-green-200]="type() === 'success'"
      [class.text-green-800]="type() === 'success'"
      [class.border-red-200]="type() !== 'success'"
      [class.text-red-800]="type() !== 'success'"
    >
      @if (type() === 'success') {
        <svg lucideCheckCircle class="w-5 h-5 text-green-500 flex-shrink-0"></svg>
      } @else {
        <svg lucideXCircle class="w-5 h-5 text-red-500 flex-shrink-0"></svg>
      }
      <span>{{ message() }}</span>
      <button
        type="button"
        (click)="dismiss()"
        class="ml-2 text-gray-400 hover:text-gray-700 transition-colors"
      >
        <svg lucideX class="w-4 h-4"></svg>
      </button>
    </div>
  `,
})
export class ToastComponent implements OnInit {
  readonly message = input.required<string>();
  readonly type = input<ToastType>('success');
  readonly closed = output<void>();

  readonly visible = signal(true);
  private closeTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.closeTimer = setTimeout(() => this.dismiss(), 3500);
  }

  dismiss(): void {
    this.visible.set(false);
    setTimeout(() => this.closed.emit(), 300);
    if (this.closeTimer) clearTimeout(this.closeTimer);
  }
}

import { Component, input, output } from '@angular/core';
import { LucideCheck } from '@lucide/angular';
import { Address } from '../../../core/models/address.model';

@Component({
  selector: 'app-address-card',
  standalone: true,
  imports: [LucideCheck],
  template: `
    <div
      (click)="onSelect.emit(address()._id)"
      class="p-5 rounded-2xl border-2 cursor-pointer transition-all relative"
      [class.border-black]="isSelected()"
      [class.bg-gray-50]="isSelected()"
      [class.shadow-sm]="isSelected()"
      [class.border-gray-200]="!isSelected()"
      [class.bg-white]="!isSelected()"
      [class.hover:border-gray-300]="!isSelected()"
    >
      @if (isSelected()) {
        <div class="absolute top-4 right-4 text-black">
          <svg lucideCheck class="w-5 h-5 stroke-[3]"></svg>
        </div>
      }

      <div class="flex items-center justify-between mb-3">
        <span class="font-extrabold text-gray-900 uppercase tracking-wide text-sm">
          {{ address().alias || 'Address' }}
        </span>
      </div>
      <div class="space-y-1">
        <p class="text-sm font-medium text-gray-800">{{ address().street }}</p>
        <p class="text-sm text-gray-600">{{ address().city }}, {{ address().postalCode }}</p>
        <p class="text-sm text-gray-600 pt-2 flex items-center">
          <span class="text-gray-400 mr-2">Phone:</span>
          <span class="font-medium text-gray-900">{{ address().phone }}</span>
        </p>
      </div>
    </div>
  `,
})
export class AddressCardComponent {
  readonly address = input.required<Address>();
  readonly isSelected = input(false);
  readonly onSelect = output<string>();
}

import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { ProductFormComponent } from '../../../../shared/components/product-form/product-form.component';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, ProductFormComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar />
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        @if (productId()) {
          <app-product-form [productId]="productId()!" />
        }
      </div>
      <app-footer />
    </div>
  `,
})
export class EditProductComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly productId = signal<string | null>(null);

  ngOnInit(): void {
    this.productId.set(this.route.snapshot.paramMap.get('id'));
  }
}

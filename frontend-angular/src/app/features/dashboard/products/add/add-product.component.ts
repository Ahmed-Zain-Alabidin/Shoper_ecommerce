import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { ProductFormComponent } from '../../../../shared/components/product-form/product-form.component';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, ProductFormComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar />
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <app-product-form />
      </div>
      <app-footer />
    </div>
  `,
})
export class AddProductComponent {}

import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CategoryCardComponent } from '../../shared/components/category-card/category-card.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Category } from '../../core/models/category.model';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-shared-preview',
  standalone: true,
  imports: [NavbarComponent, HeroComponent, FooterComponent, CategoryCardComponent, ProductCardComponent],
  template: `
    <main class="min-h-screen bg-white">
      <app-navbar />
      <app-hero />

      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Shared Components Preview</h2>
        <p class="text-gray-500 mb-8">Phase 0 + Step 2 migration scaffold — layouts and pages come next.</p>

        <h3 class="text-lg font-bold text-gray-900 mb-4">Category Card</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          <app-category-card [category]="sampleCategory" />
        </div>

        <h3 class="text-lg font-bold text-gray-900 mb-4">Product Card</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <app-product-card [product]="sampleProduct" />
        </div>
      </section>

      <app-footer />
    </main>
  `,
})
export class SharedPreviewComponent {
  readonly sampleCategory: Category = {
    _id: 'preview-category',
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop',
  };

  readonly sampleProduct: Product = {
    _id: 'preview-product',
    name: 'Premium Wireless Headphones',
    price: 149.99,
    originalPrice: 199.99,
    discountPercentage: 25,
    currency: 'USD',
    stock: 12,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop'],
    category: { _id: 'cat-1', name: 'Electronics' },
    ratingsAverage: 4.5,
    ratingsQuantity: 128,
    createdAt: new Date().toISOString(),
  };
}

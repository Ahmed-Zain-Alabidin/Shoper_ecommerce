import {
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LucideArrowLeft,
  LucideImagePlus,
  LucideLoader2,
  LucideUpload,
  LucideX,
} from '@lucide/angular';
import { firstValueFrom } from 'rxjs';
import { Category } from '../../../core/models/category.model';
import { ProductFormValue } from '../../../core/models/product.model';
import { AuthService } from '../../../core/services/auth.service';
import { CategoryService } from '../../../core/services/category.service';
import { ProductService } from '../../../core/services/product.service';
import { ToastComponent, ToastType } from '../toast/toast.component';

const EMPTY_FORM: ProductFormValue = {
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  currency: 'USD',
  stock: '',
  category: '',
};

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    FormsModule,
    LucideArrowLeft,
    LucideUpload,
    LucideX,
    LucideImagePlus,
    LucideLoader2,
    ToastComponent,
  ],
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit {
  readonly productId = input<string>();

  private readonly router = inject(Router);
  readonly authService = inject(AuthService);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);

  readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  readonly form = signal<ProductFormValue>({ ...EMPTY_FORM });
  readonly categories = signal<Category[]>([]);
  readonly imageFiles = signal<File[]>([]);
  readonly existingImages = signal<string[]>([]);
  readonly previews = signal<string[]>([]);
  readonly isDragging = signal(false);
  readonly isLoading = signal(false);
  readonly isSubmitting = signal(false);
  readonly error = signal('');
  readonly toast = signal<{ message: string; type: ToastType } | null>(null);

  readonly isEdit = () => Boolean(this.productId());

  ngOnInit(): void {
    this.loadCategories();
    if (this.isEdit()) {
      this.isLoading.set(true);
      this.loadProduct();
    }
  }

  totalImages(): number {
    return this.existingImages().length + this.imageFiles().length;
  }

  discountPreview(): { save: string; percent: number } | null {
    const f = this.form();
    if (!f.originalPrice || !f.price) return null;
    const original = parseFloat(f.originalPrice);
    const current = parseFloat(f.price);
    if (original <= current) return null;
    const symbol = f.currency === 'USD' ? '$' : 'EGP ';
    return {
      save: `${symbol}${(original - current).toFixed(2)}`,
      percent: Math.round(((original - current) / original) * 100),
    };
  }

  updateForm(patch: Partial<ProductFormValue>): void {
    this.form.update((current) => ({ ...current, ...patch }));
  }

  private async loadCategories(): Promise<void> {
    try {
      const res = await firstValueFrom(this.categoryService.getCategories());
      this.categories.set(res.data ?? []);
    } catch {
      /* ignore */
    }
  }

  private async loadProduct(): Promise<void> {
    const id = this.productId();
    if (!id) return;
    try {
      const res = await firstValueFrom(this.productService.getProductById(id));
      const p = res.data!;
      this.form.set({
        name: p.name || '',
        description: p.description || '',
        price: String(p.price ?? ''),
        originalPrice: String(p.originalPrice ?? ''),
        currency: p.currency || 'USD',
        stock: String(p.stock ?? ''),
        category:
          typeof p.category === 'object'
            ? p.category?._id || ''
            : p.category || '',
      });
      this.existingImages.set(p.images || []);
    } catch {
      this.error.set('Failed to load product data.');
    } finally {
      this.isLoading.set(false);
    }
  }

  addFiles(files: FileList | null): void {
    if (!files) return;
    const valid = Array.from(files).filter((f) => f.type.startsWith('image/'));
    this.imageFiles.update((prev) => [...prev, ...valid].slice(0, 5));
    this.previews.set(this.imageFiles().map((f) => URL.createObjectURL(f)));
  }

  removeNewFile(index: number): void {
    this.imageFiles.update((prev) => prev.filter((_, i) => i !== index));
    this.previews.set(this.imageFiles().map((f) => URL.createObjectURL(f)));
  }

  removeExistingImage(index: number): void {
    this.existingImages.update((prev) => prev.filter((_, i) => i !== index));
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    this.addFiles(event.dataTransfer?.files ?? null);
  }

  openFilePicker(): void {
    this.fileInput()?.nativeElement.click();
  }

  async submit(event: Event): Promise<void> {
    event.preventDefault();
    this.error.set('');
    const f = this.form();

    if (f.originalPrice && parseFloat(f.originalPrice) <= parseFloat(f.price)) {
      this.error.set('Original price must be greater than the current price.');
      return;
    }

    this.isSubmitting.set(true);
    try {
      const data = new FormData();
      data.append('name', f.name);
      data.append('description', f.description);
      const priceValue = parseFloat(f.price);
      data.append(
        'price',
        Number.isNaN(priceValue) ? '0' : priceValue.toString(),
      );
      data.append('currency', f.currency);
      if (f.originalPrice) {
        const originalPriceValue = parseFloat(f.originalPrice);
        if (!Number.isNaN(originalPriceValue)) {
          data.append('originalPrice', originalPriceValue.toString());
        }
      } else {
        data.append('originalPrice', '');
      }
      const stockValue = parseInt(f.stock, 10);
      data.append(
        'stock',
        Number.isNaN(stockValue) ? '0' : stockValue.toString(),
      );
      data.append('category', f.category);
      this.imageFiles().forEach((file) => data.append('images', file));
      this.existingImages().forEach((url) => data.append('existingImages', url));

      if (this.isEdit()) {
        await firstValueFrom(
          this.productService.updateProduct(this.productId()!, data),
        );
        this.toast.set({
          message: 'Product updated successfully.',
          type: 'success',
        });
      } else {
        await firstValueFrom(this.productService.createProduct(data));
        this.toast.set({
          message: 'Product created successfully.',
          type: 'success',
        });
        this.form.set({ ...EMPTY_FORM });
        this.imageFiles.set([]);
        this.existingImages.set([]);
        this.previews.set([]);
      }

      setTimeout(() => this.router.navigate(['/dashboard/products']), 1200);
    } catch (err: unknown) {
      const error = err as { error?: { message?: string } };
      this.error.set(
        error.error?.message || 'Something went wrong. Please try again.',
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard/products']);
  }
}

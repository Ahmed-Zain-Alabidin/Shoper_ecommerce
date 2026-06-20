import { Component, ElementRef, OnInit, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { AuthService } from '../../../core/services/auth.service';
import { Category } from '../../../core/models/category.model';
import { API_ENDPOINTS, getCategoryUrl } from '../../../core/services/api.endpoints';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './admin-categories.component.html',
})
export class AdminCategoriesComponent implements OnInit {
  private readonly http = inject(HttpClient);
  readonly authService = inject(AuthService);
  readonly fileInputRef = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  readonly categories = signal<Category[]>([]);
  readonly isLoading = signal(true);
  readonly isModalOpen = signal(false);
  readonly editTarget = signal<Category | null>(null);
  readonly deleteTarget = signal<Category | null>(null);
  readonly isSubmitting = signal(false);
  readonly isDeleting = signal(false);
  readonly toast = signal<{ message: string; type: string } | null>(null);

  formName = '';
  imageFile: File | null = null;
  imagePreview = '';
  formError = '';

  ngOnInit(): void {
    this.http.get<any>(API_ENDPOINTS.CATEGORIES).subscribe({
      next: r => { this.categories.set(r.data || []); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }

  openAdd(): void {
    this.editTarget.set(null); this.formName = '';
    this.imageFile = null; this.imagePreview = ''; this.formError = '';
    this.isModalOpen.set(true);
  }

  openEdit(cat: Category): void {
    this.editTarget.set(cat); this.formName = cat.name;
    this.imageFile = null; this.imagePreview = cat.image || ''; this.formError = '';
    this.isModalOpen.set(true);
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.imageFile = file;
    this.imagePreview = URL.createObjectURL(file);
  }

  clearImage(): void { this.imageFile = null; this.imagePreview = ''; }

  triggerFileInput(): void {
    this.fileInputRef()?.nativeElement.click();
  }

  submit(): void {
    if (!this.formName.trim()) { this.formError = 'Category name is required.'; return; }
    this.isSubmitting.set(true); this.formError = '';

    const data = new FormData();
    data.append('name', this.formName.trim());
    if (this.imageFile) data.append('image', this.imageFile);

    const headers = { ...this.authService.getAuthHeader() };
    const edit = this.editTarget();

    const req = edit
      ? this.http.put<any>(getCategoryUrl(edit._id), data, { headers })
      : this.http.post<any>(API_ENDPOINTS.CATEGORIES, data, { headers });

    req.subscribe({
      next: (res) => {
        if (edit) {
          this.categories.update(cs => cs.map(c => c._id === edit._id ? res.data : c));
          this.showToast('Category updated successfully.');
        } else {
          this.categories.update(cs => [...cs, res.data]);
          this.showToast('Category created successfully.');
        }
        this.isModalOpen.set(false);
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.formError = err.error?.message || 'Something went wrong.';
        this.isSubmitting.set(false);
      },
    });
  }

  confirmDelete(): void {
    const t = this.deleteTarget();
    if (!t) return;
    this.isDeleting.set(true);
    this.http.delete<any>(getCategoryUrl(t._id), { headers: this.authService.getAuthHeader() }).subscribe({
      next: () => {
        this.categories.update(cs => cs.filter(c => c._id !== t._id));
        this.showToast(`"${t.name}" deleted.`);
        this.deleteTarget.set(null); this.isDeleting.set(false);
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Failed to delete.', 'error');
        this.deleteTarget.set(null); this.isDeleting.set(false);
      },
    });
  }

  private showToast(message: string, type = 'success'): void {
    this.toast.set({ message, type });
    setTimeout(() => this.toast.set(null), 3500);
  }
}

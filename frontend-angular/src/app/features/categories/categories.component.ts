import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CategoryCardComponent } from '../../shared/components/category-card/category-card.component';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent, CategoryCardComponent],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);

  readonly categories = signal<Category[]>([]);
  readonly isLoading = signal(true);

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories.set((res.data || []).filter((c: Category) => c && c._id));
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}

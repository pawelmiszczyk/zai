import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoryModalComponent } from '../category-modal/category-modal.component';
import { Category } from '../model/category';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css']
})
export class CategoryManagementComponent implements OnInit {

  categories: Category[];

  constructor(public dialog: MatDialog, private categoryService: CategoryService) {
    this.categories = [];
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  openAddCategoryModal(): void {
    const dialogRef = this.dialog.open(CategoryModalComponent, {
      width: '400px',
      data: { isNewCategory: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.addCategory(result);
        this.loadCategories();
      }
    });
  }

  openEditCategoryModal(category: Category): void {
    const dialogRef = this.dialog.open(CategoryModalComponent, {
      width: '400px',
      data: { category, isNewCategory: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.editCategory(result);
        this.loadCategories();
      }
    });
  }

  deleteCategory(categoryId: number): void {
    this.categoryService.deleteCategory(categoryId).subscribe(() => {
      this.loadCategories();
    });
  }

}

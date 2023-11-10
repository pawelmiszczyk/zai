import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { Category } from '../model/category';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.css']
})
export class CategoryModalComponent {

  currentCategory: Category = {
    category_id: 0,
    category_name: '',
    category_color: '#000000'
  }
  isNewCategory: boolean;

  constructor(
    public dialogRef: MatDialogRef<CategoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.category !== undefined && data.category !== null) {
      this.currentCategory.category_id = data.category.category_id;
      this.currentCategory.category_name = data.category.category_name;
      this.currentCategory.category_color = data.category.category_color;
    }
    this.isNewCategory = data.isNewCategory;
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.dialogRef.close(this.currentCategory);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}

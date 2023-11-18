import { Component, Inject, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { Category } from '../model/category';
import { PrimeIcons } from "primeng/api"; 

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.css']
})
export class CategoryModalComponent {

  currentCategory: Category = {
    category_id: 0,
    category_name: '',
    category_color: '#000000',
    category_icon: ''
  }
  isNewCategory: boolean;

  iconOptions = [
    { label: 'Kąt w dół', value: PrimeIcons.ANGLE_DOWN },
    { label: 'Kąt w górę', value: PrimeIcons.ANGLE_UP },
    { label: 'Strzałka w lewo', value: PrimeIcons.ARROW_LEFT },
    { label: 'Strzałka w prawo', value: PrimeIcons.ARROW_RIGHT },
    { label: 'Zwinięcie w dół', value: PrimeIcons.CHEVRON_DOWN },
    { label: 'Zwinięcie w lewo', value: PrimeIcons.CHEVRON_LEFT },
    { label: 'Zwinięcie w prawo', value: PrimeIcons.CHEVRON_RIGHT },
    { label: 'Zwinięcie w górę', value: PrimeIcons.CHEVRON_UP },
    { label: 'Koło', value: PrimeIcons.CIRCLE },
    { label: 'Koło z wypełnieniem', value: PrimeIcons.CIRCLE_FILL },
    { label: 'Zegar', value: PrimeIcons.CLOCK },
    { label: 'Klonowanie', value: PrimeIcons.CLONE },
    { label: 'Chmura', value: PrimeIcons.CLOUD },
    { label: 'Pobieranie chmury', value: PrimeIcons.CLOUD_DOWNLOAD },
    { label: 'Wysyłanie do chmury', value: PrimeIcons.CLOUD_UPLOAD },
    { label: 'Kod', value: PrimeIcons.CODE },
    { label: 'Koło zębate', value: PrimeIcons.COG },
    { label: 'Komentarz', value: PrimeIcons.COMMENT },
    { label: 'Dolar', value: PrimeIcons.DOLLAR },
    { label: 'Chmura', value: PrimeIcons.CLOUD }
  ];

  iconSelectionChange = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<CategoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.category !== undefined && data.category !== null) {
      this.currentCategory.category_id = data.category.category_id;
      this.currentCategory.category_name = data.category.category_name;
      this.currentCategory.category_color = data.category.category_color;
      this.currentCategory.category_icon = data.category.category_icon;
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

  onIconChange(): void {
    // Aktualizuj listę lub wykonaj inne działania po zmianie ikony
    // Tu możesz wywołać funkcję, która uzupełni listę
    this.iconSelectionChange.emit();
  }

}

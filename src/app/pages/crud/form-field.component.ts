
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  imports: [ CommonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    CheckboxModule,
    InputNumberModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ReactiveFormsModule,
    DropdownModule
  ],
  standalone: true
})
export class FormFieldComponent {
  @Input() formGroup!: FormGroup;
  @Input() name!: string;
  @Input() label!: string;
  @Input() type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' = 'text';
  @Input() options: any[] = [];
  @Input() optionLabel: string = 'label';
  @Input() optionValue: string = 'value';

  get control(): FormControl {
    const ctrl = this.formGroup.get(this.name);
    if (!ctrl) {
      throw new Error(`Le contrôle '${this.name}' est introuvable dans le formGroup`);
    }
    return ctrl as FormControl;
  }

  get showError() {
    return this.control && this.control.invalid && this.control.touched;
  }

  get firstErrorMessage() {
    const control = this.control;
    if (!control || !control.errors) return null;
  
    if (control.errors['required']) return 'Ce champ est requis';
    if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
    if (control.errors['maxlength']) return `Maximum ${control.errors['maxlength'].requiredLength} caractères`;
    if (control.errors['min']) return `Valeur minimale : ${control.errors['min'].min}`;
    if (control.errors['max']) return `Valeur maximale : ${control.errors['max'].max}`;
  
    return 'Champ invalide';
  }
}


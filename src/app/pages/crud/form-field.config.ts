import { ValidatorFn, Validators } from '@angular/forms';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select';
  placeholder?: string;
  options?: { label: string; value: any }[];
  validators?: ValidatorFn[];
  directives?: string[];
}
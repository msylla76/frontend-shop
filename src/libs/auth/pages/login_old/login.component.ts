import { InputErrorsComponent } from '@libs/core/forms/input-errors/input-errors.component';
import { ListErrorsComponent } from '@libs/core/forms/list-errors/list-errors.component';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthStore } from '@libs/auth/store/auth.store';

@Component({
  selector: 'cdt-login',
  templateUrl: './login.component.html',
  imports: [ListErrorsComponent, RouterLink, ReactiveFormsModule, InputErrorsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authStore = inject(AuthStore);
  private readonly fb = inject(FormBuilder);
  private readonly router=inject(Router);

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    this.authStore.login(this.form.getRawValue());
    this.form.reset();
    this.router.navigate(['/']);
  }
}

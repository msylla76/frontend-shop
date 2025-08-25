import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../../app/layout/component/app.floatingconfigurator';

import { ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '@libs/auth/store/auth.store';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
      ButtonModule, 
      CheckboxModule, 
      InputTextModule, 
      PasswordModule, 
      FormsModule, 
      RouterModule, 
      RippleModule, 
      AppFloatingConfigurator,
      ReactiveFormsModule
    ],
    templateUrl: './login.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,

})
export class Login {
    private readonly authStore = inject(AuthStore);
    private readonly fb = inject(FormBuilder);


    form = this.fb.nonNullable.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    onSubmit() {
      this.authStore.login(this.form.getRawValue());
    }

}

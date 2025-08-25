import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from '@libs/auth/pages/login/login.component';
import { Error } from './error';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login }
] as Routes;

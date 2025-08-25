import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { CompteComponent } from '@app/module/parametre/pages/compte/compte.component';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from '@libs/core//pages/landing/landing';
import { Notfound } from '@libs/core/pages/notfound/notfound';
import { authGuard } from '@libs/auth/service/auth-guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        // canActivate: [authGuard],
        children: [
            { path: '', component: Dashboard },
            { path: 'compte', component: CompteComponent },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];

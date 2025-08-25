import { Routes } from '@angular/router';
import { CompterComponent } from './pages/compter/compter.component';
import { CompteComponent } from './pages/compte/compte.component';
import { ModeComponent } from './pages/mode/mode.component';


export const parametre_ROUTES: Routes = [
  { path: 'compter', component: CompterComponent },
    { path: 'compte', component: CompteComponent },
    { path: 'mode', component: ModeComponent },
    
];

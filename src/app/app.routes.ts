import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'heroes',
  },
  {
    path: 'heroes',
    loadChildren: () =>
      import('./features/heroes/routes/heroes.routes').then((m) => m.heroesRoutes),
  },
  {
    path: '**',
    redirectTo: 'heroes',
  },
];

import { Routes } from '@angular/router';

import { HeroFormPage } from '../pages/hero-form-page/hero-form-page';
import { HeroesPage } from '../pages/heroes-page/heroes-page';

export const heroesRoutes: Routes = [
  {
    path: '',
    component: HeroesPage,
  },
  {
    path: 'new',
    component: HeroFormPage,
  },
  {
    path: ':id/edit',
    component: HeroFormPage,
  },
];

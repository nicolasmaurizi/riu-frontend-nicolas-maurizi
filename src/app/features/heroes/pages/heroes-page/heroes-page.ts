import { Component } from '@angular/core';

import { HeroesHome } from '../../components/heroes-home/heroes-home';
import { LayoutShell } from '../../../../shared/components/layout-shell/layout-shell';

@Component({
  selector: 'app-heroes-page',
  standalone: true,
  imports: [LayoutShell, HeroesHome],
  templateUrl: './heroes-page.html',
  styleUrl: './heroes-page.scss',
})
export class HeroesPage {}

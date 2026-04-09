import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { Hero } from '../../models/hero.model';
import { INITIAL_HEROES } from '../../services/heroes.service';

interface HeroRow extends Hero {
  publisher: string;
  alignment: string;
}

@Component({
  selector: 'app-heroes-home',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
  ],
  templateUrl: './heroes-home.html',
  styleUrl: './heroes-home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroesHome {
  readonly displayedColumns = ['image', 'name', 'publisher', 'alignment', 'actions'];
  readonly pageSizeOptions = [2, 4, 8];

  readonly heroes: HeroRow[] = INITIAL_HEROES.map((hero) => ({
    ...hero,
    publisher: hero.universe,
    alignment: this.resolveAlignment(hero.universe),
  }));

  readonly pageIndex = signal(0);
  readonly pageSize = signal(4);
  readonly totalHeroes = this.heroes.length;

  readonly pagedHeroes = computed(() => {
    const startIndex = this.pageIndex() * this.pageSize();
    return this.heroes.slice(startIndex, startIndex + this.pageSize());
  });

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  onAddHero(hero?: HeroRow): void {
    void hero;
  }

  onEditHero(hero: HeroRow): void {
    void hero;
  }

  onDeleteHero(hero: HeroRow): void {
    void hero;
  }

  private resolveAlignment(universe: string): string {
    return universe === 'Otro' ? 'Neutral' : 'Hero';
  }
}

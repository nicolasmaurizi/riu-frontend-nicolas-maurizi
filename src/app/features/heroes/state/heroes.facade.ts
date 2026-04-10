import { computed, inject, Injectable, signal } from '@angular/core';

import { HeroFormValue } from '../models/hero-form.model';
import { Hero } from '../models/hero.model';
import { HeroesService } from '../services/heroes.service';

@Injectable({
  providedIn: 'root',
})
export class HeroesFacade {
  private readonly heroesService = inject(HeroesService);

  readonly filter = signal('');
  readonly page = signal(1);
  readonly pageSize = signal(5);

  readonly heroes = this.heroesService.heroes;

  readonly filteredHeroes = computed(() => {
    const term = this.filter().trim();

    return term ? this.heroesService.searchByName(term) : this.heroes();
  });

  readonly pagedHeroes = computed(() => {
    const currentPage = this.page();
    const currentPageSize = this.pageSize();
    const startIndex = (currentPage - 1) * currentPageSize;

    return this.filteredHeroes().slice(startIndex, startIndex + currentPageSize);
  });

  readonly totalHeroes = computed(() => this.filteredHeroes().length);

  setFilter(value: string): void {
    this.filter.set(value);
    this.page.set(1);
  }

  setPage(page: number): void {
    this.page.set(Math.max(1, page));
  }

  createHero(payload: HeroFormValue): Hero {
    const hero = this.heroesService.create(payload);
    const maxPage = this.getMaxPage();

    this.page.set(maxPage);

    return hero;
  }

  updateHero(id: number, payload: HeroFormValue): Hero | undefined {
    return this.heroesService.update(id, payload);
  }

  deleteHero(id: number): boolean {
    const wasDeleted = this.heroesService.delete(id);

    if (!wasDeleted) {
      return false;
    }

    this.page.set(Math.min(this.page(), this.getMaxPage()));

    return true;
  }

  private getMaxPage(): number {
    return Math.max(1, Math.ceil(this.totalHeroes() / this.pageSize()));
  }
}

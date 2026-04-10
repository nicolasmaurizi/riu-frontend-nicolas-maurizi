import { Injectable } from '@angular/core';

import { Hero } from '../models/hero.model';

const HEROES_STORAGE_KEY = 'heroes-app.heroes';

@Injectable({
  providedIn: 'root',
})
export class HeroesPersistenceService {
  load(initialHeroes: Hero[]): Hero[] {
    if (typeof window === 'undefined') {
      return initialHeroes;
    }

    const storedHeroes = localStorage.getItem(HEROES_STORAGE_KEY);

    if (!storedHeroes) {
      this.save(initialHeroes);
      return initialHeroes;
    }

    try {
      const parsedHeroes = JSON.parse(storedHeroes) as Hero[];

      if (!Array.isArray(parsedHeroes) || parsedHeroes.length === 0) {
        this.save(initialHeroes);
        return initialHeroes;
      }

      return parsedHeroes;
    } catch {
      this.save(initialHeroes);
      return initialHeroes;
    }
  }

  save(heroes: Hero[]): void {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(HEROES_STORAGE_KEY, JSON.stringify(heroes));
  }
}

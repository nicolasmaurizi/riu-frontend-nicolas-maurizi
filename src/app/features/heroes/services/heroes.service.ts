import { Injectable, Signal, WritableSignal, computed, signal } from '@angular/core';

import { HeroFormValue } from '../models/hero-form.model';
import { Hero } from '../models/hero.model';

const HEROES_STORAGE_KEY = 'heroes-app.heroes';

export const INITIAL_HEROES: Hero[] = [
  {
    id: 1,
    name: 'Peter Parker',
    alias: 'Spider-Man',
    imageUrl: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=800&q=80',
    universe: 'Marvel',
    powerLevel: 88,
    speed: 75,
    intelligence: 92,
    createdAt: '2026-04-09T10:00:00.000Z',
    updatedAt: '2026-04-09T10:00:00.000Z',
  },
  {
    id: 2,
    name: 'Bruce Wayne',
    alias: 'Batman',
    imageUrl: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=800&q=80',
    universe: 'DC',
    powerLevel: 79,
    speed: 68,
    intelligence: 98,
    createdAt: '2026-04-09T10:05:00.000Z',
    updatedAt: '2026-04-09T10:05:00.000Z',
  },
  {
    id: 3,
    name: 'Diana Prince',
    alias: 'Wonder Woman',
    imageUrl: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80',
    universe: 'DC',
    powerLevel: 95,
    speed: 84,
    intelligence: 86,
    createdAt: '2026-04-09T10:10:00.000Z',
    updatedAt: '2026-04-09T10:10:00.000Z',
  },
  {
    id: 4,
    name: 'Tony Stark',
    alias: 'Iron Man',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    universe: 'Marvel',
    powerLevel: 90,
    speed: 72,
    intelligence: 99,
    createdAt: '2026-04-09T10:15:00.000Z',
    updatedAt: '2026-04-09T10:15:00.000Z',
  },
];

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private readonly heroesState: WritableSignal<Hero[]> = signal(this.loadInitialHeroes());

  readonly heroes: Signal<Hero[]> = computed(() => this.heroesState());

  private nextId = this.calculateNextId(this.heroesState());

  getAll(): Hero[] {
    return this.heroesState();
  }

  getById(id: number): Hero | undefined {
    return this.heroesState().find((hero) => hero.id === id);
  }

  searchByName(term: string): Hero[] {
    const normalizedTerm = term.trim().toLowerCase();

    if (!normalizedTerm) {
      return this.heroesState();
    }

    return this.heroesState().filter((hero) =>
      hero.name.toLowerCase().includes(normalizedTerm) ||
      hero.alias?.toLowerCase().includes(normalizedTerm),
    );
  }

  create(payload: HeroFormValue): Hero {
    const timestamp = new Date().toISOString();

    const hero: Hero = {
      id: this.nextId++,
      name: payload.name.trim(),
      alias: payload.alias?.trim() || undefined,
      imageUrl: payload.imageUrl.trim(),
      universe: payload.universe,
      powerLevel: payload.powerLevel ?? 0,
      speed: payload.speed ?? 0,
      intelligence: payload.intelligence ?? 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.heroesState.update((heroes) => {
      const updatedHeroes = [...heroes, hero];
      this.persistHeroes(updatedHeroes);
      return updatedHeroes;
    });

    return hero;
  }

  update(id: number, payload: HeroFormValue): Hero | undefined {
    const currentHero = this.getById(id);

    if (!currentHero) {
      return undefined;
    }

    const updatedHero: Hero = {
      ...currentHero,
      name: payload.name.trim(),
      alias: payload.alias?.trim() || undefined,
      imageUrl: payload.imageUrl.trim(),
      universe: payload.universe,
      powerLevel: payload.powerLevel ?? 0,
      speed: payload.speed ?? 0,
      intelligence: payload.intelligence ?? 0,
      updatedAt: new Date().toISOString(),
    };

    this.heroesState.update((heroes) => {
      const updatedHeroes = heroes.map((hero) => (hero.id === id ? updatedHero : hero));
      this.persistHeroes(updatedHeroes);
      return updatedHeroes;
    });

    return updatedHero;
  }

  delete(id: number): boolean {
    const currentHeroes = this.heroesState();
    const exists = currentHeroes.some((hero) => hero.id === id);

    if (!exists) {
      return false;
    }

    this.heroesState.update((heroes) => {
      const updatedHeroes = heroes.filter((hero) => hero.id !== id);
      this.persistHeroes(updatedHeroes);
      return updatedHeroes;
    });

    return true;
  }

  reset(): void {
    this.heroesState.set(INITIAL_HEROES);
    this.persistHeroes(INITIAL_HEROES);
    this.nextId = this.calculateNextId(INITIAL_HEROES);
  }

  private loadInitialHeroes(): Hero[] {
    if (typeof window === 'undefined') {
      return INITIAL_HEROES;
    }

    const storedHeroes = localStorage.getItem(HEROES_STORAGE_KEY);

    if (!storedHeroes) {
      localStorage.setItem(HEROES_STORAGE_KEY, JSON.stringify(INITIAL_HEROES));
      return INITIAL_HEROES;
    }

    try {
      const parsedHeroes = JSON.parse(storedHeroes) as Hero[];

      if (!Array.isArray(parsedHeroes) || parsedHeroes.length === 0) {
        localStorage.setItem(HEROES_STORAGE_KEY, JSON.stringify(INITIAL_HEROES));
        return INITIAL_HEROES;
      }

      return parsedHeroes;
    } catch {
      localStorage.setItem(HEROES_STORAGE_KEY, JSON.stringify(INITIAL_HEROES));
      return INITIAL_HEROES;
    }
  }

  private persistHeroes(heroes: Hero[]): void {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(HEROES_STORAGE_KEY, JSON.stringify(heroes));
  }

  private calculateNextId(heroes: Hero[]): number {
    return heroes.reduce((maxId, hero) => Math.max(maxId, hero.id), 0) + 1;
  }
}

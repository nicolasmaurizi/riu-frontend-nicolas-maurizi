import { inject, Injectable, Signal, WritableSignal, computed, signal } from '@angular/core';

import { HeroFormValue } from '../models/hero-form.model';
import { Hero } from '../models/hero.model';
import { HeroesPersistenceService } from './heroes-persistence.service';

export class DuplicateHeroNameError extends Error {
  constructor() {
    super('Hero name already exists');
    this.name = 'DuplicateHeroNameError';
  }
}

export const INITIAL_HEROES: Hero[] = [
  {
    id: 1,
    name: 'Peter Parker',
    alias: 'Spider-Man',
    imageUrl: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=800&q=80',
    universe: 'Marvel',
    alignment: 'Hero',
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
    alignment: 'Hero',
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
    alignment: 'Hero',
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
    alignment: 'Hero',
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
  private readonly persistence = inject(HeroesPersistenceService);
  private readonly heroesState: WritableSignal<Hero[]> = signal(this.persistence.load(INITIAL_HEROES));

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
    this.ensureUniqueHeroName(payload.name);

    const timestamp = new Date().toISOString();
    const powerLevel = payload.powerLevel ?? 0;

    const hero: Hero = {
      id: this.nextId++,
      name: payload.name.trim(),
      alias: payload.alias?.trim() || undefined,
      imageUrl: payload.imageUrl.trim(),
      universe: payload.universe,
      alignment: payload.alignment,
      powerLevel,
      speed: this.calculateSpeedFromPowerLevel(powerLevel),
      intelligence: payload.intelligence ?? 10,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.heroesState.update((heroes) => {
      const updatedHeroes = [hero, ...heroes];
      this.persistence.save(updatedHeroes);
      return updatedHeroes;
    });

    return hero;
  }

  update(id: number, payload: HeroFormValue): Hero | undefined {
    const currentHero = this.getById(id);

    if (!currentHero) {
      return undefined;
    }

    this.ensureUniqueHeroName(payload.name, id);

    const powerLevel = payload.powerLevel ?? 0;

    const updatedHero: Hero = {
      ...currentHero,
      name: payload.name.trim(),
      alias: payload.alias?.trim() || undefined,
      imageUrl: payload.imageUrl.trim(),
      universe: payload.universe,
      alignment: payload.alignment,
      powerLevel,
      speed: this.calculateSpeedFromPowerLevel(powerLevel),
      intelligence: payload.intelligence ?? 10,
      updatedAt: new Date().toISOString(),
    };

    this.heroesState.update((heroes) => {
      const updatedHeroes = heroes.map((hero) => (hero.id === id ? updatedHero : hero));
      this.persistence.save(updatedHeroes);
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
      this.persistence.save(updatedHeroes);
      return updatedHeroes;
    });

    return true;
  }

  reset(): void {
    this.heroesState.set(INITIAL_HEROES);
    this.persistence.save(INITIAL_HEROES);
    this.nextId = this.calculateNextId(INITIAL_HEROES);
  }

  private calculateNextId(heroes: Hero[]): number {
    return heroes.reduce((maxId, hero) => Math.max(maxId, hero.id), 0) + 1;
  }

  private calculateSpeedFromPowerLevel(powerLevel: number): number {
    return Math.round(powerLevel * 0.85);
  }

  private ensureUniqueHeroName(name: string, currentHeroId?: number): void {
    const normalizedName = name.trim().toLowerCase();
    const hasDuplicate = this.heroesState().some(
      (hero) => hero.id !== currentHeroId && hero.name.trim().toLowerCase() === normalizedName,
    );

    if (hasDuplicate) {
      throw new DuplicateHeroNameError();
    }
  }
}

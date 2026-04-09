import { Injectable, signal, WritableSignal } from '@angular/core';

import { HeroFormValue } from '../models/hero-form.model';
import { Hero } from '../models/hero.model';

const INITIAL_HEROES: Hero[] = [
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
  private readonly heroesState: WritableSignal<Hero[]> = signal(INITIAL_HEROES);
  private nextId = INITIAL_HEROES.reduce((maxId, hero) => Math.max(maxId, hero.id), 0) + 1;

  getAll(): Hero[] {
    return this.heroesState();
  }

  getById(id: number): Hero | undefined {
    return this.heroesState().find((hero) => hero.id === id);
  }

  searchByName(term: string): Hero[] {
    const normalizedTerm = term.trim().toLowerCase();

    if (!normalizedTerm) {
      return this.getAll();
    }

    return this.heroesState().filter((hero) => hero.name.toLowerCase().includes(normalizedTerm));
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

    this.heroesState.update((heroes) => [...heroes, hero]);

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

    this.heroesState.update((heroes) =>
      heroes.map((hero) => (hero.id === id ? updatedHero : hero)),
    );

    return updatedHero;
  }

  delete(id: number): boolean {
    const heroes = this.heroesState();
    const exists = heroes.some((hero) => hero.id === id);

    if (!exists) {
      return false;
    }

    this.heroesState.update((currentHeroes) => currentHeroes.filter((hero) => hero.id !== id));

    return true;
  }
}

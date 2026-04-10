import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Hero } from '../models/hero.model';
import { HeroesPersistenceService } from './heroes-persistence.service';

describe('HeroesPersistenceService', () => {
  let service: HeroesPersistenceService;

  const initialHeroes: Hero[] = [
    {
      id: 1,
      name: 'Peter Parker',
      alias: 'Spider-Man',
      imageUrl: 'https://example.com/spiderman.webp',
      universe: 'Marvel',
      alignment: 'Hero',
      powerLevel: 88,
      speed: 75,
      intelligence: 92,
      createdAt: '2026-04-09T10:00:00.000Z',
      updatedAt: '2026-04-09T10:00:00.000Z',
    },
  ];

  beforeEach(() => {
    localStorage.clear();
    service = new HeroesPersistenceService();
  });

  it('should return initial heroes and persist them when storage is empty', () => {
    const saveSpy = vi.spyOn(Storage.prototype, 'setItem');

    const heroes = service.load(initialHeroes);

    expect(heroes).toEqual(initialHeroes);
    expect(saveSpy).toHaveBeenCalledOnce();
  });

  it('should return stored heroes when storage contains valid data', () => {
    localStorage.setItem('heroes-app.heroes', JSON.stringify(initialHeroes));

    const heroes = service.load([]);

    expect(heroes).toEqual(initialHeroes);
  });

  it('should fall back to initial heroes when storage contains invalid json', () => {
    const saveSpy = vi.spyOn(Storage.prototype, 'setItem');
    localStorage.setItem('heroes-app.heroes', '{invalid}');

    const heroes = service.load(initialHeroes);

    expect(heroes).toEqual(initialHeroes);
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should save heroes in localStorage', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    service.save(initialHeroes);

    expect(setItemSpy).toHaveBeenCalledWith('heroes-app.heroes', JSON.stringify(initialHeroes));
  });
});

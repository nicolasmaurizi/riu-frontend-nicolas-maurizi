import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HeroFormValue } from '../models/hero-form.model';
import { Hero } from '../models/hero.model';
import { HeroesFacade } from './heroes.facade';

describe('HeroesFacade', () => {
  let facade: HeroesFacade;

  const heroPayload: HeroFormValue = {
    name: 'Clark Kent',
    alias: 'Superman',
    universe: 'DC',
    alignment: 'Hero',
    imageUrl: 'https://example.com/superman.webp',
    powerLevel: 90,
    intelligence: 85,
  };

  const heroes: Hero[] = [
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
    {
      id: 2,
      name: 'Bruce Wayne',
      alias: 'Batman',
      imageUrl: 'https://example.com/batman.webp',
      universe: 'DC',
      alignment: 'Hero',
      powerLevel: 79,
      speed: 68,
      intelligence: 98,
      createdAt: '2026-04-09T10:05:00.000Z',
      updatedAt: '2026-04-09T10:05:00.000Z',
    },
  ];

  const heroesServiceMock = {
    getAll: vi.fn(() => heroes),
    searchByName: vi.fn((term: string) =>
      heroes.filter((hero) => hero.name.toLowerCase().includes(term.toLowerCase())),
    ),
    create: vi.fn(() => ({
      id: 3,
      ...heroPayload,
      speed: 77,
      createdAt: '2026-04-10T10:00:00.000Z',
      updatedAt: '2026-04-10T10:00:00.000Z',
    })),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(() => {
    heroesServiceMock.getAll.mockClear();
    heroesServiceMock.searchByName.mockClear();
    heroesServiceMock.create.mockClear();
    heroesServiceMock.update.mockClear();
    heroesServiceMock.delete.mockClear();
    facade = new HeroesFacade(heroesServiceMock as never);
  });

  it('should return paged heroes from the service', () => {
    expect(facade.pagedHeroes()).toEqual(heroes);
    expect(facade.totalHeroes()).toBe(2);
  });

  it('should reset the page when the filter changes', () => {
    facade.setPage(3);
    facade.setFilter('Peter');

    expect(facade.page()).toBe(1);
    expect(facade.filteredHeroes()).toEqual([heroes[0]]);
  });

  it('should create a hero and move to the max page', () => {
    facade.pageSize.set(1);

    const hero = facade.createHero(heroPayload);

    expect(heroesServiceMock.create).toHaveBeenCalledWith(heroPayload);
    expect(hero.name).toBe('Clark Kent');
    expect(facade.page()).toBe(2);
  });

  it('should delegate updateHero to the heroes service', () => {
    heroesServiceMock.update.mockReturnValue(heroes[0]);

    const updatedHero = facade.updateHero(1, heroPayload);

    expect(heroesServiceMock.update).toHaveBeenCalledWith(1, heroPayload);
    expect(updatedHero).toEqual(heroes[0]);
  });

  it('should keep the current page when deleteHero fails', () => {
    facade.setPage(2);
    heroesServiceMock.delete.mockReturnValue(false);

    const wasDeleted = facade.deleteHero(999);

    expect(wasDeleted).toBe(false);
    expect(facade.page()).toBe(2);
  });
});

import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HeroFormValue } from '../models/hero-form.model';
import { HeroesPersistenceService } from './heroes-persistence.service';
import { HeroesService, INITIAL_HEROES } from './heroes.service';

describe('HeroesService', () => {
  let service: HeroesService;
  let setItemSpy: ReturnType<typeof vi.spyOn>;

  const createPayload = (overrides: Partial<HeroFormValue> = {}): HeroFormValue => ({
    name: 'Clark Kent',
    alias: 'Superman',
    imageUrl: 'https://example.com/superman.webp',
    universe: 'DC',
    alignment: 'Hero',
    powerLevel: 90,
    intelligence: 95,
    ...overrides,
  });

  const createService = (): HeroesService => {
    TestBed.configureTestingModule({
      providers: [HeroesPersistenceService, HeroesService],
    });

    return TestBed.inject(HeroesService);
  };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    service = createService();
  });

  it('debe inicializar con heroes por defecto cuando localStorage esta vacio', () => {
    expect(service.getAll()).toEqual(INITIAL_HEROES);
    expect(setItemSpy).toHaveBeenCalledWith('heroes-app.heroes', JSON.stringify(INITIAL_HEROES));
  });

  it('debe devolver todos los heroes', () => {
    expect(service.getAll()).toHaveLength(INITIAL_HEROES.length);
    expect(service.getAll()[0].name).toBe(INITIAL_HEROES[0].name);
  });

  it('debe buscar heroes por nombre parcial', () => {
    const result = service.searchByName('diana');

    expect(result).toHaveLength(1);
    expect(result[0].alias).toBe('Wonder Woman');
  });

  it('debe buscar heroes por alias parcial si el servicio lo soporta', () => {
    const result = service.searchByName('iron');

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Tony Stark');
  });

  it('debe obtener un heroe por id', () => {
    const hero = service.getById(2);

    expect(hero).toBeDefined();
    expect(hero?.alias).toBe('Batman');
  });

  it('debe crear un heroe nuevo con id incremental', () => {
    const hero = service.create(createPayload());

    expect(hero.id).toBe(5);
    expect(hero.speed).toBe(Math.round(90 * 0.85));
    expect(service.getAll()[0]).toEqual(hero);
  });

  it('debe actualizar un heroe existente', () => {
    const updatedHero = service.update(
      1,
      createPayload({
        name: 'Peter Parker',
        alias: 'Spider-Man Prime',
        universe: 'Marvel',
        powerLevel: 95,
        intelligence: 93,
      }),
    );

    expect(updatedHero).toBeDefined();
    expect(updatedHero?.alias).toBe('Spider-Man Prime');
    expect(updatedHero?.powerLevel).toBe(95);
    expect(updatedHero?.speed).toBe(Math.round(95 * 0.85));
    expect(updatedHero?.updatedAt).not.toBe(INITIAL_HEROES[0].updatedAt);
  });

  it('debe devolver undefined al actualizar un id inexistente', () => {
    const result = service.update(999, createPayload());

    expect(result).toBeUndefined();
  });

  it('debe eliminar un heroe existente', () => {
    const result = service.delete(2);

    expect(result).toBe(true);
    expect(service.getById(2)).toBeUndefined();
    expect(service.getAll()).toHaveLength(INITIAL_HEROES.length - 1);
  });

  it('debe devolver false al eliminar un id inexistente', () => {
    const result = service.delete(999);

    expect(result).toBe(false);
    expect(service.getAll()).toHaveLength(INITIAL_HEROES.length);
  });

  it('debe persistir cambios en localStorage al crear, actualizar y borrar', () => {
    setItemSpy.mockClear();

    const createdHero = service.create(createPayload());
    expect(setItemSpy).toHaveBeenCalledTimes(1);

    const persistedAfterCreate = JSON.parse(localStorage.getItem('heroes-app.heroes') ?? '[]') as Array<{
      id: number;
    }>;
    expect(persistedAfterCreate.some((hero) => hero.id === createdHero.id)).toBe(true);

    service.update(
      createdHero.id,
      createPayload({
        name: 'Clark Kent',
        alias: 'Superman Returns',
      }),
    );
    expect(setItemSpy).toHaveBeenCalledTimes(2);

    const persistedAfterUpdate = JSON.parse(localStorage.getItem('heroes-app.heroes') ?? '[]') as Array<{
      id: number;
      alias?: string;
    }>;
    expect(persistedAfterUpdate.find((hero) => hero.id === createdHero.id)?.alias).toBe(
      'Superman Returns',
    );

    service.delete(createdHero.id);
    expect(setItemSpy).toHaveBeenCalledTimes(3);

    const persistedAfterDelete = JSON.parse(localStorage.getItem('heroes-app.heroes') ?? '[]') as Array<{
      id: number;
    }>;
    expect(persistedAfterDelete.some((hero) => hero.id === createdHero.id)).toBe(false);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NotificationService } from '../../../../core/services/notification';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { HeroDialogComponent } from '../../components/hero-dialog-component/hero-dialog-component';
import { HeroFormValue } from '../../models/hero-form.model';
import { Hero } from '../../models/hero.model';
import { HeroesService } from '../../services/heroes.service';
import { HeroesPage } from './heroes-page';

describe('HeroesPage', () => {
  let fixture: ComponentFixture<HeroesPage>;
  let component: HeroesPage;

  const heroesSignal = signal<Hero[]>([
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
  ]);

  const heroesServiceMock = {
    heroes: heroesSignal.asReadonly(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  const notificationServiceMock = {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  };

  const matDialogMock = {
    open: vi.fn<
      () => {
        afterClosed: () => Observable<HeroFormValue | boolean | undefined>;
      }
    >(() => ({
      afterClosed: () => of(undefined),
    })),
  };

  const queryText = (): string => fixture.nativeElement.textContent.replace(/\s+/g, ' ').trim();

  beforeEach(async () => {
    heroesSignal.set([
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
    ]);

    heroesServiceMock.create.mockReset();
    heroesServiceMock.update.mockReset();
    heroesServiceMock.delete.mockReset();
    notificationServiceMock.success.mockReset();
    notificationServiceMock.error.mockReset();
    notificationServiceMock.info.mockReset();
    matDialogMock.open.mockReset();
    matDialogMock.open.mockReturnValue({
      afterClosed: () => of(undefined),
    });

    await TestBed.configureTestingModule({
      imports: [HeroesPage, NoopAnimationsModule],
      providers: [
        { provide: HeroesService, useValue: heroesServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe renderizar la pantalla principal', () => {
    expect(fixture.nativeElement.querySelector('app-layout-shell')).toBeTruthy();
    expect(queryText()).toContain('All Heroes');
  });

  it('debe mostrar la lista de heroes', () => {
    const text = queryText();

    expect(text).toContain('Spider-Man');
    expect(text).toContain('Batman');
  });

  it('debe reaccionar al filtro de busqueda', async () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[placeholder="Spider-Man, Batman..."]',
    );

    input.value = 'bat';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const text = queryText();
    expect(text).toContain('Batman');
    expect(text).not.toContain('Spider-Man');
  });

  it('debe abrir el dialogo de creacion al hacer click en "Nuevo"', async () => {
    const addButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[aria-label="Add hero"]',
    );

    addButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(matDialogMock.open).toHaveBeenCalledWith(
      HeroDialogComponent,
      expect.objectContaining({
        autoFocus: false,
      }),
    );
  });

  it('debe abrir el dialogo de edicion al hacer click en "Editar"', async () => {
    const editButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[aria-label="Edit hero"]',
    );

    editButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(matDialogMock.open).toHaveBeenCalledWith(
      HeroDialogComponent,
      expect.objectContaining({
        data: expect.objectContaining({ id: 1 }),
      }),
    );
  });

  it('debe ejecutar borrado al confirmar eliminacion', async () => {
    const deleteSpy = vi.spyOn(heroesServiceMock, 'delete').mockReturnValue(true);
    matDialogMock.open.mockReturnValue({
      afterClosed: () => of(true),
    });

    const deleteButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[aria-label="Delete hero"]',
    );

    deleteButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(matDialogMock.open).toHaveBeenCalledWith(
      ConfirmDialog,
      expect.objectContaining({
        data: expect.objectContaining({ title: 'Delete hero' }),
      }),
    );
    expect(deleteSpy).toHaveBeenCalledWith(1);
    expect(notificationServiceMock.success).toHaveBeenCalledWith('Hero deleted successfully');
  });

  it('debe mostrar estado vacio cuando no hay heroes', async () => {
    heroesSignal.set([]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(queryText()).toContain('No heroes found');
    expect(fixture.nativeElement.querySelector('.heroes-home__empty-image')).toBeTruthy();
  });

  it('debe mostrar estado vacio cuando no hay resultados', async () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[placeholder="Spider-Man, Batman..."]',
    );

    input.value = 'zzz';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(queryText()).toContain('No heroes found');
    expect(fixture.nativeElement.querySelector('.heroes-home__empty-image')).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NotificationService } from '../../../../core/services/notification';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { provideTestTranslate } from '../../../../../testing/translate-testing';
import { HeroFormValue } from '../../models/hero-form.model';
import { Hero } from '../../models/hero.model';
import { DuplicateHeroNameError, HeroesService } from '../../services/heroes.service';
import { HeroDialogComponent } from '../hero-dialog-component/hero-dialog-component';
import { HeroesHome } from './heroes-home';

describe('HeroesHome', () => {
  let fixture: ComponentFixture<HeroesHome>;
  let component: HeroesHome;

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
      imports: [HeroesHome, NoopAnimationsModule],
      providers: [
        provideTestTranslate(),
        { provide: HeroesService, useValue: heroesServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the heroes table', () => {
    expect(queryText()).toContain('Spider-Man');
    expect(queryText()).toContain('Batman');
    expect(queryText()).toContain('All Heroes');
  });

  it('should react to the search filter', async () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[placeholder="Spider-Man, Batman..."]',
    );

    input.value = 'bat';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(queryText()).toContain('Batman');
    expect(queryText()).not.toContain('Spider-Man');
  });

  it('should create a hero after the add dialog closes with a payload', async () => {
    const payload: HeroFormValue = {
      name: 'Clark Kent',
      alias: 'Superman',
      universe: 'DC',
      alignment: 'Hero',
      imageUrl: 'https://example.com/superman.webp',
      powerLevel: 90,
      intelligence: 85,
    };

    matDialogMock.open.mockReturnValue({
      afterClosed: () => of(payload),
    });

    component.onAddHero();

    expect(matDialogMock.open).toHaveBeenCalledWith(
      HeroDialogComponent,
      expect.objectContaining({
        autoFocus: false,
      }),
    );
    expect(heroesServiceMock.create).toHaveBeenCalledWith(payload);
    expect(notificationServiceMock.success).toHaveBeenCalledWith('Hero created successfully');
  });

  it('should show a duplicate name error when hero creation fails with business validation', () => {
    matDialogMock.open.mockReturnValue({
      afterClosed: () =>
        of({
          name: 'Batman',
          alias: 'Batman',
          universe: 'DC',
          alignment: 'Hero',
          imageUrl: 'https://example.com/batman.webp',
          powerLevel: 79,
          intelligence: 98,
        } satisfies HeroFormValue),
    });
    heroesServiceMock.create.mockImplementation(() => {
      throw new DuplicateHeroNameError();
    });

    component.onAddHero();

    expect(notificationServiceMock.error).toHaveBeenCalledWith('Hero name already exists');
  });

  it('should delete a hero after confirmation', () => {
    heroesServiceMock.delete.mockReturnValue(true);
    matDialogMock.open.mockReturnValue({
      afterClosed: () => of(true),
    });

    component.onDeleteHero({
      ...heroesSignal()[0],
      publisher: 'Marvel',
    });

    expect(matDialogMock.open).toHaveBeenCalledWith(
      ConfirmDialog,
      expect.objectContaining({
        data: expect.objectContaining({ title: 'Delete hero' }),
      }),
    );
    expect(heroesServiceMock.delete).toHaveBeenCalledWith(1);
    expect(notificationServiceMock.success).toHaveBeenCalledWith('Hero deleted successfully');
  });

  it('should render the empty state when there are no heroes to display', async () => {
    heroesSignal.set([]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(queryText()).toContain('No heroes found');
    expect(fixture.nativeElement.querySelector('.heroes-home__empty-image')).toBeTruthy();
  });
});

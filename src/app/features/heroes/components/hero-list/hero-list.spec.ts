import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Hero } from '../../models/hero.model';
import { HeroList } from './hero-list';

describe('HeroList', () => {
  let fixture: ComponentFixture<HeroList>;
  let component: HeroList;

  const mockHeroes: Hero[] = [
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroList],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroList);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render heroes in the template', () => {
    component.heroes = mockHeroes;
    fixture.detectChanges();

    const heroCards = fixture.nativeElement.querySelectorAll('[data-testid="hero-card"]');
    const text = fixture.nativeElement.textContent as string;

    expect(heroCards).toHaveLength(2);
    expect(text).toContain('Peter Parker');
    expect(text).toContain('Spider-Man');
    expect(text).toContain('Bruce Wayne');
    expect(text).toContain('DC');
  });

  it('should emit edit event when edit button is clicked', () => {
    component.heroes = mockHeroes;
    const editSpy = vi.fn();
    component.edit.subscribe(editSpy);
    fixture.detectChanges();

    const editButtons = fixture.nativeElement.querySelectorAll('[data-testid="edit-button"]');
    (editButtons[0] as HTMLButtonElement).click();

    expect(editSpy).toHaveBeenCalledWith(mockHeroes[0]);
  });

  it('should emit delete event when delete button is clicked', () => {
    component.heroes = mockHeroes;
    const deleteSpy = vi.fn();
    component.delete.subscribe(deleteSpy);
    fixture.detectChanges();

    const deleteButtons = fixture.nativeElement.querySelectorAll('[data-testid="delete-button"]');
    (deleteButtons[0] as HTMLButtonElement).click();

    expect(deleteSpy).toHaveBeenCalledWith(mockHeroes[0]);
  });

  it('should show empty state when no heroes are provided', () => {
    component.heroes = [];
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('[data-testid="empty-state"]');

    expect(emptyState).toBeTruthy();
    expect(emptyState.textContent).toContain('No heroes found');
  });
});

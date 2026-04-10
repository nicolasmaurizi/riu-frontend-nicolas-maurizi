import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Hero } from '../../models/hero.model';
import { SuperheroApiService } from '../../services/superhero-api.service';
import { provideTestTranslate } from '../../../../../testing/translate-testing';
import { HeroDialogComponent } from './hero-dialog-component';

describe('HeroDialogComponent', () => {
  const baseHero: Hero = {
    id: 1,
    name: 'Bruce Wayne',
    alias: 'Batman',
    imageUrl: 'https://example.com/batman.webp',
    universe: 'DC',
    alignment: 'Hero',
    powerLevel: 79,
    speed: 67,
    intelligence: 98,
    createdAt: '2026-04-09T10:05:00.000Z',
    updatedAt: '2026-04-09T10:05:00.000Z',
  };

  const createComponent = async (data?: Hero) => {
    const dialogRefMock = {
      close: vi.fn(),
    };
    const superheroApiServiceMock = {
      searchHeroImageByName: vi.fn(() => of(null)),
    };

    await TestBed.configureTestingModule({
      imports: [HeroDialogComponent, NoopAnimationsModule],
      providers: [
        provideTestTranslate(),
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: SuperheroApiService, useValue: superheroApiServiceMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(HeroDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    return { fixture, component, dialogRefMock, superheroApiServiceMock };
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', async () => {
    const { component } = await createComponent();

    expect(component).toBeTruthy();
  });

  it('should show create mode by default', async () => {
    const { component, fixture } = await createComponent();
    const text = fixture.nativeElement.textContent.replace(/\s+/g, ' ').trim();

    expect(component.isEditMode).toBe(false);
    expect(text).toContain('Add Hero');
    expect(text).toContain('Create');
  });

  it('should prefill the form in edit mode', async () => {
    const { component, fixture } = await createComponent(baseHero);
    const text = fixture.nativeElement.textContent.replace(/\s+/g, ' ').trim();

    expect(component.isEditMode).toBe(true);
    expect(component.form.getRawValue()).toEqual({
      name: 'Bruce Wayne',
      alias: 'Batman',
      universe: 'DC',
      alignment: 'Hero',
      imageUrl: 'https://example.com/batman.webp',
      powerLevel: 79,
      intelligence: 98,
    });
    expect(text).toContain('Edit Hero');
    expect(text).toContain('Save');
  });

  it('should not close the dialog when the form is invalid', async () => {
    const { component, dialogRefMock } = await createComponent();

    component.form.controls.name.setValue('');
    component.form.controls.imageUrl.setValue('');
    component.save();

    expect(dialogRefMock.close).not.toHaveBeenCalled();
    expect(component.form.invalid).toBe(true);
  });

  it('should close the dialog with the form value when the form is valid', async () => {
    const { component, dialogRefMock } = await createComponent();

    component.form.setValue({
      name: 'Clark Kent',
      alias: 'Superman',
      universe: 'DC',
      alignment: 'Hero',
      imageUrl: 'https://example.com/superman.webp',
      powerLevel: 90,
      intelligence: 85,
    });

    component.save();

    expect(dialogRefMock.close).toHaveBeenCalledWith({
      name: 'Clark Kent',
      alias: 'Superman',
      universe: 'DC',
      alignment: 'Hero',
      imageUrl: 'https://example.com/superman.webp',
      powerLevel: 90,
      intelligence: 85,
    });
  });

  it('should calculate derived speed from power level', async () => {
    const { component } = await createComponent();

    component.form.controls.powerLevel.setValue(80);

    expect(component.derivedSpeed()).toBe(68);
  });
});

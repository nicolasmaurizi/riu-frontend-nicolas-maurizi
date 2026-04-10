import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { HeroForm } from './hero-form';

describe('HeroForm', () => {
  let component: HeroForm;
  let fixture: ComponentFixture<HeroForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroForm],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when name is empty', () => {
    component.form.setValue({
      name: '',
    });

    expect(component.form.invalid).toBe(true);
    expect(component.form.controls.name.hasError('required')).toBe(true);
  });

  it('should be valid when form has correct data', () => {
    component.form.setValue({
      name: 'Batman',
    });

    expect(component.form.valid).toBe(true);
  });
});

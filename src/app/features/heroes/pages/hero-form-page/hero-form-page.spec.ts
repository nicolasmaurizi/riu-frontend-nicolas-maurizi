import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroFormPage } from './hero-form-page';

describe('HeroFormPage', () => {
  let component: HeroFormPage;
  let fixture: ComponentFixture<HeroFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroFormPage],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroFormPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroFilter } from './hero-filter';

describe('HeroFilter', () => {
  let component: HeroFilter;
  let fixture: ComponentFixture<HeroFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

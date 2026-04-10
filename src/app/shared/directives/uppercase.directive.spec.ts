import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';

import { UppercaseDirective } from './uppercase.directive';

@Component({
  standalone: true,
  imports: [UppercaseDirective],
  template: `<input type="text" appUppercase />`,
})
class TestHostComponent {}

describe('UppercaseDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
  });

  it('should create the directive', () => {
    const directiveInstance = fixture.debugElement.query(By.directive(UppercaseDirective)).injector.get(
      UppercaseDirective,
    );

    expect(directiveInstance).toBeTruthy();
  });

  it('should transform input value to uppercase when user types', () => {
    input.value = 'batman';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('BATMAN');
  });

  it('should keep empty value without breaking', () => {
    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('');
  });

  it('should update DOM value correctly', () => {
    input.value = 'sPidEr-Man';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('SPIDER-MAN');
  });
});

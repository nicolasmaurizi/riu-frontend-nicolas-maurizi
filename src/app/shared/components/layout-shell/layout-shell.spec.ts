import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { provideTestTranslate } from '../../../../testing/translate-testing';
import { LayoutShell } from './layout-shell';

@Component({
  standalone: true,
  imports: [LayoutShell],
  template: `
    <app-layout-shell>
      <section class="projected-content">Heroes content</section>
    </app-layout-shell>
  `,
})
class HostComponent {}

describe('LayoutShell', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideTestTranslate()],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the shell structure', () => {
    expect(fixture.nativeElement.querySelector('.shell')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('mat-toolbar')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.shell__container')).toBeTruthy();
  });

  it('should project content inside the shell container', () => {
    const projectedContent: HTMLElement | null = fixture.nativeElement.querySelector('.projected-content');

    expect(projectedContent?.textContent).toContain('Heroes content');
  });
});

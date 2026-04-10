import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ConfirmDialog } from './confirm-dialog';

describe('ConfirmDialog', () => {
  let component: ConfirmDialog;
  let fixture: ComponentFixture<ConfirmDialog>;
  let dialogRefMock: { close: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    dialogRefMock = {
      close: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ConfirmDialog],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Delete hero',
            message: 'Are you sure you want to delete this hero?',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call close(true) when confirm is triggered', () => {
    const closeSpy = vi.spyOn(dialogRefMock, 'close');

    component.confirm();

    expect(closeSpy).toHaveBeenCalledWith(true);
  });

  it('should call close(false) when cancel is triggered', () => {
    const closeSpy = vi.spyOn(dialogRefMock, 'close');

    component.cancel();

    expect(closeSpy).toHaveBeenCalledWith(false);
  });
});

import { computed, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';

import { HeroFormValue } from '../../models/hero-form.model';
import { Hero, HeroAlignment, HeroUniverse } from '../../models/hero.model';
import { UppercaseDirective } from '../../../../shared/directives/uppercase.directive';

@Component({
  selector: 'app-hero-dialog-component',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    ReactiveFormsModule,
    UppercaseDirective,
  ],
  templateUrl: './hero-dialog-component.html',
  styleUrl: './hero-dialog-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroDialogComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<HeroDialogComponent, HeroFormValue>);
  readonly data = inject<Hero | undefined>(MAT_DIALOG_DATA, { optional: true });
  readonly isEditMode = !!this.data;

  readonly publishers: HeroUniverse[] = ['Marvel', 'DC', 'Otro'];
  readonly alignments: HeroAlignment[] = ['Hero', 'Anti-Hero', 'Neutral'];

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    alias: [''],
    universe: ['Marvel' as HeroUniverse, Validators.required],
    alignment: ['Hero' as HeroAlignment, Validators.required],
    imageUrl: ['', Validators.required],
    powerLevel: [50, [Validators.required, Validators.min(10), Validators.max(100)]],
  });

  private readonly powerLevelValue = toSignal(this.form.controls.powerLevel.valueChanges, {
    initialValue: this.form.controls.powerLevel.getRawValue(),
  });

  readonly dialogTitle = computed(() => (this.isEditMode ? 'Edit Hero' : 'Add Hero'));
  readonly submitText = computed(() => (this.isEditMode ? 'Save' : 'Create'));
  readonly derivedSpeed = computed(() => this.calculateSpeed(this.powerLevelValue()));

  constructor() {
    const hero = this.data;

    if (!hero) {
      return;
    }

    this.form.patchValue({
      name: hero.name,
      alias: hero.alias ?? '',
      universe: hero.universe,
      alignment: hero.alignment,
      imageUrl: hero.imageUrl,
      powerLevel: hero.powerLevel,
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    this.dialogRef.close({
      name: value.name,
      alias: value.alias || undefined,
      imageUrl: value.imageUrl,
      universe: value.universe,
      alignment: value.alignment,
      powerLevel: value.powerLevel,
      speed: null,
      intelligence: null,
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  private calculateSpeed(powerLevel: number): number {
    return Math.round(powerLevel * 0.85);
  }
}

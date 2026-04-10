import { computed, ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, of, switchMap, tap } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';

import { HeroFormValue } from '../../models/hero-form.model';
import { Hero, HeroAlignment, HeroUniverse } from '../../models/hero.model';
import { SuperheroApiService } from '../../services/superhero-api.service';
import { UppercaseDirective } from '../../../../shared/directives/uppercase.directive';

@Component({
  selector: 'app-hero-dialog-component',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef = inject(MatDialogRef<HeroDialogComponent, HeroFormValue>);
  private readonly superheroApiService = inject(SuperheroApiService);
  readonly data = inject<Hero | undefined>(MAT_DIALOG_DATA, { optional: true });
  readonly isEditMode = !!this.data;
  private autoFilledImageUrl: string | null = null;
  readonly isSearchingImage = signal(false);
  readonly imageSearchError = signal<string | null>(null);
  readonly imageFound = signal(false);

  readonly publishers: HeroUniverse[] = ['Marvel', 'DC', 'Otro'];
  readonly alignments: HeroAlignment[] = ['Hero', 'Anti-Hero', 'Neutral'];

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    alias: [''],
    universe: ['Marvel' as HeroUniverse, Validators.required],
    alignment: ['Hero' as HeroAlignment, Validators.required],
    imageUrl: ['', Validators.required],
    powerLevel: [50, [Validators.required, Validators.min(10), Validators.max(100)]],
    intelligence: [50, [Validators.required, Validators.min(10), Validators.max(100)]],
  });

  private readonly powerLevelValue = toSignal(this.form.controls.powerLevel.valueChanges, {
    initialValue: this.form.controls.powerLevel.getRawValue(),
  });
  private readonly intelligenceValue = toSignal(this.form.controls.intelligence.valueChanges, {
    initialValue: this.form.controls.intelligence.getRawValue(),
  });
  private readonly imageUrlValue = toSignal(this.form.controls.imageUrl.valueChanges, {
    initialValue: this.form.controls.imageUrl.getRawValue(),
  });

  readonly dialogTitle = computed(() => (this.isEditMode ? 'Edit Hero' : 'Add Hero'));
  readonly submitText = computed(() => (this.isEditMode ? 'Save' : 'Create'));
  readonly derivedSpeed = computed(() => this.calculateSpeed(this.powerLevelValue()));
  readonly intelligenceScore = computed(() => this.intelligenceValue());
  readonly imagePreviewUrl = computed(() => this.imageUrlValue().trim());

  constructor() {
    const hero = this.data;

    if (!hero) {
      this.setupImageAutocomplete();
      return;
    }

    this.form.patchValue({
      name: hero.name,
      alias: hero.alias ?? '',
      universe: hero.universe,
      alignment: hero.alignment,
      imageUrl: hero.imageUrl,
      powerLevel: hero.powerLevel,
      intelligence: hero.intelligence,
    });

    this.autoFilledImageUrl = hero.imageUrl;

    this.setupImageAutocomplete();
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
      intelligence: value.intelligence,
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  private calculateSpeed(powerLevel: number): number {
    return Math.round(powerLevel * 0.85);
  }

  private setupImageAutocomplete(): void {
    this.form.controls.name.valueChanges
      .pipe(
        debounceTime(400),
        map((value) => value.trim()),
        distinctUntilChanged(),
        switchMap((name) => {
          this.imageSearchError.set(null);
          this.imageFound.set(false);

          if (!name) {
            this.isSearchingImage.set(false);
            return of<string | null>(null);
          }

          this.isSearchingImage.set(true);

          return this.superheroApiService.searchHeroImageByName(name).pipe(
            tap((imageUrl) => this.imageFound.set(Boolean(imageUrl))),
            catchError(() => {
              this.imageSearchError.set('Could not search image automatically.');
              return of(null);
            }),
            finalize(() => this.isSearchingImage.set(false)),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((imageUrl) => {
        if (!imageUrl || !this.shouldApplySuggestedImage()) {
          return;
        }

        this.autoFilledImageUrl = imageUrl;
        this.form.controls.imageUrl.setValue(imageUrl);
      });

  }

  private shouldApplySuggestedImage(): boolean {
    const currentImageUrl = this.form.controls.imageUrl.getRawValue().trim();

    return !currentImageUrl || currentImageUrl === this.autoFilledImageUrl;
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './hero-form.html',
  styleUrl: './hero-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroForm {
  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
  });
}

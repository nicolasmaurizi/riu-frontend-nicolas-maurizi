import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';

import { LanguageCode, LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-layout-shell',
  standalone: true,
  imports: [MatButtonToggleModule, MatToolbarModule, TranslatePipe],
  templateUrl: './layout-shell.html',
  styleUrl: './layout-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutShell {
  private readonly languageService = inject(LanguageService);

  readonly currentLanguage = this.languageService.currentLanguage;

  setLanguage(language: string): void {
    this.languageService.setLanguage(language as LanguageCode);
  }
}

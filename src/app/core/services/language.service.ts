import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type LanguageCode = 'es' | 'en';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly storageKey = 'app.language';
  private readonly supportedLanguages: LanguageCode[] = ['es', 'en'];
  private readonly currentLanguageState = signal<LanguageCode>('en');

  readonly currentLanguage = this.currentLanguageState.asReadonly();
  readonly availableLanguages = this.supportedLanguages;

  init(): void {
    this.translate.setFallbackLang('en');
    this.translate.addLangs(this.supportedLanguages);

    const initialLanguage = this.resolveInitialLanguage();
    this.applyLanguage(initialLanguage);
  }

  setLanguage(language: LanguageCode): void {
    this.applyLanguage(language);
  }

  private applyLanguage(language: LanguageCode): void {
    this.translate.use(language).subscribe(() => {
      this.currentLanguageState.set(language);
      localStorage.setItem(this.storageKey, language);
    });
  }

  private resolveInitialLanguage(): LanguageCode {
    const storedLanguage = localStorage.getItem(this.storageKey);

    if (this.isSupportedLanguage(storedLanguage)) {
      return storedLanguage;
    }

    const browserLanguage = navigator.language.slice(0, 2).toLowerCase();

    if (this.isSupportedLanguage(browserLanguage)) {
      return browserLanguage;
    }

    return 'en';
  }

  private isSupportedLanguage(language: string | null): language is LanguageCode {
    return this.supportedLanguages.includes(language as LanguageCode);
  }
}

import { provideTranslateLoader, provideTranslateService, TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

class EmptyTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    return of({} as TranslationObject);
  }
}

export function provideTestTranslate() {
  return provideTranslateService({
    loader: provideTranslateLoader(EmptyTranslateLoader),
    fallbackLang: 'en',
    lang: 'en',
  });
}

import { provideTranslateLoader, provideTranslateService, TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

const TEST_TRANSLATIONS: TranslationObject = {
  nav: {
    title: 'Heroes Explorer',
    language: 'Language',
    spanish: 'ES',
    english: 'EN',
  },
  common: {
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    create: 'Create',
  },
  heroes: {
    title: 'Explore iconic heroes',
    subtitle: 'A paginated view to validate structure, actions and base components.',
    sectionTitle: 'All Heroes',
    sectionCopy: 'Sample data',
    searchLabel: 'Search heroes',
    searchPlaceholder: 'Spider-Man, Batman...',
    image: 'Image',
    name: 'Name',
    publisher: 'Publisher',
    alignment: 'Alignment',
    power: 'Power',
    intelligence: 'Intelligence',
    actions: 'Actions',
    empty: 'No heroes found',
    emptyAlt: 'No heroes found',
    pagination: 'Heroes pagination',
    actionsLabel: {
      add: 'Add hero',
      edit: 'Edit hero',
      delete: 'Delete hero',
    },
    publisherValues: {
      marvel: 'Marvel',
      dc: 'DC',
      other: 'Other',
    },
    alignmentValues: {
      hero: 'Hero',
      antiHero: 'Anti-Hero',
      neutral: 'Neutral',
    },
    notifications: {
      created: 'Hero created successfully',
      updated: 'Hero updated successfully',
      deleted: 'Hero deleted successfully',
      createError: 'Unable to create hero',
      updateError: 'Unable to update hero',
      deleteError: 'Unable to delete hero',
      duplicateName: 'Hero name already exists',
    },
  },
  form: {
    addTitle: 'Add Hero',
    editTitle: 'Edit Hero',
    name: 'Name',
    alias: 'Alter ego',
    publisher: 'Publisher',
    alignment: 'Alignment',
    imageUrl: 'Image URL',
    powerLevel: 'Power level',
    derivedSpeed: 'Derived speed',
    intelligence: 'Intelligence',
    previewPlaceholder: 'Image preview will appear here',
    errors: {
      nameRequired: 'Name is required.',
      publisherRequired: 'Publisher is required.',
      alignmentRequired: 'Alignment is required.',
      imageUrlRequired: 'Image URL is required.',
      powerMin: 'Power level must be at least 10.',
      intelligenceMin: 'Intelligence must be at least 10.',
    },
  },
  dialog: {
    deleteHeroTitle: 'Delete hero',
    deleteHeroMessage: 'Are you sure you want to delete {{name}}? This action cannot be undone.',
    delete: 'Delete',
  },
  loading: {
    message: 'Loading...',
  },
  imageSearch: {
    searching: 'Searching image...',
    found: 'Image found automatically.',
    error: 'Could not search image automatically.',
  },
  heroList: {
    edit: 'Edit',
    delete: 'Delete',
    empty: 'No heroes found',
  },
};

class TestTranslateLoader implements TranslateLoader {
  getTranslation(_lang: string): Observable<TranslationObject> {
    return of(TEST_TRANSLATIONS);
  }
}

export function provideTestTranslate() {
  return provideTranslateService({
    loader: provideTranslateLoader(TestTranslateLoader),
    fallbackLang: 'en',
    lang: 'en',
  });
}

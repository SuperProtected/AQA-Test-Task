/**
 * Interface languages used by the tests.
 *
 * `ui` holds the expected interface texts of en.wikipedia.org in that language.
 * They come from MediaWiki messages (message key in the comments), e.g.:
 * https://en.wikipedia.org/w/api.php?action=query&meta=allmessages&ammessages=preferences&amlang=uk&amenableparser=1
 */
export interface InterfaceLanguage {
  /** MediaWiki language code; also expected in <html lang="…">. Typed into the "Language" search field. */
  code: string;
  /** Option text in the "Language" field drop-down. */
  optionLabel: string;
  /** Value shown in the "Language" field once the option is selected. */
  nativeName: string;
  ui: {
    /** `preferences` – heading of Special:Preferences */
    preferencesHeading: string;
    /** `prefs-personal` – "User profile" tab */
    userProfileTab: string;
    /** `prefs-i18n` – "Internationalisation" section */
    internationalisationSection: string;
    /** `saveprefs` – "Save" button */
    saveButton: string;
    /** `savedprefs` – confirmation shown after saving */
    savedNotice: string;
    /** `vector-view-view` – "Read" tab of a page */
    readTab: string;
    /** `vector-view-history` – "View history" tab of a page */
    historyTab: string;
    /** `searchsuggest-search` – placeholder of the search field */
    searchPlaceholder: string;
  };
}

export const ENGLISH: InterfaceLanguage = {
  code: 'en',
  optionLabel: 'en · English',
  nativeName: 'English',
  ui: {
    preferencesHeading: 'Preferences',
    userProfileTab: 'User profile',
    internationalisationSection: 'Internationalisation',
    saveButton: 'Save',
    savedNotice: 'Your preferences have been saved.',
    readTab: 'Read',
    historyTab: 'View history',
    searchPlaceholder: 'Search Wikipedia',
  },
};

export const UKRAINIAN: InterfaceLanguage = {
  code: 'uk',
  optionLabel: 'uk · українська',
  nativeName: 'українська',
  ui: {
    preferencesHeading: 'Налаштування',
    userProfileTab: 'Особові дані',
    internationalisationSection: 'Інтернаціоналізація',
    saveButton: 'Зберегти',
    savedNotice: 'Ваші налаштування збережено.',
    readTab: 'Читати',
    historyTab: 'Переглянути історію',
    searchPlaceholder: 'Пошук у Wikipedia',
  },
};

export const FRENCH: InterfaceLanguage = {
  code: 'fr',
  optionLabel: 'fr · français',
  nativeName: 'français',
  ui: {
    preferencesHeading: 'Préférences',
    userProfileTab: 'Informations personnelles',
    internationalisationSection: 'Préférences langagières',
    saveButton: 'Enregistrer les préférences',
    savedNotice: 'Les préférences ont été sauvegardées.',
    readTab: 'Lire',
    historyTab: 'Voir l’historique',
    searchPlaceholder: 'Rechercher sur Wikipedia',
  },
};

/** Language of the account before the test (precondition) and after it (cleanup). */
export const DEFAULT_LANGUAGE = ENGLISH;

/** Languages the user switches to: the test case runs once per language. */
export const TARGET_LANGUAGES: InterfaceLanguage[] = [UKRAINIAN, FRENCH];

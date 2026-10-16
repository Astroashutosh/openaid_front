import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  subname: string;
  isRtl?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    subname: 'English (US)',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    subname: 'French',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    subname: 'Spanish',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    subname: 'Portuguese',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    subname: 'Arabic',
    isRtl: true,
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    subname: 'Vietnamese',
  },
];

interface LanguageContextType {
  currentLang: string;
  setLanguage: (code: string) => void;
  currentLanguageInfo: LanguageInfo;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit?: () => void;
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState<string>(() => {
    return localStorage.getItem('openaid_lang') || 'en';
  });

  const setGoogleCookie = (langCode: string) => {
    const val = langCode === 'en' ? '' : `/en/${langCode}`;
    const expires =
      langCode === 'en'
        ? 'expires=Thu, 01 Jan 1970 00:00:00 GMT;'
        : 'expires=Fri, 31 Dec 2030 23:59:59 GMT;';

    // 1. Root path
    document.cookie = `googtrans=${val}; ${expires} path=/;`;

    // 2. Current subfolder path (supports localhost/openaid or similar)
    const parts = window.location.pathname.split('/');
    if (parts.length > 1 && parts[1]) {
      document.cookie = `googtrans=${val}; ${expires} path=/${parts[1]};`;
      document.cookie = `googtrans=${val}; ${expires} path=/${parts[1]}/;`;
    }

    // 3. Domain if not localhost
    const host = window.location.hostname;
    if (host !== 'localhost' && host.indexOf('.') !== -1) {
      document.cookie = `googtrans=${val}; ${expires} path=/; domain=${host};`;
      const domainParts = host.split('.');
      if (domainParts.length >= 2) {
        const rootDomain = '.' + domainParts.slice(-2).join('.');
        document.cookie = `googtrans=${val}; ${expires} path=/; domain=${rootDomain};`;
      }
    }
  };

  const setLanguage = (langCode: string) => {
    const valid = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
    const code = valid ? valid.code : 'en';

    setCurrentLang(code);
    localStorage.setItem('openaid_lang', code);
    setGoogleCookie(code);

    // Handle RTL for Arabic
    if (code === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', code);
    }

    // Trigger Google Translate engine
    const select = document.querySelector('select.goog-te-combo') as HTMLSelectElement | null;
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      select.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      // If the Google combo is not rendered yet, reload to trigger with cookie
      window.location.reload();
    }
  };

  useEffect(() => {
    // 1. Setup RTL/LTR on initial load
    if (currentLang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', currentLang);
    }

    // 2. Insert hidden google translate target div
    if (!document.getElementById('google_translate_element')) {
      const gtDiv = document.createElement('div');
      gtDiv.id = 'google_translate_element';
      gtDiv.style.cssText =
        'position: absolute !important; top: -9999px !important; left: -9999px !important; width: 1px !important; height: 1px !important; overflow: hidden !important; opacity: 0 !important; pointer-events: none !important;';
      document.body.appendChild(gtDiv);
    }

    // 3. Define the Google Translate Element initialization callback
    window.googleTranslateElementInit = function () {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,fr,es,pt,ar,vi',
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    // 4. Inject Google Translate script if not present
    if (!document.getElementById('openaid-gt-script')) {
      const gtScript = document.createElement('script');
      gtScript.id = 'openaid-gt-script';
      gtScript.type = 'text/javascript';
      gtScript.async = true;
      gtScript.src =
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.head.appendChild(gtScript);
    }

    // 5. Inject styles to completely hide Google Translate frames & banners
    if (!document.getElementById('openaid-gt-style')) {
      const style = document.createElement('style');
      style.id = 'openaid-gt-style';
      style.innerHTML = `
        .goog-te-banner-frame, .goog-te-banner-frame.skiptranslate {
          display: none !important;
          visibility: hidden !important;
          height: 0 !important;
          opacity: 0 !important;
          position: absolute !important;
          top: -9999px !important;
          pointer-events: none !important;
        }
        body {
          top: 0px !important;
          position: static !important;
        }
        #goog-gt-tt, .goog-te-balloon-frame {
          display: none !important;
        }
        .goog-text-highlight {
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .skiptranslate {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    // 6. Fix body position lock from Google banner
    const interval = setInterval(() => {
      if (document.body && document.body.style.top !== '0px' && document.body.style.top !== '') {
        document.body.style.setProperty('top', '0px', 'important');
      }
    }, 250);

    return () => clearInterval(interval);
  }, [currentLang]);

  const currentLanguageInfo =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, currentLanguageInfo }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

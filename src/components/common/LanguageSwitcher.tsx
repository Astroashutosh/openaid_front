import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';
import { ChevronDown, Check } from 'lucide-react';

interface LanguageSwitcherProps {
  theme?: 'admin' | 'dark' | 'light';
  align?: 'start' | 'end';
}

// Crisp Flag SVGs matching OpenAid Laravel partials/language_switcher.blade.php
const FlagIcon: React.FC<{ code: string }> = ({ code }) => {
  switch (code) {
    case 'en':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-5 h-[13px] rounded-xs shadow-xs object-cover shrink-0">
          <path d="M0 0h60v30H0z" fill="#b22234" />
          <path stroke="#fff" strokeWidth="2.3" d="M0 3.5h60M0 8.1h60M0 12.7h60M0 17.3h60M0 21.9h60M0 26.5h60" />
          <path fill="#3c3b6e" d="M0 0h24v16.15H0z" />
        </svg>
      );
    case 'fr':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className="w-5 h-[13px] rounded-xs shadow-xs object-cover shrink-0">
          <rect width="1" height="2" fill="#002395" />
          <rect width="1" height="2" x="1" fill="#fff" />
          <rect width="1" height="2" x="2" fill="#ed2939" />
        </svg>
      );
    case 'es':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className="w-5 h-[13px] rounded-xs shadow-xs object-cover shrink-0">
          <rect width="3" height="2" fill="#c60b1e" />
          <rect width="3" height="1" y="0.5" fill="#ffc400" />
        </svg>
      );
    case 'pt':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className="w-5 h-[13px] rounded-xs shadow-xs object-cover shrink-0">
          <rect width="1.2" height="2" fill="#006600" />
          <rect width="1.8" height="2" x="1.2" fill="#ff0000" />
          <circle cx="1.2" cy="1" r="0.35" fill="#ffcc00" />
        </svg>
      );
    case 'ar':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className="w-5 h-[13px] rounded-xs shadow-xs object-cover shrink-0">
          <rect width="3" height="2" fill="#006c35" />
          <path d="M0.8 1.1h1.4M0.9 0.9h1.2" stroke="#fff" strokeWidth="0.1" strokeLinecap="round" />
        </svg>
      );
    case 'vi':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className="w-5 h-[13px] rounded-xs shadow-xs object-cover shrink-0">
          <rect width="3" height="2" fill="#da251d" />
          <polygon fill="#ffff00" points="1.5,0.30 1.66,0.78 2.17,0.78 1.76,1.08 1.91,1.57 1.5,1.27 1.09,1.57 1.24,1.08 0.83,0.78 1.34,0.78" />
        </svg>
      );
    default:
      return null;
  }
};

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  theme = 'admin',
  align = 'end',
}) => {
  const { currentLang, setLanguage, currentLanguageInfo } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Theme-specific trigger button classes matching Laravel
  let buttonClasses = '';
  if (theme === 'admin') {
    buttonClasses =
      'bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-lg px-3 py-1.5 h-9 text-xs sm:text-sm font-semibold shadow-xs';
  } else if (theme === 'dark') {
    buttonClasses =
      'bg-white/10 hover:bg-amber-400/10 border border-[#d4a72c]/40 text-white hover:text-amber-300 rounded-full px-3.5 py-1.5 h-9 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-xs';
  } else {
    buttonClasses =
      'bg-white hover:bg-slate-50 border border-slate-200 text-[#113832] rounded-full px-3.5 py-1.5 h-9 text-xs sm:text-sm font-semibold shadow-xs';
  }

  return (
    <div className="relative inline-block select-none" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 cursor-pointer transition-all duration-150 ${buttonClasses}`}
        aria-expanded={isOpen}
      >
        <span className="inline-flex items-center justify-center">
          <FlagIcon code={currentLanguageInfo.code} />
        </span>
        <span className="font-bold">{currentLanguageInfo.name}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 opacity-80 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu matching Image 1 pixel-by-pixel */}
      {isOpen && (
        <div
          className={`absolute mt-2 w-52 bg-white rounded-2xl border border-black/10 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 ${
            align === 'end' ? 'right-0' : 'left-0'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-1.5 mb-1 border-b border-slate-100">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Select Language
            </span>
          </div>

          {/* List of 6 Languages */}
          <div className="px-1.5 space-y-0.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isActive = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'hover:bg-slate-100/80 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="inline-flex shrink-0">
                      <FlagIcon code={lang.code} />
                    </span>
                    <div className="flex flex-col leading-tight">
                      <strong className={`text-sm font-bold ${isActive ? 'text-emerald-700' : 'text-slate-900'}`}>
                        {lang.nativeName}
                      </strong>
                      <small className="text-[11px] text-slate-500 font-medium">
                        {lang.subname}
                      </small>
                    </div>
                  </div>

                  {isActive && (
                    <Check className="w-4 h-4 text-emerald-600 font-extrabold shrink-0" strokeWidth={3} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

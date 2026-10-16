import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS, buildAssetUrl } from '../config/api';

export interface GeneralSettings {
  id?: number;
  web_title: string;
  currency: string;
  symbol: string;
  logo: string;
  logo2?: string;
  logo_url: string;
  favicon: string;
  favicon_url: string;
  min_withdraw?: number;
  max_withdraw?: number;
  withdraw_fee?: number;
  min_deposit?: number;
  footer_content?: string;
  company_usdt_address?: string | null;
  company_withdraw_usdt_address?: string | null;
  updated_at?: string;
}

interface GeneralSettingsContextType {
  settings: GeneralSettings | null;
  logoUrl: string;
  faviconUrl: string;
  webTitle: string;
  currencySymbol: string;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const DEFAULT_SETTINGS: GeneralSettings = {
  web_title: 'OpenAid International',
  currency: 'USD',
  symbol: '$',
  logo: '1789125598_logo.png',
  logo_url: '/uploads/logo/1789125598_logo.png',
  favicon: '1789125724_favicon.png',
  favicon_url: '/uploads/logo/1789125724_favicon.png',
  footer_content: 'OpenAid International • Helping Community',
};

const GeneralSettingsContext = createContext<GeneralSettingsContextType | undefined>(undefined);

export const GeneralSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<GeneralSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastFetched, setLastFetched] = useState<number>(Date.now());

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_ENDPOINTS.COMMON.GENERAL_SETTINGS}?_t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setSettings(data.data);
          setLastFetched(Date.now());

          // Dynamically update document title if present
          if (data.data.web_title) {
            document.title = data.data.web_title;
          }

          // Dynamically update favicon if present
          const favUrl = data.data.favicon_url || (data.data.favicon ? `/uploads/logo/${data.data.favicon}` : '');
          if (favUrl) {
            const faviconLink = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
            if (faviconLink) {
              faviconLink.href = `${buildAssetUrl(favUrl)}?v=${Date.now()}`;
            }
          }
        }
      }
    } catch {
      // Gracefully fall back to defaults without blocking UI rendering
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Compute live asset URLs with cache-busting to ensure newly uploaded logos render immediately
  const rawLogo = settings.logo_url || (settings.logo ? `/uploads/logo/${settings.logo}` : DEFAULT_SETTINGS.logo_url);
  const rawFavicon = settings.favicon_url || (settings.favicon ? `/uploads/logo/${settings.favicon}` : DEFAULT_SETTINGS.favicon_url);
  const versionParam = `v=${lastFetched}`;
  const computedLogoUrl = `${buildAssetUrl(rawLogo)}${rawLogo.includes('?') ? '&' : '?'}${versionParam}`;
  const computedFaviconUrl = `${buildAssetUrl(rawFavicon)}${rawFavicon.includes('?') ? '&' : '?'}${versionParam}`;

  return (
    <GeneralSettingsContext.Provider
      value={{
        settings,
        logoUrl: computedLogoUrl,
        faviconUrl: computedFaviconUrl,
        webTitle: settings.web_title || DEFAULT_SETTINGS.web_title,
        currencySymbol: settings.symbol || '$',
        isLoading,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </GeneralSettingsContext.Provider>
  );
};

export const useGeneralSettings = (): GeneralSettingsContextType => {
  const context = useContext(GeneralSettingsContext);
  if (!context) {
    return {
      settings: DEFAULT_SETTINGS,
      logoUrl: DEFAULT_SETTINGS.logo_url,
      faviconUrl: DEFAULT_SETTINGS.favicon_url,
      webTitle: DEFAULT_SETTINGS.web_title,
      currencySymbol: '$',
      isLoading: false,
      refreshSettings: async () => {},
    };
  }
  return context;
};

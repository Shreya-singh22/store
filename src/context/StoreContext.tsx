import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchStorefront, StorefrontData } from '../lib/api';

interface StoreContextType {
  storeData: StorefrontData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const StoreContext = createContext<StoreContextType>({
  storeData: null,
  loading: true,
  error: null,
  refetch: () => {},
});

function applyBrandColors(customization: StorefrontData['customization']) {
  if (!customization?.brandColors) return;
  const root = document.documentElement;
  const c = customization.brandColors;

  root.style.setProperty('--color-primary', c.primary);
  root.style.setProperty('--color-secondary', c.secondary);
  root.style.setProperty('--color-accent', c.accent);
  root.style.setProperty('--color-text', c.textColor);
  root.style.setProperty('--header-bg', c.headerBackground);
  root.style.setProperty('--header-text', c.headerText);
  root.style.setProperty('--footer-bg', c.footerBackground);
  root.style.setProperty('--footer-text', c.footerText);
}

function loadGoogleFonts(customization: StorefrontData['customization']) {
  if (!customization?.typography) return;
  const { headingFont, bodyFont } = customization.typography;
  const fonts = [...new Set([headingFont, bodyFont].filter(Boolean))];
  fonts.forEach(font => {
    const id = `gfont-${font.replace(/\s/g, '-')}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(link);
  });
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [storeData, setStoreData] = useState<StorefrontData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStorefront();
      setStoreData(data);
      applyBrandColors(data.customization);
      loadGoogleFonts(data.customization);

      // Set meta tags from API
      if (data.customization?.metaTitle) document.title = data.customization.metaTitle;
      if (data.customization?.favicon) {
        const link = document.querySelector<HTMLLinkElement>('link[rel~="icon"]') || document.createElement('link');
        link.rel = 'icon';
        link.href = data.customization.favicon;
        document.head.appendChild(link);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load store');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <StoreContext.Provider value={{ storeData, loading, error, refetch: load }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}

// ─── Convenience selectors ────────────────────────────────────────────────────
export function useProducts() {
  const { storeData } = useStore();
  return storeData?.products ?? [];
}

export function useFeaturedProducts() {
  const products = useProducts();
  return products.filter(p => p.isFeatured);
}

export function useBestSellers() {
  const products = useProducts();
  return products.filter(p => p.isBestSeller);
}

export function useNewArrivals() {
  const products = useProducts();
  return products.filter(p => p.isNewArrival);
}

export function useAnnouncements() {
  const { storeData } = useStore();
  return storeData?.announcements ?? [];
}

export function useCustomization() {
  const { storeData } = useStore();
  return storeData?.customization ?? null;
}

export function useLegalPages() {
  const { storeData } = useStore();
  return storeData?.legalPages ?? [];
}

export function useCategories() {
  const { storeData } = useStore();
  return storeData?.categories ?? [];
}
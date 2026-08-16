import { useAuth } from "@/_core/hooks/useAuth";
import {
  DEFAULT_LINK_CONFIG,
  LINK_CONFIG_STORAGE_KEY,
  type LinkConfig,
  normalizeLinkConfig,
  persistLinkConfig,
  readLinkConfig,
} from "@/lib/linkConfig";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const ADMIN_VIEW_STORAGE_KEY = "ao-admin-view-enabled-v1";

type OwnerViewContextValue = {
  isOwner: boolean;
  isAdminView: boolean;
  setAdminView: (enabled: boolean) => void;
  toggleAdminView: () => void;
  linkConfig: LinkConfig;
  updateLink: (key: keyof LinkConfig, value: string) => void;
  resetLinks: () => void;
};

const OwnerViewContext = createContext<OwnerViewContextValue | null>(null);

function readAdminViewPreference(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ADMIN_VIEW_STORAGE_KEY) === "true";
}

export function OwnerViewProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const isOwner = user?.role === "admin";
  const [isAdminView, setIsAdminView] = useState(readAdminViewPreference);
  const [linkConfig, setLinkConfig] = useState<LinkConfig>(readLinkConfig);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ADMIN_VIEW_STORAGE_KEY, String(isAdminView));
  }, [isAdminView]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key === LINK_CONFIG_STORAGE_KEY) {
        try {
          setLinkConfig(event.newValue ? normalizeLinkConfig(JSON.parse(event.newValue)) : DEFAULT_LINK_CONFIG);
        } catch {
          setLinkConfig(DEFAULT_LINK_CONFIG);
        }
      }
      if (event.key === ADMIN_VIEW_STORAGE_KEY) {
        setIsAdminView(event.newValue === "true");
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setAdminView = useCallback((enabled: boolean) => {
    setIsAdminView(enabled);
  }, []);

  const toggleAdminView = useCallback(() => {
    setIsAdminView((current) => !current);
  }, []);

  const updateLink = useCallback((key: keyof LinkConfig, value: string) => {
    setLinkConfig((current) => {
      const next = normalizeLinkConfig({ ...current, [key]: value });
      persistLinkConfig(next);
      return next;
    });
  }, []);

  const resetLinks = useCallback(() => {
    setLinkConfig(DEFAULT_LINK_CONFIG);
    persistLinkConfig(DEFAULT_LINK_CONFIG);
  }, []);

  const value = useMemo<OwnerViewContextValue>(() => ({
    isOwner,
    isAdminView: isOwner && isAdminView,
    setAdminView,
    toggleAdminView,
    linkConfig,
    updateLink,
    resetLinks,
  }), [isOwner, isAdminView, setAdminView, toggleAdminView, linkConfig, updateLink, resetLinks]);

  return <OwnerViewContext.Provider value={value}>{children}</OwnerViewContext.Provider>;
}

export function useOwnerView() {
  const context = useContext(OwnerViewContext);
  if (!context) throw new Error("useOwnerView must be used inside OwnerViewProvider");
  return context;
}

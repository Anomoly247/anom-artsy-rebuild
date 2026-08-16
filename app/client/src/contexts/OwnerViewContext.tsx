import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  DEFAULT_LINK_CONFIG,
  LINK_CONFIG_STORAGE_KEY,
  type LinkConfig,
  normalizeLinkConfig,
  persistLinkConfig,
  readLinkConfig,
} from "@/lib/linkConfig";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type LinkPatch = Omit<Partial<LinkConfig>, "social" | "banner"> & {
  social?: Partial<LinkConfig["social"]>;
  banner?: Partial<LinkConfig["banner"]>;
};

const ADMIN_VIEW_STORAGE_KEY = "ao-admin-view-enabled-v1";

type OwnerViewContextValue = {
  isOwner: boolean;
  isAdminView: boolean;
  setAdminView: (enabled: boolean) => void;
  toggleAdminView: () => void;
  linkConfig: LinkConfig;
  updateLink: (patch: LinkPatch) => void;
  saveLinks: (config?: LinkConfig) => Promise<LinkConfig>;
  isSavingLinks: boolean;
  resetLinks: () => void;
};

const OwnerViewContext = createContext<OwnerViewContextValue | null>(null);

function readAdminViewPreference(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ADMIN_VIEW_STORAGE_KEY) === "true";
}

function toClientLinkConfig(value: {
  universe: string;
  store: string;
  social: LinkConfig["social"];
  banner: LinkConfig["banner"];
  partners: LinkConfig["partners"];
}): LinkConfig {
  return normalizeLinkConfig(value);
}

export function OwnerViewProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const isOwner = user?.role === "admin";
  const publicConfigQuery = trpc.ownerSettings.getPublicConfig.useQuery();
  const saveConfigMutation = trpc.ownerSettings.saveLinkConfig.useMutation();
  const [isAdminView, setIsAdminView] = useState(readAdminViewPreference);
  const [linkConfig, setLinkConfig] = useState<LinkConfig>(readLinkConfig);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ADMIN_VIEW_STORAGE_KEY, String(isAdminView));
  }, [isAdminView]);

  useEffect(() => {
    if (!publicConfigQuery.data) return;
    const remoteConfig = toClientLinkConfig(publicConfigQuery.data);
    setLinkConfig(remoteConfig);
    persistLinkConfig(remoteConfig);
  }, [publicConfigQuery.data]);

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

  const updateLink = useCallback((patch: LinkPatch) => {
    setLinkConfig((current) => {
      const next = normalizeLinkConfig({
        ...current,
        ...patch,
        social: { ...current.social, ...patch.social },
        banner: { ...current.banner, ...patch.banner },
      });
      persistLinkConfig(next);
      return next;
    });
  }, []);

  const saveLinks = useCallback(async (config?: LinkConfig) => {
    const configToSave = normalizeLinkConfig(config ?? linkConfig);
    const saved = await saveConfigMutation.mutateAsync({
      universeUrl: configToSave.universe,
      storeUrl: configToSave.store,
      socialLinks: configToSave.social,
      customBanner: configToSave.banner,
      partnerSites: configToSave.partners,
    });
    const next = toClientLinkConfig(saved);
    setLinkConfig(next);
    persistLinkConfig(next);
    return next;
  }, [linkConfig, saveConfigMutation]);

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
    saveLinks,
    isSavingLinks: saveConfigMutation.isPending,
    resetLinks,
  }), [isOwner, isAdminView, setAdminView, toggleAdminView, linkConfig, updateLink, saveLinks, saveConfigMutation.isPending, resetLinks]);

  return <OwnerViewContext.Provider value={value}>{children}</OwnerViewContext.Provider>;
}

export function useOwnerView() {
  const context = useContext(OwnerViewContext);
  if (!context) throw new Error("useOwnerView must be used inside OwnerViewProvider");
  return context;
}

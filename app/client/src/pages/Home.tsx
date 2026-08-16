import { Button } from "@/components/ui/button";
import { ImagePlus, Images, Zap, Users, Gamepad2, Heart, Sparkles, ShoppingBag, Upload, Palette } from "lucide-react";
import { startLogin } from "@/const";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import SignUpConnectors from "@/components/SignUpConnectors";
import HomepageIntegration from "@/components/HomepageIntegration";
import CustomBackgroundGallery, { type GalleryBackground } from "@/components/CustomBackgroundGallery";
import {
  BACKGROUND_STORAGE_KEY,
  persistBackground,
  persistBackgroundAppearance,
  readStoredBackground,
  readStoredBackgroundAppearance,
} from "../../../shared/backgroundStorage";
import {
  deactivateBackgroundImage,
  deleteBackgroundImage,
  getActiveBackgroundId,
  listBackgroundImages,
  saveBackgroundImageRecord,
  setActiveBackgroundId,
} from "../../../shared/backgroundImageStore";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const [backgroundUrl, setBackgroundUrl] = useState<string>(readStoredBackground);
  const [showBgMenu, setShowBgMenu] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [backgroundGallery, setBackgroundGallery] = useState<GalleryBackground[]>([]);
  const [activeBackgroundId, setActiveBackgroundIdState] = useState<string | null>(null);
  const [backgroundOpacity, setBackgroundOpacity] = useState(() => readStoredBackgroundAppearance().opacity);
  const [backgroundBlur, setBackgroundBlur] = useState(() => readStoredBackgroundAppearance().blur);
  const [backgroundLoaded, setBackgroundLoaded] = useState(() => readStoredBackground().startsWith('linear-gradient'));
  const objectUrlRef = useRef<string | null>(null);
  const galleryPreviewUrlsRef = useRef(new Map<string, string>());
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const backgroundRevisionRef = useRef(0);
  const backgroundPersistenceRef = useRef<Promise<unknown>>(Promise.resolve());

  const enqueueBackgroundPersistence = <T,>(task: () => Promise<T>): Promise<T> => {
    const previous = backgroundPersistenceRef.current.catch(() => undefined);
    const next = previous.then(task);
    backgroundPersistenceRef.current = next.catch(() => undefined);
    return next;
  };

  useEffect(() => {
    let active = true;

    void Promise.all([listBackgroundImages(), getActiveBackgroundId()]).then(([records, selectedId]) => {
      if (!active) return;
      const nextImages = records.map((record) => {
        const previewUrl = URL.createObjectURL(record.blob);
        galleryPreviewUrlsRef.current.set(record.id, previewUrl);
        return { ...record, previewUrl };
      });
      setBackgroundGallery(nextImages);
      setActiveBackgroundIdState(selectedId);

      const selected = (selectedId && nextImages.find((image) => image.id === selectedId)) || nextImages[0];
      if (selected && backgroundRevisionRef.current === 0) {
        objectUrlRef.current = selected.previewUrl;
        setActiveBackgroundIdState(selected.id);
        setBackgroundLoaded(false);
        setBackgroundUrl(selected.previewUrl);
        if (selected.id !== selectedId) void setActiveBackgroundId(selected.id);
      }
    });

    return () => {
      active = false;
      const urls = new Set(galleryPreviewUrlsRef.current.values());
      if (objectUrlRef.current) urls.add(objectUrlRef.current);
      urls.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
      galleryPreviewUrlsRef.current.clear();
      objectUrlRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (backgroundUrl.startsWith('linear-gradient')) {
      setBackgroundLoaded(true);
      return;
    }
    if (!backgroundUrl) {
      setBackgroundLoaded(true);
      return;
    }

    let active = true;
    setBackgroundLoaded(false);
    const image = new Image();
    image.onload = () => {
      if (active) setBackgroundLoaded(true);
    };
    image.onerror = () => {
      if (active) setBackgroundLoaded(true);
    };
    image.src = backgroundUrl;

    return () => {
      active = false;
    };
  }, [backgroundUrl]);

  useEffect(() => {
    persistBackgroundAppearance({ opacity: backgroundOpacity, blur: backgroundBlur });
  }, [backgroundOpacity, backgroundBlur]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-[#00eaff] text-xl">Loading Anom Artsy...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0e14] text-[#00eaff] flex flex-col">
        {/* Navigation */}
        <nav className="border-b border-[#2a2f3e] px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold neon-text-magenta">Anom Artsy</div>
            <Button onClick={startLogin} className="btn-neon-magenta">Sign In</Button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="flex-1 px-6 py-20">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6 inline-block bg-[#ff00cc]/20 border border-[#ff00cc] rounded-lg px-4 py-2">
                <p className="text-[#ff00cc] font-bold text-sm">🌍 Social Good First</p>
              </div>
              <h1 className="text-5xl font-bold mb-6">
                <span className="neon-text-magenta">Identity</span>
                <span className="text-[#00eaff]">, Amplified</span>
              </h1>
              <p className="text-lg text-[#7a7f8e] mb-8">
                Join the Anom Artsy community — a neon-lit sanctuary where family comes first, creativity thrives, and your identity matters. Every interaction drives real-world social good impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={startLogin} className="btn-neon-cyan text-lg py-6 px-8">
                  Enter the Universe
                </Button>
                <a href="/mission-hub">
                  <Button className="bg-[#ff00cc] hover:bg-[#ff00cc]/80 text-black font-bold text-lg py-6 px-8">
                    💜 Support Our Mission
                  </Button>
                </a>
              </div>
            </div>
            <SignUpConnectors />
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-gradient-to-r from-[#ff00cc]/10 to-[#00eaff]/10 border-t border-[#ff00cc] px-6 py-16">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              <span className="neon-text-magenta">Social Good</span>
              <span className="text-[#00eaff]"> Meets </span>
              <span className="neon-text-magenta">Creative Power</span>
            </h2>
            <p className="text-[#7a7f8e] max-w-2xl mx-auto mb-6">
              Every coin earned, every collaboration started, every voice amplified—it all drives real impact. Join artists, creators, and visionaries building a better world together.
            </p>
            <a href="/mission-hub">
              <Button className="btn-neon-magenta text-lg py-4 px-8">
                Explore the Mission
              </Button>
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-[#1a1f2e] border-t border-[#2a2f3e] px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 neon-text-magenta">
              What Awaits You
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-4" style={{boxShadow: '0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)'}}>
                <Zap className="w-8 h-8 text-[#ff00cc] mb-4" />
                <h3 className="text-xl font-bold text-[#00eaff] mb-2">Anom Coin Economy</h3>
                <p className="text-[#7a7f8e]">
                  Earn coins through social good actions, games, and community engagement. Spend them on profile decorations and exclusive lounges.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-4" style={{boxShadow: '0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)'}}>
                <Users className="w-8 h-8 text-[#00eaff] mb-4" />
                <h3 className="text-xl font-bold text-[#ff00cc] mb-2">Private Lounges</h3>
                <p className="text-[#7a7f8e]">
                  Create family, friend, and coworker lounges. Chat, share goals, and customize your space with neon themes.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-4" style={{boxShadow: '0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)'}}>
                <Gamepad2 className="w-8 h-8 text-[#ff00cc] mb-4" />
                <h3 className="text-xl font-bold text-[#00eaff] mb-2">Mini-Games</h3>
                <p className="text-[#7a7f8e]">
                  Play Trivia, Memory, Mood Matcher, and Snack Vault Rush. Earn coins and climb the leaderboard.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-4" style={{boxShadow: '0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)'}}>
                <Heart className="w-8 h-8 text-[#00eaff] mb-4" />
                <h3 className="text-xl font-bold text-[#ff00cc] mb-2">Anom's Corner</h3>
                <p className="text-[#7a7f8e] text-sm mb-4">
                  A safe space for children to watch Pixel & Dot episodes, play Off-Grid Adventure, and color.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-4" style={{boxShadow: '0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)'}}>
                <Sparkles className="w-8 h-8 text-[#ff00cc] mb-4" />
                <h3 className="text-xl font-bold text-[#00eaff] mb-2">Profile Customization</h3>
                <p className="text-[#7a7f8e]">
                  Apply neon themes, character badges, and mood glows to your profile. No coding required.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-4" style={{boxShadow: '0 0 10px rgba(255, 0, 204, 0.5), 0 0 20px rgba(255, 0, 204, 0.3)'}}>
                <ShoppingBag className="w-8 h-8 text-[#00eaff] mb-4" />
                <h3 className="text-xl font-bold text-[#ff00cc] mb-2">Custom Merch</h3>
                <p className="text-[#7a7f8e]">
                  Request your bespoke artwork. We create and fulfill it through our trusted partners.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-[#00eaff]">
              Ready to join the Anom Universe?
            </h2>
            <Button onClick={startLogin} className="btn-neon-magenta text-lg py-6 px-8">
              Get Started Now
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#2a2f3e] px-6 py-8 text-center text-[#7a7f8e]">
          <p>&copy; 2026 Anom Artsy. Identity, Amplified.</p>
        </footer>
      </div>
    );
  }

  const releaseTransientBackgroundUrl = () => {
    const currentUrl = objectUrlRef.current;
    if (currentUrl && !Array.from(galleryPreviewUrlsRef.current.values()).includes(currentUrl)) {
      URL.revokeObjectURL(currentUrl);
    }
    objectUrlRef.current = null;
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      backgroundRevisionRef.current += 1;
      releaseTransientBackgroundUrl();
      const objectUrl = URL.createObjectURL(file);
      objectUrlRef.current = objectUrl;
      setBackgroundLoaded(false);
      setBackgroundUrl(objectUrl);
      try {
        localStorage.removeItem(BACKGROUND_STORAGE_KEY);
      } catch {
        // A restricted localStorage bucket should not block the preview.
      }
      setShowBgMenu(false);
      const uploadRevision = backgroundRevisionRef.current;
      void enqueueBackgroundPersistence(async () => {
        const record = await saveBackgroundImageRecord(file, file.name);
        if (record) await setActiveBackgroundId(record.id);
        return record;
      }).then((record) => {
        if (backgroundRevisionRef.current !== uploadRevision) return;
        if (record) {
          galleryPreviewUrlsRef.current.set(record.id, objectUrl);
          setBackgroundGallery((current) => [
            { ...record, previewUrl: objectUrl },
            ...current.filter((image) => image.id !== record.id),
          ]);
          setActiveBackgroundIdState(record.id);
          toast.success('Background updated and saved for future sessions!');
        } else {
          toast.success('Background updated for this session. Persistent storage is unavailable.');
        }
      });
    } catch {
      toast.error('This image could not be used as a background. Try a smaller image.');
    }
  };

  const handleSelectBackground = (id: string) => {
    const selected = backgroundGallery.find((image) => image.id === id);
    if (!selected) return;

    backgroundRevisionRef.current += 1;
    releaseTransientBackgroundUrl();
    objectUrlRef.current = selected.previewUrl;
    setActiveBackgroundIdState(id);
    setBackgroundLoaded(false);
    setBackgroundUrl(selected.previewUrl);
    try {
      localStorage.removeItem(BACKGROUND_STORAGE_KEY);
    } catch {
      // A restricted localStorage bucket should not block selection.
    }
    void enqueueBackgroundPersistence(() => setActiveBackgroundId(id));
    toast.success(`${selected.name} is now active.`);
  };

  const handleDeleteBackground = (id: string) => {
    const imageToDelete = backgroundGallery.find((image) => image.id === id);
    if (!imageToDelete) return;

    const remaining = backgroundGallery.filter((image) => image.id !== id);
    const fallback = activeBackgroundId === id ? remaining[0] : undefined;
    const isCurrentUrl = objectUrlRef.current === imageToDelete.previewUrl;
    if (isCurrentUrl) {
      objectUrlRef.current = null;
    }
    URL.revokeObjectURL(imageToDelete.previewUrl);
    galleryPreviewUrlsRef.current.delete(id);
    setBackgroundGallery(remaining);

    if (fallback) {
      backgroundRevisionRef.current += 1;
      objectUrlRef.current = fallback.previewUrl;
      setActiveBackgroundIdState(fallback.id);
      setBackgroundLoaded(false);
      setBackgroundUrl(fallback.previewUrl);
      void enqueueBackgroundPersistence(async () => {
        await deleteBackgroundImage(id);
        return setActiveBackgroundId(fallback.id);
      });
    } else if (activeBackgroundId === id) {
      backgroundRevisionRef.current += 1;
      setActiveBackgroundIdState(null);
      setBackgroundLoaded(true);
      setBackgroundUrl("");
      void enqueueBackgroundPersistence(async () => {
        await deleteBackgroundImage(id);
        return deactivateBackgroundImage();
      });
    } else {
      void enqueueBackgroundPersistence(() => deleteBackgroundImage(id));
    }
    toast.success(`${imageToDelete.name} was removed from your gallery.`);
  };

  const handlePresetBackground = (preset: string) => {
    const presets: Record<string, string> = {
      gradient1: 'linear-gradient(135deg, rgba(255, 0, 204, 0.1) 0%, rgba(0, 234, 255, 0.1) 100%)',
      gradient2: 'linear-gradient(135deg, rgba(157, 78, 221, 0.1) 0%, rgba(255, 0, 204, 0.1) 100%)',
      gradient3: 'linear-gradient(135deg, rgba(0, 234, 255, 0.1) 0%, rgba(0, 255, 136, 0.1) 100%)',
    };
    const nextBackground = presets[preset] || '';
    backgroundRevisionRef.current += 1;
    releaseTransientBackgroundUrl();
    setActiveBackgroundIdState(null);
    setBackgroundLoaded(true);
    setBackgroundUrl(nextBackground);
    void enqueueBackgroundPersistence(() => deactivateBackgroundImage());
    if (persistBackground(nextBackground)) {
      toast.success('Background preset applied!');
    } else {
      toast.success('Background preset applied for this session. Browser storage is unavailable.');
    }
    setShowBgMenu(false);
  };

  // Authenticated Dashboard
  return (
    <div 
      className="min-h-screen bg-[#0b0e14] text-[#00eaff]"
      style={{
        backgroundImage: backgroundUrl.startsWith('linear-gradient') ? backgroundUrl : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {backgroundUrl && !backgroundUrl.startsWith('linear-gradient') && (
        <div 
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `url(${backgroundUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: backgroundLoaded ? backgroundOpacity : 0,
            filter: `blur(${backgroundBlur}px)`,
            transform: backgroundBlur > 0 ? 'scale(1.03)' : 'scale(1)',
            transition: 'opacity 700ms cubic-bezier(0.23, 1, 0.32, 1), filter 250ms ease-out, transform 250ms ease-out',
          }}
        />
      )}
      <CustomBackgroundGallery
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        images={backgroundGallery}
        activeId={activeBackgroundId}
        opacity={backgroundOpacity}
        blur={backgroundBlur}
        onSelect={handleSelectBackground}
        onDelete={handleDeleteBackground}
        onUpload={() => fileInputRef.current?.click()}
        onOpacityChange={setBackgroundOpacity}
        onBlurChange={setBackgroundBlur}
      />
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-[#2a2f3e] bg-[#0b0e14]/95 px-3 py-3 backdrop-blur sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="shrink-0 text-xl font-bold neon-text-magenta sm:text-2xl">Anom Artsy</div>
          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center sm:gap-4">
            <span className="col-span-2 min-w-0 truncate text-xs text-[#7a7f8e] sm:col-span-1 sm:text-sm">Welcome, {user?.name}</span>
            <div className="relative min-w-0">
              <Button 
                onClick={() => setShowBgMenu(!showBgMenu)}
                className="w-full bg-[#00ffff]/15 text-[#00ffff] hover:bg-[#00ffff]/25 sm:w-auto"
                size="sm"
              >
                <Palette className="w-4 h-4 mr-2" />
                Background
              </Button>
              {showBgMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-4 shadow-lg z-50">
                  <div className="space-y-2">
                    <button
                      onClick={() => handlePresetBackground('gradient1')}
                      className="w-full text-left px-3 py-2 rounded hover:bg-[#2a2f3e] text-[#00ffff] text-sm"
                    >
                      Magenta-Cyan
                    </button>
                    <button
                      onClick={() => handlePresetBackground('gradient2')}
                      className="w-full text-left px-3 py-2 rounded hover:bg-[#2a2f3e] text-[#00ffff] text-sm"
                    >
                      Purple-Magenta
                    </button>
                    <button
                      onClick={() => handlePresetBackground('gradient3')}
                      className="w-full text-left px-3 py-2 rounded hover:bg-[#2a2f3e] text-[#00ffff] text-sm"
                    >
                      Cyan-Green
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGalleryOpen(true);
                        setShowBgMenu(false);
                      }}
                      className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm text-[#ff00ff] hover:bg-[#2a2f3e]"
                    >
                      <Images className="h-4 w-4" />
                      Open Gallery ({backgroundGallery.length})
                    </button>
                    <label className="w-full text-left px-3 py-2 rounded hover:bg-[#2a2f3e] text-[#00ffff] text-sm cursor-pointer flex items-center">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBackgroundUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
            {user?.role === 'admin' && (
              <Button onClick={() => navigate('/owner')} className="w-full bg-[#00ffff] font-bold text-[#0b0e14] hover:bg-[#00ffff]/80 sm:w-auto">
                Owner Panel
              </Button>
            )}
            <Button variant="outline" onClick={logout} className="w-full border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff]/10 hover:text-[#00ffff] sm:w-auto">
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {/* Glow Points */}
          <div className="rounded-lg border border-[#00ffff]/70 bg-[#1a1f2e] p-4" style={{boxShadow: '0 0 14px rgba(0, 255, 255, 0.35), 0 0 28px rgba(0, 255, 255, 0.14)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7a7f8e] text-sm">Glow Points</p>
                <p className="text-3xl font-bold text-[#00ffff]">0 GP</p>
              </div>
              <Zap className="w-8 h-8 text-[#00ffff]" />
            </div>
          </div>

          {/* Level / progression */}
          <div className="rounded-lg border border-[#ffd700]/70 bg-[#1a1f2e] p-4" style={{boxShadow: '0 0 14px rgba(255, 215, 0, 0.32), 0 0 28px rgba(255, 215, 0, 0.12)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7a7f8e] text-sm">Your Level</p>
                <p className="text-3xl font-bold text-[#ffd700]">1</p>
              </div>
              <Sparkles className="w-8 h-8 text-[#ffd700]" />
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#0b0e14]" aria-label="Confidence Path progression">
              <div className="h-full w-1/4 rounded-full bg-gradient-to-r from-[#ffd700] to-[#00ffff]" />
            </div>
          </div>

          {/* Achievements */}
          <div className="rounded-lg border border-[#00ffff]/70 bg-[#1a1f2e] p-4" style={{boxShadow: '0 0 14px rgba(0, 255, 255, 0.32), 0 0 28px rgba(0, 255, 255, 0.12)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7a7f8e] text-sm">Achievements</p>
                <p className="text-3xl font-bold text-[#00ffff]">0</p>
              </div>
              <Heart className="w-8 h-8 text-[#ff00ff]" />
            </div>
          </div>

          {/* Lounges */}
          <div className="rounded-lg border border-[#00ffff]/70 bg-[#1a1f2e] p-4" style={{boxShadow: '0 0 14px rgba(0, 255, 255, 0.32), 0 0 28px rgba(0, 255, 255, 0.12)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#7a7f8e] text-sm">Your Lounges</p>
                <p className="text-3xl font-bold text-[#00ffff]">0</p>
              </div>
              <Users className="w-8 h-8 text-[#00ffff]" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-[#00ffff]/70 bg-[#1a1f2e] p-4" style={{boxShadow: '0 0 14px rgba(0, 255, 255, 0.32), 0 0 28px rgba(0, 255, 255, 0.12)'}}>
            <h3 className="text-xl font-bold text-[#00ffff] mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full btn-neon-cyan" onClick={() => navigate("/profile")}>
                View Profile
              </Button>
              <Button className="w-full btn-neon-cyan" onClick={() => navigate("/lounges")}>
                Browse Lounges
              </Button>
              <Button className="w-full btn-neon-gold" onClick={() => navigate("/achievements")}>
                View Achievements
              </Button>
              <Button className="w-full btn-neon-cyan" onClick={() => navigate("/kids-corner")}>
                Anom's Corner
              </Button>
              <Button className="w-full btn-neon-cyan" onClick={() => navigate("/feed")}>
                Social Feed
              </Button>
              <Button className="w-full btn-neon-outline" onClick={() => navigate("/games")}>
                Play Games
              </Button>
              <Button className="w-full btn-neon-cyan" onClick={() => navigate("/merch")}>
                Custom Merch
              </Button>
              <Button className="w-full btn-neon-cyan" onClick={() => navigate("/collaboration")}>
                Collaboration Station
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-[#00ffff]/70 bg-[#1a1f2e] p-4" style={{boxShadow: '0 0 14px rgba(0, 255, 255, 0.32), 0 0 28px rgba(0, 255, 255, 0.12)'}}>
            <h3 className="text-xl font-bold text-[#00ffff] mb-4">Live from the Universe</h3>
            <p className="text-[#7a7f8e] text-sm">
              Check back soon for community highlights, memes, and universe updates!
            </p>
          </div>
        </div>

        {/* Homepage Integration */}
        <div className="mt-12">
          <HomepageIntegration />
        </div>
      </main>
    </div>
  );
}

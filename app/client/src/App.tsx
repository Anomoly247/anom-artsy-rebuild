import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/_core/hooks/useAuth";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Wallet from "./pages/Wallet";
import Achievements from "./pages/Achievements";
import Lounges from "./pages/Lounges";
import LoungeDetail from "./pages/LoungeDetail";
import KidsCorner from "./pages/KidsCorner";
import SocialFeed from "./pages/SocialFeed";
import Games from "./pages/Games";
import DistrictBArcade from "./pages/DistrictBArcade";
import Admin from "./pages/Admin";
import PublicProfile from "./pages/PublicProfile";
import CollaborationStation from "./pages/CollaborationStation";
import OwnerControlPanel from "./pages/OwnerControlPanel";
import OwnerSettings from "./pages/OwnerSettings";
import CliffordAndTater from "./pages/CliffordAndTater";
import CreatorWorlds from "./pages/CreatorWorlds";
import Broadcast from "./pages/Broadcast";
import NeonGallery from "./pages/NeonGallery";
import PixelAndDot from "./pages/PixelAndDot";
import ColorCustomizer from "./components/ColorCustomizer";
import YouTubeManager from "./pages/YouTubeManager";
import PaymentMerchManagement from "./pages/PaymentMerchManagement";
import Store from "./pages/Store";
import BusinessControlCenter from "./pages/BusinessControlCenter";
import ChatWidget from "./components/ChatWidget";
import SocialGoodScoreBadge from "./components/SocialGoodScoreBadge";
import MissionRally from "./pages/MissionRally";
import MissionHub from "./pages/MissionHub";
import MusicLibrary from "./pages/MusicLibrary";
import Login from "./pages/Login";
import { AUTH_ENTRY_ROUTES } from "./authEntryRoutes";
import AnomsCornerWorld from "./pages/AnomsCornerWorld";
import { MoonberryFarm, StoryArchiveDetail, StoryArchiveIndex } from "./pages/StoryDestinations";
import PixelProfile from "./pages/PixelProfile";
import DotProfile from "./pages/DotProfile";
import ExternalRedirect from "./components/ExternalRedirect";
import { useOwnerView } from "./contexts/OwnerViewContext";
import { OwnerViewProvider } from "./contexts/OwnerViewContext";
import { OwnerPanel, OwnerViewToggle } from "./components/OwnerViewControls";
import UniverseMapPage from "./pages/UniverseMapPage";

const OpenUniverse = () => {
  const { linkConfig } = useOwnerView();
  return <ExternalRedirect destination={linkConfig.universe} label="Anom's Universe" />;
};
const AppRoutes = () => {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={UniverseMapPage} />
      <Route path={"/sanctuary"} component={OpenUniverse} />
      <Route path={"/clifford-and-tater"} component={CliffordAndTater} />
      <Route path={"/creator-worlds"} component={CreatorWorlds} />
      <Route path={"/broadcast"} component={Broadcast} />
      <Route path={"/neon-gallery"} component={NeonGallery} />
      <Route path={"/pixel-and-dot"} component={PixelAndDot} />
      <Route path={"/shop"} component={Store} />
      <Route path={"/store"} component={Store} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/wallet"} component={Wallet} />
      <Route path={"/achievements"} component={Achievements} />
      <Route path={"/lounges"} component={Lounges} />
      <Route path={"/lounges/:loungeId"} component={LoungeDetail} />
      <Route path={"/kids-corner"} component={KidsCorner} />
      <Route path={"/anoms-corner"} component={AnomsCornerWorld} />
      <Route path={"/moonberry-farm"} component={MoonberryFarm} />
      <Route path={"/archive"} component={StoryArchiveIndex} />
      <Route path={"/archive/:slug"} component={StoryArchiveDetail} />
      <Route path={"/characters/pixel"} component={PixelProfile} />
      <Route path={"/characters/dot"} component={DotProfile} />
      <Route path={"/feed"} component={SocialFeed} />
      <Route path={"/district-b-arcade"} component={DistrictBArcade} />
      <Route path={"/games"} component={Games} />
      <Route path="/merch" component={Store} />
      {AUTH_ENTRY_ROUTES.map((path) => <Route key={path} path={path} component={Login} />)}
      <Route path="/admin" component={Admin} />
      <Route path="/collaboration" component={CollaborationStation} />
      <Route path="/owner-settings" component={OwnerSettings} />
      <Route path="/youtube-manager" component={YouTubeManager} />
      <Route path="/payment-merch" component={PaymentMerchManagement} />
      <Route path="/business-control" component={BusinessControlCenter} />
      <Route path="/profile/:userId" component={PublicProfile} />
      <Route path="/mission" component={MissionRally} />
      <Route path="/mission-hub" component={MissionHub} />
      <Route path="/music-library" component={MusicLibrary} />
      <Route path="/owner" component={OwnerControlPanel} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
};

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster
            position="top-right"
            richColors
            closeButton
            expand
            visibleToasts={4}
            toastOptions={{
              duration: 4500,
              classNames: {
                toast: 'border-2 border-[#00eaff] bg-[#0b0e14] text-white shadow-[0_0_30px_rgba(0,234,255,0.25)] animate-in slide-in-from-right-4 fade-in duration-300',
                title: 'font-semibold text-white',
                description: 'text-gray-400',
                success: 'border-[#00ff88] shadow-[0_0_30px_rgba(0,255,136,0.25)]',
                error: 'border-[#ff00cc] shadow-[0_0_30px_rgba(255,0,204,0.3)]',
              },
            }}
          />
          <OwnerViewProvider>
            <OwnerViewToggle />
            <ColorCustomizer />
            <AppRoutes />
            <OwnerPanel />
            {isAuthenticated && <SocialGoodScoreBadge />}
            {isAuthenticated && <ChatWidget />}
          </OwnerViewProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

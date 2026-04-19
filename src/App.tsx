import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ContactsPage from "./pages/ContactsPage";
import ArtistsPage from "./pages/ArtistsPage";
import ArtistDetail from "./pages/ArtistDetail";
import CasesPage from "./pages/CasesPage";
import MusicPage from "./pages/MusicPage";
import ReleaseDetail from "./pages/ReleaseDetail";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import NewsPage from "./pages/NewsPage";
import NewsDetail from "./pages/NewsDetail";
import GalleryPage from "./pages/GalleryPage";
import GalleryAlbumPage from "./pages/GalleryAlbumPage";
import MerchPage from "./pages/MerchPage";
import MerchDetail from "./pages/MerchDetail";
import BarsCalendarPage from "./pages/BarsCalendarPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/artists/:slug" element={<ArtistDetail />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/music/:slug" element={<ReleaseDetail />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/gallery/:slug" element={<GalleryAlbumPage />} />
          <Route path="/merch" element={<MerchPage />} />
          <Route path="/merch/:slug" element={<MerchDetail />} />
          <Route path="/bars" element={<BarsCalendarPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

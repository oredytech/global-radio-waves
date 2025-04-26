
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import News from "./pages/News";
import Countries from "./pages/Countries";
import Categories from "./pages/Categories";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import RadioPlayer from "@/components/RadioPlayer";
import StationPlayerPage from "./pages/StationPlayerPage";
import WorldMap from "./pages/WorldMap";
import GenresExplorer from "./pages/GenresExplorer";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AudioPlayerProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <div className="flex flex-col min-h-screen bg-gowera-background overflow-x-hidden">
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/countries" element={<Countries />} />
                  <Route path="/genres" element={<Categories />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/world-map" element={<WorldMap />} />
                  <Route path="/station/:stationSlug" element={<StationPlayerPage />} />
                  <Route path="/genres" element={<GenresExplorer />} />
                  <Route path="/stations/genre/:genreName" element={<Categories />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <div className="pb-40">
                <Footer />
              </div>
              <RadioPlayer />
              <NavBar />
            </div>
          </TooltipProvider>
        </AudioPlayerProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;

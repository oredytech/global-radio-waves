
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";
import NavBar from "@/components/NavBar";
import News from "./pages/News";
import Countries from "./pages/Countries";
import Categories from "./pages/Categories";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import RadioPlayer from "@/components/RadioPlayer";
import StationDetail from "./pages/StationDetail";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  useEffect(() => {
    // Add space at bottom for player if needed
    document.documentElement.style.setProperty('--player-height', '0px');
    
    return () => {
      document.documentElement.style.removeProperty('--player-height');
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AudioPlayerProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/news" element={<News />} />
              <Route path="/countries" element={<Countries />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Updated route to handle any station slug */}
              <Route path="/station/:stationId" element={<StationDetail />} />
              <Route path="/radio/:stationId" element={<StationDetail />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <RadioPlayer />
            <NavBar />
          </BrowserRouter>
        </TooltipProvider>
      </AudioPlayerProvider>
    </QueryClientProvider>
  );
};

export default App;

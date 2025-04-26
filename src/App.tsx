
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import News from "./pages/News";
import Countries from "./pages/Countries";
import Categories from "./pages/Categories";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import RadioPlayer from "@/components/RadioPlayer";
import StationDetail from "./pages/StationDetail";
import { useState } from "react";
import MenuDrawer from "@/components/MenuDrawer";
import About from "./pages/About";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  
  const handleMenuClick = () => {
    setDrawerOpen(true);
  };
  
  const handleContinentClick = (continent: string) => {
    setSelectedContinent(continent);
    setDrawerOpen(false);
  };

  const continents = ['Afrique', 'Europe', 'Amérique du Nord', 'Amérique du Sud', 'Asie', 'Océanie'];

  return (
    <QueryClientProvider client={queryClient}>
      <AudioPlayerProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <div className="flex flex-col min-h-screen">
              <Header
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onMenuClick={handleMenuClick}
              />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/countries" element={<Countries />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/station/:stationId" element={<StationDetail />} />
                  <Route path="/radio/:stationId" element={<StationDetail />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <RadioPlayer />
              <NavBar />
              <MenuDrawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                onContinentClick={handleContinentClick}
                continents={continents}
                selectedContinent={selectedContinent}
              />
            </div>
          </TooltipProvider>
        </BrowserRouter>
      </AudioPlayerProvider>
    </QueryClientProvider>
  );
};

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import ScrollToTop from "@/components/ScrollToTop"; // Add this import
import Index from "./pages/Index";
import Analyzer from "./pages/Analyzer";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Builder_page from "./pages/Builder_page";
import JobTracker from "./pages/JobTracker";
import AboutMe from "./pages/AboutMe";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop /> {/* Add this component inside BrowserRouter */}
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/analyzer" element={<Analyzer />} />
              <Route path="/about" element={<About />} />
              <Route path="/aboutme" element={<AboutMe />} />
              <Route path="/builder" element={<Builder_page />} />
              <Route path="/tracker" element={<JobTracker />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
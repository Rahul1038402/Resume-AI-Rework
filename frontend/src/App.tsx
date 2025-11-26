import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./LandingPage/index";
import Analyzer from "./ResumeAnalyzer/index";
import About from "./AboutUs/index";
import NotFound from "./NotFound/index";
import JobTracker from "./JobTracker/index";
import AboutMe from "./AboutMe/index";
import ATSComparisonPage from "./ATSComp/index";
import ResumeBuilder from "./ResumeBuilder/index";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/analyzer" element={<Analyzer />} />
              <Route path="/about" element={<About />} />
              <Route path="/aboutme" element={<AboutMe />} />
              <Route path="/builder" element={<ResumeBuilder />} />
              <Route path="/tracker" element={<JobTracker />} />
              <Route path="/ats" element={<ATSComparisonPage />} />
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
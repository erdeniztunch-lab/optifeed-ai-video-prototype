import "./lib/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LayoutDashboard, Database, Upload, LayoutTemplate, BarChart3, Megaphone } from "lucide-react";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Videos from "./pages/Videos.tsx";
import { PlaceholderPage } from "./pages/PlaceholderPage.tsx";

const queryClient = new QueryClient();

const App = () => {
  const { t } = useTranslation();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/dashboard" element={<PlaceholderPage title={t("nav.dashboard")} description={t("placeholder.dashboard")} icon={LayoutDashboard} />} />
            <Route path="/feed-sources" element={<PlaceholderPage title={t("nav.feedSources")} description={t("placeholder.feedSources")} icon={Database} />} />
            <Route path="/exports" element={<PlaceholderPage title={t("nav.exports")} description={t("placeholder.exports")} icon={Upload} />} />
            <Route path="/templates" element={<PlaceholderPage title={t("nav.dynamicCreative")} description={t("placeholder.dynamicCreative")} icon={LayoutTemplate} />} />
            <Route path="/analytics" element={<PlaceholderPage title={t("nav.analytics")} description={t("placeholder.analytics")} icon={BarChart3} />} />
            <Route path="/meta-ads" element={<PlaceholderPage title={t("nav.metaAds")} description={t("placeholder.metaAds")} icon={Megaphone} />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

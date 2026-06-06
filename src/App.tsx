import "./lib/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LayoutDashboard, Database, Upload, LayoutTemplate, BarChart3, Megaphone } from "lucide-react";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Videos from "./pages/Videos.tsx";
import { PlaceholderPage } from "./pages/PlaceholderPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" description="Kampanya performansınızı ve önemli metrikleri buradan takip edebileceksiniz." icon={LayoutDashboard} />} />
          <Route path="/feed-sources" element={<PlaceholderPage title="Feed Sources" description="Ürün feed kaynaklarınızı yönetin ve yeni kaynaklar ekleyin." icon={Database} />} />
          <Route path="/exports" element={<PlaceholderPage title="Exports" description="Dışa aktarılan feed'lerinizi ve indirme geçmişinizi görüntüleyin." icon={Upload} />} />
          <Route path="/templates" element={<PlaceholderPage title="Dynamic Creative" description="Dinamik yaratıcı şablonlarınızı oluşturun ve yönetin." icon={LayoutTemplate} />} />
          <Route path="/analytics" element={<PlaceholderPage title="GA4 Analytics" description="Google Analytics 4 verilerinizi doğrudan bu ekrandan görüntüleyin." icon={BarChart3} />} />
          <Route path="/meta-ads" element={<PlaceholderPage title="Meta Ads" description="Meta reklam kampanyalarınızı yönetin ve performansı izleyin." icon={Megaphone} />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

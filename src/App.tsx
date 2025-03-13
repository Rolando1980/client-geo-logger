
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { AnimatePresence } from "framer-motion";

// Páginas
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ClientList from "./pages/ClientList";
import ClientForm from "./pages/ClientForm";
import VisitForm from "./pages/VisitForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clients" element={<ClientList />} />
              <Route path="/client/new" element={<ClientForm />} />
              <Route path="/client/edit/:id" element={<ClientForm />} />
              <Route path="/visit" element={<VisitForm />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

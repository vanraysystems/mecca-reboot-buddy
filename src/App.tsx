import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Rooms from "./pages/Rooms";
import Dining from "./pages/Dining";
import Book from "./pages/Book";
import Intake from "./pages/Intake";
import Order from "./pages/Order";
import Confirm from "./pages/Confirm";
import Admin from "./pages/Admin";
import Ops from "./pages/Ops";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/dining" element={<Dining />} />
          <Route path="/book" element={<Book />} />
          <Route path="/intake" element={<Intake />} />
          <Route path="/order" element={<Order />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/ops" element={<Ops />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

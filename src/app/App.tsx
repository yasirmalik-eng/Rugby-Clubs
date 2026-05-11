import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { AuthProvider } from "../context/AuthContext";
import { WelshNavbar } from "./components/WelshNavbar";
import { WelshFooter } from "./components/WelshFooter";
import { SEO } from "./components/SEO";
import { ScrollToTop } from "./components/ScrollToTop";
import { Toaster } from "sonner";

// Public pages
import { HomePage } from "./pages/HomePage";
import { FixturesPage } from "./pages/FixturesPage";
import { TicketsPage } from "./pages/TicketsPage";
import { DonationPage } from "./pages/DonationPage";
import { DonationSuccessPage } from "./pages/DonationSuccessPage";
import { ClubPage } from "./pages/ClubPage";
import { NewsPage } from "./pages/NewsPage";
import { SponsorsPage } from "./pages/SponsorsPage";
import { ContactPage } from "./pages/ContactPage";
import { NewsDetailPage } from "./pages/NewsDetailPage";
import { CheckoutSuccessPage } from "./pages/CheckoutSuccessPage";

// Auth pages
import { LoginPage } from "./pages/auth/LoginPage";
import { AuthCallbackPage } from "./pages/auth/AuthCallbackPage";

// Admin pages
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { FixturesAdmin } from "./pages/admin/FixturesAdmin";
import { BlogAdmin } from "./pages/admin/BlogAdmin";
import { TicketsAdmin } from "./pages/admin/TicketsAdmin";
import { OrdersAdmin } from "./pages/admin/OrdersAdmin";
import { SponsorsAdmin } from "./pages/admin/SponsorsAdmin";
import { UsersAdmin } from "./pages/admin/UsersAdmin";

function AppShell() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthRoute = location.pathname.startsWith("/auth");
  const hidePublicChrome = isAdminRoute || isAuthRoute;

  return (
    <div className="min-h-screen bg-black">
      <SEO
        title="North Wales Crusaders | Rugby Club | Eirias Stadium"
        description="North Wales Crusaders Rugby Club – buy tickets, view fixtures, and follow the latest news."
        keywords="North Wales Crusaders, rugby, tickets, fixtures, Welsh rugby"
      />
      {!hidePublicChrome && <WelshNavbar />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/fixtures" element={<FixturesPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/donate" element={<DonationPage />} />
          <Route path="/donate/success" element={<DonationSuccessPage />} />
          <Route path="/tickets/success" element={<CheckoutSuccessPage />} />
          <Route path="/club" element={<ClubPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:slug" element={<NewsDetailPage />} />
          <Route path="/sponsors" element={<SponsorsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          {/* Admin — wrapped in AdminLayout (role guard) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="fixtures" element={<FixturesAdmin />} />
            <Route path="blog" element={<BlogAdmin />} />
            <Route path="tickets" element={<TicketsAdmin />} />
            <Route path="sponsors" element={<SponsorsAdmin />} />
            <Route path="orders" element={<OrdersAdmin />} />
            <Route path="users" element={<UsersAdmin />} />
          </Route>
        </Routes>
      </main>
      {!hidePublicChrome && <WelshFooter />}
      <ScrollToTop />
      <Toaster position="bottom-right" richColors theme="dark" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}

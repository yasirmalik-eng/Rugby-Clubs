import { useState, useEffect } from "react";
import { WelshNavbar } from "./components/WelshNavbar";
import { WelshFooter } from "./components/WelshFooter";
import { SEO } from "./components/SEO";
import { ScrollToTop } from "./components/ScrollToTop";

import { HomePage } from "./pages/HomePage";
import { TicketsPage } from "./pages/TicketsPage";
import { NewsPage } from "./pages/NewsPage";
import { SponsorsPage } from "./pages/SponsorsPage";
import { DonatePage } from "./pages/DonatePage";
import { FixturesPage } from "./pages/FixturesPage";

/* ✅ FIXED TYPE */
interface SelectedMatch {
  id: string;
  match: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const [selectedMatch, setSelectedMatch] =
    useState<SelectedMatch | null>(null);

  /* ✅ IMPORTANT: LISTEN CUSTOM NAVIGATION EVENTS */
  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail?.page) {
        setCurrentPage(e.detail.page);
      }
    };

    window.addEventListener("navigate", handler);

    return () => window.removeEventListener("navigate", handler);
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant" as ScrollBehavior,
    });
  }, [currentPage]);

  /* NAVIGATION HANDLER */
  const handleNavigate = (page: string, data?: SelectedMatch) => {
    setCurrentPage(page);

    if (data) {
      setSelectedMatch(data);
    }
  };

  /* PAGE ROUTER */
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;

      case "fixtures":
        return <FixturesPage onNavigate={handleNavigate} />;

      case "tickets":
        return (
          <TicketsPage selectedMatch={selectedMatch || undefined} />
        );

      case "news":
        return <NewsPage />;

      case "sponsors":
        return <SponsorsPage />;

      case "donate":
        return <DonatePage />;

      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <SEO
        title="North Wales Crusaders | Rugby League Club"
        description="Official rugby league club website"
        keywords="rugby, wales, tickets, fixtures"
      />

      <WelshNavbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      <main>{renderPage()}</main>

      <WelshFooter onNavigate={handleNavigate} />

      <ScrollToTop />
    </div>
  );
}
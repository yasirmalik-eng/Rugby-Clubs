import { useState, useEffect } from "react";
import { WelshNavbar } from "./components/WelshNavbar";
import { WelshFooter } from "./components/WelshFooter";
import { SEO } from "./components/SEO";
import { ScrollToTop } from "./components/ScrollToTop";

import { HomePage } from "./pages/HomePage";
import { FixturesPage } from "./pages/FixturesPage";
import { TicketsPage } from "./pages/TicketsPage";
import { NewsPage } from "./pages/NewsPage";
import { SponsorsPage } from "./pages/SponsorsPage";
import { DonatePage } from "./pages/DonatePage";

interface SelectedMatch {
  match: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  /* SELECTED MATCH STATE */
  const [selectedMatch, setSelectedMatch] =
    useState<SelectedMatch | null>(null);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant" as ScrollBehavior,
    });
  }, [currentPage]);

  /* NAVIGATION */
  const handleNavigate = (
    page: string,
    data?: SelectedMatch
  ) => {
    setCurrentPage(page);

    if (data) {
      setSelectedMatch(data);
    }
  };

  /* PAGES */
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;

      case "fixtures":
        return <FixturesPage onNavigate={handleNavigate} />;

      case "tickets":
        return (
          <TicketsPage
            selectedMatch={selectedMatch || undefined}
          />
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
        title="North Wales Crusaders | Rugby League Club | Eirias Stadium"
        description="Official North Wales Crusaders website. Buy match tickets, season passes, support the club, view fixtures, and stay updated with the latest rugby league news."
        keywords="North Wales Crusaders, rugby league Wales, Eirias Stadium, rugby tickets, season tickets, Welsh rugby club"
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
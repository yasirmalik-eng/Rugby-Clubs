import { useState, useEffect } from "react";
import { WelshNavbar } from "./components/WelshNavbar";
import { WelshFooter } from "./components/WelshFooter";
import { SEO } from "./components/SEO";
import { ScrollToTop } from "./components/ScrollToTop";
import { HomePage } from "./pages/HomePage";
import { FixturesPage } from "./pages/FixturesPage";
import { TicketsPage } from "./pages/TicketsPage";
import { ClubPage } from "./pages/ClubPage";
import { NewsPage } from "./pages/NewsPage";
import { SponsorsPage } from "./pages/SponsorsPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentPage]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "fixtures":
        return <FixturesPage onNavigate={handleNavigate} />;
      case "tickets":
        return <TicketsPage />;
      case "club":
        return <ClubPage />;
      case "news":
        return <NewsPage />;
      case "sponsors":
        return <SponsorsPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <SEO
        title="Welsh Rugby Club | Premier Rugby in North Wales | Eirias Stadium"
        description="Join Welsh RFC - 127 years of rugby excellence in North Wales. Buy tickets, view fixtures, and experience the passion of Welsh rugby at Eirias Stadium."
        keywords="Welsh rugby, North Wales rugby, Eirias Stadium, rugby tickets, Welsh Premier Division, rugby club Wales"
      />
      <WelshNavbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main>
        {renderPage()}
      </main>
      <WelshFooter onNavigate={handleNavigate} />
      <ScrollToTop />
    </div>
  );
}
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import MarketOverview from "@/components/MarketOverview";
import PriceTrendsChart from "@/components/PriceTrendsChart";
import PriceForecast from "@/components/PriceForecast";
import MarketSentiment from "@/components/MarketSentiment";
import InvestmentRecommendations from "@/components/InvestmentRecommendations";
import PropertySearch from "@/components/PropertySearch";
import PropertyScraper from "@/components/PropertyScraper";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user && (activeTab === "scraper")) {
      navigate("/auth");
    }
  }, [user, loading, activeTab, navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            <MarketOverview />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PriceTrendsChart />
              <InvestmentRecommendations />
            </div>
          </div>
        );
      case "scraper":
        return <PropertyScraper />;
      case "trends":
        return (
          <div className="space-y-8">
            <PriceTrendsChart />
            <MarketOverview />
          </div>
        );
      case "forecast":
        return <PriceForecast />;
      case "sentiment":
        return <MarketSentiment />;
      case "recommendations":
        return <InvestmentRecommendations />;
      case "search":
        return <PropertySearch />;
      default:
        return <MarketOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-6 py-8">
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              © 2024 Hyderabad Property Seer. Real estate analytics and investment intelligence platform.
            </p>
            <p className="text-xs">
              Data sources: Market research, historical trends, and development pipeline analysis.
              Investment recommendations are for informational purposes only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

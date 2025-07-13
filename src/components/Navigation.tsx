import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  TrendingUp, 
  Search, 
  Target, 
  Activity,
  Home 
} from "lucide-react";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation = ({ activeTab, setActiveTab }: NavigationProps) => {
  const navItems = [
    {
      id: "overview",
      label: "Market Overview",
      icon: Home,
      description: "Key metrics and trends"
    },
    {
      id: "trends",
      label: "Price Trends",
      icon: BarChart3,
      description: "Historical price analysis"
    },
    {
      id: "forecast",
      label: "Price Forecast",
      icon: TrendingUp,
      description: "6-month predictions"
    },
    {
      id: "sentiment",
      label: "Market Sentiment",
      icon: Activity,
      description: "Investor confidence analysis"
    },
    {
      id: "recommendations",
      label: "Investment Ideas",
      icon: Target,
      description: "Top investment opportunities"
    },
    {
      id: "search",
      label: "Property Search",
      icon: Search,
      description: "Find and analyze properties"
    }
  ];

  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex-shrink-0 flex flex-col items-center gap-1 h-auto py-3 px-4 rounded-none border-b-2 border-transparent hover:bg-muted/50 transition-all duration-200",
                  isActive && "border-primary bg-primary/5 text-primary"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
                <span className="text-xs font-medium whitespace-nowrap">
                  {item.label}
                </span>
                <span className="text-xs text-muted-foreground hidden lg:block">
                  {item.description}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
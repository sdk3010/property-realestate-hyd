import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Home, MapPin, IndianRupee } from "lucide-react";

const MarketOverview = () => {
  const marketMetrics = [
    {
      title: "Average Price/Sqft",
      value: "₹4,250",
      change: "+5.2%",
      trend: "up",
      icon: IndianRupee,
      description: "Across all localities"
    },
    {
      title: "Active Listings",
      value: "2,847",
      change: "+12.3%",
      trend: "up",
      icon: Home,
      description: "Properties available"
    },
    {
      title: "Hot Localities",
      value: "15",
      change: "+8.7%",
      trend: "up",
      icon: MapPin,
      description: "High demand areas"
    },
    {
      title: "Market Sentiment",
      value: "Bullish",
      change: "Strong",
      trend: "up",
      icon: TrendingUp,
      description: "Investor confidence"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {marketMetrics.map((metric, index) => {
        const Icon = metric.icon;
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown;
        
        return (
          <Card key={index} className="bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">
                {metric.value}
              </div>
              <div className="flex items-center space-x-1">
                <TrendIcon className={`h-3 w-3 ${metric.trend === "up" ? "text-accent" : "text-destructive"}`} />
                <span className={`text-xs ${metric.trend === "up" ? "text-accent" : "text-destructive"}`}>
                  {metric.change}
                </span>
                <span className="text-xs text-muted-foreground">
                  from last month
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MarketOverview;
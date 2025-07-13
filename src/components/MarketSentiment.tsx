import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, Users, Target, AlertCircle } from "lucide-react";

const MarketSentiment = () => {
  const sentimentData = {
    overall: {
      score: 78,
      status: "Bullish",
      description: "Strong investor confidence with moderate caution"
    },
    factors: [
      {
        name: "Buyer Confidence",
        score: 82,
        trend: "up",
        impact: "High",
        description: "Increased buying activity in premium segments"
      },
      {
        name: "Price Stability",
        score: 75,
        trend: "up",
        impact: "Medium",
        description: "Steady price appreciation across localities"
      },
      {
        name: "Inventory Levels",
        score: 68,
        trend: "down",
        impact: "Medium",
        description: "Reduced inventory putting upward pressure on prices"
      },
      {
        name: "Lending Conditions",
        score: 85,
        trend: "up",
        impact: "High",
        description: "Favorable interest rates supporting purchases"
      }
    ]
  };

  const marketIndicators = [
    {
      title: "Active Buyers",
      value: "2,340",
      change: "+15%",
      icon: Users,
      trend: "up"
    },
    {
      title: "Avg. Time on Market",
      value: "45 days",
      change: "-8 days",
      icon: Activity,
      trend: "up"
    },
    {
      title: "Price Negotiations",
      value: "12%",
      change: "-3%",
      icon: Target,
      trend: "up"
    }
  ];

  const getSentimentColor = (score: number) => {
    if (score >= 80) return "text-accent";
    if (score >= 60) return "text-primary";
    if (score >= 40) return "text-real-estate-accent";
    return "text-destructive";
  };

  const getSentimentBg = (score: number) => {
    if (score >= 80) return "bg-accent";
    if (score >= 60) return "bg-primary";
    if (score >= 40) return "bg-real-estate-accent";
    return "bg-destructive";
  };

  return (
    <div className="space-y-6">
      {/* Overall Sentiment */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Market Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold mb-2">
              <span className={getSentimentColor(sentimentData.overall.score)}>
                {sentimentData.overall.score}
              </span>
              <span className="text-muted-foreground">/100</span>
            </div>
            <Badge 
              className={`${getSentimentBg(sentimentData.overall.score)} text-white mb-2`}
              variant="secondary"
            >
              {sentimentData.overall.status}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {sentimentData.overall.description}
            </p>
          </div>

          <div className="space-y-4">
            {sentimentData.factors.map((factor, index) => {
              const TrendIcon = factor.trend === "up" ? TrendingUp : TrendingDown;
              return (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{factor.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${factor.impact === 'High' ? 'border-destructive text-destructive' : 'border-primary text-primary'}`}
                      >
                        {factor.impact} Impact
                      </Badge>
                      <TrendIcon className={`h-3 w-3 ${factor.trend === "up" ? "text-accent" : "text-destructive"}`} />
                    </div>
                  </div>
                  <Progress 
                    value={factor.score} 
                    className="mb-2"
                  />
                  <p className="text-xs text-muted-foreground">{factor.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Market Indicators */}
      <Card className="bg-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Key Market Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketIndicators.map((indicator, index) => {
              const Icon = indicator.icon;
              const TrendIcon = indicator.trend === "up" ? TrendingUp : TrendingDown;
              
              return (
                <div key={index} className="border border-border rounded-lg p-4 text-center">
                  <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-xl font-bold text-foreground mb-1">
                    {indicator.value}
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <TrendIcon className={`h-3 w-3 ${indicator.trend === "up" ? "text-accent" : "text-destructive"}`} />
                    <span className={`text-xs ${indicator.trend === "up" ? "text-accent" : "text-destructive"}`}>
                      {indicator.change}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {indicator.title}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Market Alerts */}
      <Card className="bg-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-real-estate-accent" />
            Market Alerts & Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
              <TrendingUp className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Strong demand in Gachibowli corridor
                </p>
                <p className="text-xs text-muted-foreground">
                  Properties selling 20% faster than market average
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <AlertCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  New metro line announcements expected
                </p>
                <p className="text-xs text-muted-foreground">
                  Potential impact on Outer Ring Road properties
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-real-estate-accent/10 border border-real-estate-accent/20">
              <Target className="h-4 w-4 text-real-estate-accent mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Luxury segment showing resilience
                </p>
                <p className="text-xs text-muted-foreground">
                  Premium properties (₹1Cr+) maintaining steady demand
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketSentiment;
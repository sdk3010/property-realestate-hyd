import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, TrendingUp, IndianRupee, Clock } from "lucide-react";

const InvestmentRecommendations = () => {
  const recommendations = [
    {
      locality: "Nallagandla",
      averagePrice: "₹4,200/sqft",
      expectedGrowth: "18-22%",
      investmentRating: 4.8,
      timeframe: "2-3 years",
      reasons: ["Metro connectivity", "IT hub proximity", "Infrastructure development"],
      riskLevel: "Medium",
      sentiment: "Very Positive"
    },
    {
      locality: "Kokapet",
      averagePrice: "₹3,800/sqft",
      expectedGrowth: "15-20%",
      investmentRating: 4.6,
      timeframe: "3-4 years",
      reasons: ["Affordable pricing", "Growing IT presence", "Good connectivity"],
      riskLevel: "Medium-Low",
      sentiment: "Positive"
    },
    {
      locality: "Kompally",
      averagePrice: "₹3,200/sqft",
      expectedGrowth: "20-25%",
      investmentRating: 4.4,
      timeframe: "4-5 years",
      reasons: ["Emerging location", "Lower entry cost", "Future metro plans"],
      riskLevel: "Medium-High",
      sentiment: "Optimistic"
    },
    {
      locality: "Miyapur",
      averagePrice: "₹3,600/sqft",
      expectedGrowth: "12-16%",
      investmentRating: 4.2,
      timeframe: "2-3 years",
      reasons: ["Metro station", "Established area", "Good amenities"],
      riskLevel: "Low",
      sentiment: "Stable"
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "bg-accent/20 text-accent";
      case "Medium-Low": return "bg-primary/20 text-primary";
      case "Medium": return "bg-real-estate-accent/20 text-real-estate-accent";
      case "Medium-High": return "bg-destructive/20 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Very Positive": return "text-accent";
      case "Positive": return "text-primary";
      case "Optimistic": return "text-real-estate-accent";
      case "Stable": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Card className="bg-card border-0 shadow-soft">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
          <Star className="h-5 w-5 text-real-estate-accent" />
          Investment Recommendations
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Top localities for property investment based on current market analysis
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="border border-border rounded-lg p-4 bg-gradient-card hover:shadow-soft transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-foreground">{rec.locality}</h3>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < Math.floor(rec.investmentRating) ? 'text-real-estate-accent fill-current' : 'text-muted'}`} 
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">({rec.investmentRating})</span>
                  </div>
                </div>
                <Badge className={getRiskColor(rec.riskLevel)} variant="secondary">
                  {rec.riskLevel} Risk
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Price:</span>
                  <span className="text-sm font-medium">{rec.averagePrice}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-accent" />
                  <span className="text-sm text-muted-foreground">Growth:</span>
                  <span className="text-sm font-medium text-accent">{rec.expectedGrowth}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Timeline:</span>
                  <span className="text-sm font-medium">{rec.timeframe}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">Sentiment:</span>
                  <span className={`text-sm font-medium ${getSentimentColor(rec.sentiment)}`}>
                    {rec.sentiment}
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-1">Key Investment Drivers:</p>
                <div className="flex flex-wrap gap-1">
                  {rec.reasons.map((reason, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {reason}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button 
                size="sm" 
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                View Properties in {rec.locality}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentRecommendations;
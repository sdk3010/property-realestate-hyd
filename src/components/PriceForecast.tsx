import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { TrendingUp, Calendar, Target } from "lucide-react";

const PriceForecast = () => {
  const forecastData = [
    { 
      locality: "Hitech City", 
      current: 6300, 
      forecast6m: 6800, 
      growth: 7.9,
      confidence: "High",
      factors: ["IT expansion", "Infrastructure"]
    },
    { 
      locality: "Gachibowli", 
      current: 6000, 
      forecast6m: 6500, 
      growth: 8.3,
      confidence: "High",
      factors: ["Metro connectivity", "Corporate hubs"]
    },
    { 
      locality: "Madhapur", 
      current: 6800, 
      forecast6m: 7300, 
      growth: 7.4,
      confidence: "Medium",
      factors: ["Premium location", "Limited supply"]
    },
    { 
      locality: "Kondapur", 
      current: 4950, 
      forecast6m: 5400, 
      growth: 9.1,
      confidence: "High",
      factors: ["Emerging IT hub", "Value for money"]
    },
    { 
      locality: "Kokapet", 
      current: 3800, 
      forecast6m: 4200, 
      growth: 10.5,
      confidence: "Medium",
      factors: ["New developments", "Growing demand"]
    },
    { 
      locality: "Nallagandla", 
      current: 4200, 
      forecast6m: 4650, 
      growth: 10.7,
      confidence: "High",
      factors: ["Metro proximity", "Development potential"]
    }
  ];

  const propertyTypeForecast = [
    { type: "2 BHK Apartments", current: "₹45-65L", forecast: "₹48-70L", growth: "+6.8%" },
    { type: "3 BHK Apartments", current: "₹65-95L", forecast: "₹70-102L", growth: "+7.4%" },
    { type: "4 BHK Apartments", current: "₹95-150L", forecast: "₹102-162L", growth: "+8.0%" },
    { type: "Villas", current: "₹1.2-2.5Cr", forecast: "₹1.3-2.7Cr", growth: "+8.5%" },
    { type: "Plots", current: "₹15-45L", forecast: "₹16-49L", growth: "+9.2%" }
  ];

  const getGrowthColor = (growth: number) => {
    if (growth >= 10) return "#10B981"; // High growth - green
    if (growth >= 8) return "#3B82F6"; // Medium growth - blue
    if (growth >= 6) return "#F59E0B"; // Moderate growth - orange
    return "#EF4444"; // Low growth - red
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "High": return "bg-accent/20 text-accent";
      case "Medium": return "bg-primary/20 text-primary";
      case "Low": return "bg-real-estate-accent/20 text-real-estate-accent";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-medium">
          <p className="font-medium text-foreground mb-1">{data.locality}</p>
          <p className="text-sm text-muted-foreground">Current: ₹{data.current.toLocaleString()}/sqft</p>
          <p className="text-sm text-accent">6M Forecast: ₹{data.forecast6m.toLocaleString()}/sqft</p>
          <p className="text-sm text-primary">Growth: +{data.growth}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Locality Price Forecast Chart */}
      <Card className="bg-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            6-Month Price Forecast by Locality
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Expected price movements based on market analysis and development pipeline
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="locality" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₹${value/1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="current" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="forecast6m" radius={[4, 4, 0, 0]}>
                  {forecastData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getGrowthColor(entry.growth)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forecastData.map((item, index) => (
              <div key={index} className="border border-border rounded-lg p-4 bg-gradient-card">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-foreground">{item.locality}</h3>
                  <Badge className={getConfidenceColor(item.confidence)} variant="secondary">
                    {item.confidence}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current:</span>
                    <span className="font-medium">₹{item.current.toLocaleString()}/sqft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">6M Forecast:</span>
                    <span className="font-medium text-accent">₹{item.forecast6m.toLocaleString()}/sqft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Growth:</span>
                    <span className="font-medium text-primary">+{item.growth}%</span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Key Factors:</p>
                  <div className="flex flex-wrap gap-1">
                    {item.factors.map((factor, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Property Type Forecast */}
      <Card className="bg-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Target className="h-4 w-4 text-real-estate-accent" />
            Property Type Price Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {propertyTypeForecast.map((property, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg bg-gradient-card">
                <div>
                  <p className="font-medium text-foreground">{property.type}</p>
                  <p className="text-sm text-muted-foreground">Current Range</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{property.current}</p>
                  <p className="text-sm font-medium text-accent">{property.forecast}</p>
                </div>
                <Badge 
                  className="bg-primary/20 text-primary" 
                  variant="secondary"
                >
                  {property.growth}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Forecast Methodology */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Forecast Methodology
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-foreground mb-2">Data Sources</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Historical price trends (24 months)</li>
                <li>• Current market inventory</li>
                <li>• Development pipeline analysis</li>
                <li>• Infrastructure project timelines</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Key Factors</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Supply-demand dynamics</li>
                <li>• Economic indicators</li>
                <li>• Policy changes impact</li>
                <li>• Seasonal market patterns</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Disclaimer:</strong> Forecasts are based on current market conditions and historical data. 
              Actual prices may vary due to unforeseen market events, policy changes, or economic factors.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceForecast;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const PriceTrendsChart = () => {
  const priceData = [
    { month: "Jan 2024", Hitech: 5200, Gachibowli: 4800, Kondapur: 4100, Madhapur: 5500, Jubilee: 3800 },
    { month: "Feb 2024", Hitech: 5350, Gachibowli: 4950, Kondapur: 4200, Madhapur: 5650, Jubilee: 3850 },
    { month: "Mar 2024", Hitech: 5400, Gachibowli: 5100, Kondapur: 4350, Madhapur: 5800, Jubilee: 3900 },
    { month: "Apr 2024", Hitech: 5500, Gachibowli: 5200, Kondapur: 4400, Madhapur: 5900, Jubilee: 3950 },
    { month: "May 2024", Hitech: 5650, Gachibowli: 5350, Kondapur: 4500, Madhapur: 6100, Jubilee: 4000 },
    { month: "Jun 2024", Hitech: 5700, Gachibowli: 5400, Kondapur: 4600, Madhapur: 6200, Jubilee: 4100 },
    { month: "Jul 2024", Hitech: 5800, Gachibowli: 5500, Kondapur: 4650, Madhapur: 6300, Jubilee: 4150 },
    { month: "Aug 2024", Hitech: 5900, Gachibowli: 5600, Kondapur: 4700, Madhapur: 6400, Jubilee: 4200 },
    { month: "Sep 2024", Hitech: 6000, Gachibowli: 5700, Kondapur: 4800, Madhapur: 6500, Jubilee: 4250 },
    { month: "Oct 2024", Hitech: 6100, Gachibowli: 5800, Kondapur: 4850, Madhapur: 6600, Jubilee: 4300 },
    { month: "Nov 2024", Hitech: 6200, Gachibowli: 5900, Kondapur: 4900, Madhapur: 6700, Jubilee: 4350 },
    { month: "Dec 2024", Hitech: 6300, Gachibowli: 6000, Kondapur: 4950, Madhapur: 6800, Jubilee: 4400 }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-medium">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: ₹{entry.value.toLocaleString()}/sqft
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-card border-0 shadow-soft">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">
          Price Trends by Locality (₹/sqft)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          12-month price movement across key Hyderabad localities
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₹${value/1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Hitech" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="Gachibowli" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="Kondapur" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="Madhapur" 
                stroke="hsl(var(--chart-4))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-4))", strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="Jubilee" 
                stroke="hsl(var(--chart-5))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-5))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceTrendsChart;
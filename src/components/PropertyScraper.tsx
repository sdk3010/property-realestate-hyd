import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ScrapedProperty {
  id: string;
  url: string;
  title: string;
  price: string;
  locality: string;
  bhk_type: string;
  area: string;
  amenities: string[];
  contact_info: string;
  investment_score: number;
  market_sentiment: string;
  scraped_at: string;
}

const PropertyScraper = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scrapedProperties, setScrapedProperties] = useState<ScrapedProperty[]>([]);
  const { toast } = useToast();

  const validateMagicBricksUrl = (url: string) => {
    return url.includes('magicbricks.com') && (url.includes('/flats-') || url.includes('/property-'));
  };

  const handleScrapeProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateMagicBricksUrl(url)) {
      setError("Please enter a valid MagicBricks property URL");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.functions.invoke('scrape-property', {
        body: { url }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast({
          title: "Property scraped successfully!",
          description: `Added ${data.property.title} to your properties`,
        });
        
        setScrapedProperties(prev => [data.property, ...prev]);
        setUrl("");
      } else {
        setError(data.error || "Failed to scrape property");
      }
    } catch (error) {
      console.error("Scraping error:", error);
      setError("Failed to scrape property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadUserProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('scraped_properties')
        .select('*')
        .order('scraped_at', { ascending: false });

      if (error) throw error;
      setScrapedProperties(data || []);
    } catch (error) {
      console.error("Error loading properties:", error);
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('scraped_properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setScrapedProperties(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Property deleted",
        description: "Property has been removed from your list",
      });
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    }
  };

  // Load properties on component mount
  useState(() => {
    loadUserProperties();
  });

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'bullish': return "text-green-600";
      case 'bearish': return "text-red-600";
      default: return "text-yellow-600";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Property from MagicBricks
          </CardTitle>
          <CardDescription>
            Paste a MagicBricks property URL to scrape and analyze property details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleScrapeProperty} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="property-url">MagicBricks Property URL</Label>
              <Input
                id="property-url"
                type="url"
                placeholder="https://www.magicbricks.com/flats-..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                Example: https://www.magicbricks.com/flats-in-hyderabad-for-sale
              </p>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Scrape Property
            </Button>
          </form>
        </CardContent>
      </Card>

      {scrapedProperties.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Scraped Properties</h3>
          
          {scrapedProperties.map((property) => (
            <Card key={property.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{property.title}</CardTitle>
                    <CardDescription>
                      {property.locality} • {property.bhk_type}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteProperty(property.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-semibold text-lg">{property.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Area</p>
                    <p className="font-medium">{property.area}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Investment Score</p>
                    <p className={`font-bold text-lg ${getScoreColor(property.investment_score)}`}>
                      {property.investment_score}/10
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Market Sentiment</p>
                    <p className={`font-medium capitalize ${getSentimentColor(property.market_sentiment)}`}>
                      {property.market_sentiment}
                    </p>
                  </div>
                </div>

                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.slice(0, 6).map((amenity, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                        >
                          {amenity}
                        </span>
                      ))}
                      {property.amenities.length > 6 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                          +{property.amenities.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Scraped: {new Date(property.scraped_at).toLocaleDateString()}</span>
                  <Button variant="outline" size="sm" asChild>
                    <a href={property.url} target="_blank" rel="noopener noreferrer">
                      View Original
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyScraper;
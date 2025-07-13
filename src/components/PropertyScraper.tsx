import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Search, 
  Building2, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  TrendingUp,
  Star,
  ExternalLink,
  Loader2,
  Home,
  DollarSign
} from 'lucide-react';

interface ScrapedProperty {
  id: string;
  title: string;
  developer: string;
  price: number;
  price_per_sqft: number;
  super_area: number;
  transaction_type: string;
  furnishing_status: string;
  bathrooms: number;
  possession_date: string;
  description: string;
  location: string;
  images: string[];
  amenities: string[];
  sentiment_score: number;
  investment_rating: string;
  url: string;
}

const PropertyScraper = () => {
  const [url, setUrl] = useState('');
  const [property, setProperty] = useState<ScrapedProperty | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleScrapeProperty = async () => {
    if (!url.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid MagicBricks property URL.",
      });
      return;
    }

    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to scrape properties.",
      });
      return;
    }

    setLoading(true);

    try {
      // Call the edge function to scrape the property
      const { data, error } = await supabase.functions.invoke('scrape-property', {
        body: { url, userId: user.id }
      });

      if (error) {
        throw error;
      }

      setProperty(data.property);
      toast({
        title: "Property scraped successfully!",
        description: "Property details have been extracted and saved.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Scraping failed",
        description: error.message || "Failed to scrape property. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const getRatingColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'average': return 'bg-yellow-500';
      case 'below average': return 'bg-orange-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Property Scraper
          </CardTitle>
          <CardDescription>
            Paste a MagicBricks property URL to extract detailed information and insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Paste MagicBricks property URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleScrapeProperty} 
              disabled={loading}
              className="min-w-[120px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Scrape
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {property && (
        <div className="space-y-6">
          {/* Property Header */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{property.title}</CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span>{property.developer}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <a
                  href={property.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Original
                </a>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Price</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    ₹{property.price_per_sqft.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Per Sq.Ft</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {property.super_area}
                  </div>
                  <div className="text-sm text-muted-foreground">Sq.Ft</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {property.bathrooms}
                  </div>
                  <div className="text-sm text-muted-foreground">Bathrooms</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Property Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Transaction Type</div>
                    <Badge variant="secondary">{property.transaction_type}</Badge>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Furnishing</div>
                    <Badge variant="outline">{property.furnishing_status}</Badge>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Possession</div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{property.possession_date}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Area</div>
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      <span>{property.super_area} sq.ft</span>
                    </div>
                  </div>
                </div>

                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Amenities</div>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.slice(0, 6).map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {property.amenities.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{property.amenities.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Investment Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Investment Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Investment Rating</span>
                    <Badge className={getRatingColor(property.investment_rating)}>
                      {property.investment_rating}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Market Sentiment</span>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">
                        {property.sentiment_score}/5.0
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Quick Insights</div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• Price per sq.ft: ₹{property.price_per_sqft.toLocaleString()}</div>
                      <div>• Total investment: {formatPrice(property.price)}</div>
                      <div>• {property.transaction_type} property with {property.furnishing_status} furnishing</div>
                      <div>• Ready for possession: {property.possession_date}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Property Description */}
          {property.description && (
            <Card>
              <CardHeader>
                <CardTitle>Property Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Property Images */}
          {property.images && property.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Property Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {property.images.slice(0, 8).map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={image}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyScraper;
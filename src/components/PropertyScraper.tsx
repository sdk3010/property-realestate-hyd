import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DollarSign,
  BarChart3,
  PieChart,
  Activity
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

interface PropertyAnalytics {
  averagePrice: number;
  averagePricePerSqft: number;
  averageArea: number;
  averageSentiment: number;
  totalProperties: number;
  locationCounts: { [key: string]: number };
  ratingCounts: { [key: string]: number };
  priceRange: { min: number; max: number };
}

const PropertyScraper = () => {
  const [url, setUrl] = useState('');
  const [properties, setProperties] = useState<ScrapedProperty[]>([]);
  const [analytics, setAnalytics] = useState<PropertyAnalytics | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<ScrapedProperty | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMultiple, setIsMultiple] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const calculateAnalytics = (props: ScrapedProperty[]): PropertyAnalytics => {
    if (props.length === 0) return {
      averagePrice: 0,
      averagePricePerSqft: 0,
      averageArea: 0,
      averageSentiment: 0,
      totalProperties: 0,
      locationCounts: {},
      ratingCounts: {},
      priceRange: { min: 0, max: 0 }
    };

    const averagePrice = props.reduce((sum, p) => sum + p.price, 0) / props.length;
    const averagePricePerSqft = props.reduce((sum, p) => sum + p.price_per_sqft, 0) / props.length;
    const averageArea = props.reduce((sum, p) => sum + p.super_area, 0) / props.length;
    const averageSentiment = props.reduce((sum, p) => sum + p.sentiment_score, 0) / props.length;
    
    const locationCounts: { [key: string]: number } = {};
    const ratingCounts: { [key: string]: number } = {};
    
    props.forEach(p => {
      const location = p.location.split(',')[0]; // Get main area
      locationCounts[location] = (locationCounts[location] || 0) + 1;
      ratingCounts[p.investment_rating] = (ratingCounts[p.investment_rating] || 0) + 1;
    });

    const prices = props.map(p => p.price);
    
    return {
      averagePrice,
      averagePricePerSqft,
      averageArea,
      averageSentiment,
      totalProperties: props.length,
      locationCounts,
      ratingCounts,
      priceRange: { min: Math.min(...prices), max: Math.max(...prices) }
    };
  };

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
    setProperties([]);
    setAnalytics(null);
    setSelectedProperty(null);

    try {
      const { data, error } = await supabase.functions.invoke('scrape-property', {
        body: { url, userId: user.id }
      });

      if (error) {
        throw error;
      }

      setProperties(data.properties || []);
      setIsMultiple(data.isMultiple);
      
      if (data.properties && data.properties.length > 0) {
        const analyticsData = calculateAnalytics(data.properties);
        setAnalytics(analyticsData);
        
        if (!data.isMultiple) {
          setSelectedProperty(data.properties[0]);
        }
      }

      toast({
        title: "Properties scraped successfully!",
        description: data.message,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Scraping failed",
        description: error.message || "Failed to scrape properties. Please try again.",
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

  const renderAnalytics = () => {
    if (!analytics) return null;

    return (
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Properties</p>
                  <p className="text-2xl font-bold">{analytics.totalProperties}</p>
                </div>
                <Home className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Price</p>
                  <p className="text-2xl font-bold">{formatPrice(analytics.averagePrice)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Per Sq.Ft</p>
                  <p className="text-2xl font-bold">₹{Math.round(analytics.averagePricePerSqft).toLocaleString()}</p>
                </div>
                <Square className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Sentiment</p>
                  <p className="text-2xl font-bold">{analytics.averageSentiment.toFixed(1)}/5</p>
                </div>
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price Range */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Price Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Minimum Price</p>
                <p className="text-lg font-semibold text-green-600">{formatPrice(analytics.priceRange.min)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Average Price</p>
                <p className="text-lg font-semibold text-blue-600">{formatPrice(analytics.averagePrice)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Maximum Price</p>
                <p className="text-lg font-semibold text-red-600">{formatPrice(analytics.priceRange.max)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(analytics.locationCounts).map(([location, count]) => (
                  <div key={location} className="flex items-center justify-between">
                    <span className="text-sm">{location}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(count / analytics.totalProperties) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Investment Ratings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(analytics.ratingCounts).map(([rating, count]) => (
                  <div key={rating} className="flex items-center justify-between">
                    <Badge className={getRatingColor(rating)}>{rating}</Badge>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(count / analytics.totalProperties) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderPropertyList = () => {
    return (
      <div className="space-y-4">
        {properties.map((property) => (
          <Card 
            key={property.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedProperty(property)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-semibold text-primary">{formatPrice(property.price)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Per Sq.Ft</p>
                      <p className="font-semibold">₹{property.price_per_sqft.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Area</p>
                      <p className="font-semibold">{property.super_area} sq.ft</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold">{property.location.split(',')[0]}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge className={getRatingColor(property.investment_rating)}>
                      {property.investment_rating}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">{property.sentiment_score}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderPropertyDetail = () => {
    if (!selectedProperty) return null;

    const property = selectedProperty;
    
    return (
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
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedProperty(null)}
                >
                  Back to List
                </Button>
                <a
                  href={property.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="default">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Original
                  </Button>
                </a>
              </div>
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
    );
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

      {properties.length > 0 && (
        <div className="space-y-6">
          {isMultiple && !selectedProperty ? (
            <Tabs defaultValue="analytics" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="properties" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Properties ({properties.length})
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Market Insights
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="analytics">
                {renderAnalytics()}
              </TabsContent>
              
              <TabsContent value="properties">
                {renderPropertyList()}
              </TabsContent>
              
              <TabsContent value="insights">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Market Insights & Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analytics && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold text-green-600 mb-2">Best Value Properties</h4>
                            <p className="text-sm text-muted-foreground">
                              Properties with price per sq.ft below ₹{Math.round(analytics.averagePricePerSqft).toLocaleString()} 
                              offer better value for money.
                            </p>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold text-blue-600 mb-2">Premium Segment</h4>
                            <p className="text-sm text-muted-foreground">
                              Properties above {formatPrice(analytics.averagePrice)} represent the premium segment 
                              with higher amenities and locations.
                            </p>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-muted rounded-lg">
                          <h4 className="font-semibold mb-2">Investment Recommendation</h4>
                          <p className="text-sm text-muted-foreground">
                            Based on the analyzed properties, the average market sentiment is{' '}
                            <span className="font-semibold">{analytics.averageSentiment.toFixed(1)}/5.0</span>.
                            Consider properties with higher sentiment scores and 'Good' or 'Excellent' ratings for better investment potential.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : selectedProperty ? (
            renderPropertyDetail()
          ) : (
            renderPropertyDetail()
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyScraper;

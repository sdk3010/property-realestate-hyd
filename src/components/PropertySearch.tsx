import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, IndianRupee, Home, Star, TrendingUp } from "lucide-react";
import { useState } from "react";

const PropertySearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [propertyType, setPropertyType] = useState("");

  const featuredProperties = [
    {
      id: 1,
      title: "Luxury 3BHK in Gachibowli",
      locality: "Gachibowli",
      price: "₹85.5L",
      pricePerSqft: "₹5,850",
      size: "1,460 sqft",
      type: "3 BHK Apartment",
      builder: "Prestige Group",
      status: "Ready to Move",
      amenities: ["Gym", "Pool", "Garden", "Security"],
      investmentRating: 4.5,
      expectedAppreciation: "12-15%",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Modern 2BHK in Kondapur",
      locality: "Kondapur",
      price: "₹62.8L",
      pricePerSqft: "₹4,950",
      size: "1,268 sqft",
      type: "2 BHK Apartment",
      builder: "Aparna Constructions",
      status: "Under Construction",
      amenities: ["Clubhouse", "Pool", "Parking", "Power Backup"],
      investmentRating: 4.2,
      expectedAppreciation: "15-18%",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Premium Villa in Nallagandla",
      locality: "Nallagandla",
      price: "₹1.45Cr",
      pricePerSqft: "₹4,200",
      size: "3,452 sqft",
      type: "4 BHK Villa",
      builder: "Brigade Group",
      status: "Ready to Move",
      amenities: ["Private Garden", "Garage", "Premium Finishes", "Gated Community"],
      investmentRating: 4.7,
      expectedAppreciation: "18-22%",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      title: "Spacious 3BHK in Hitech City",
      locality: "Hitech City",
      price: "₹95.2L",
      pricePerSqft: "₹6,300",
      size: "1,511 sqft",
      type: "3 BHK Apartment",
      builder: "Mantri Developers",
      status: "Ready to Move",
      amenities: ["Rooftop Garden", "Gym", "Shopping Complex", "Metro Access"],
      investmentRating: 4.3,
      expectedAppreciation: "10-12%",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"
    }
  ];

  const localities = [
    "Gachibowli", "Hitech City", "Kondapur", "Madhapur", "Nallagandla", 
    "Kokapet", "Miyapur", "Kukatpally", "Jubilee Hills", "Banjara Hills"
  ];

  const filteredProperties = featuredProperties.filter(property => {
    const matchesSearch = searchQuery === "" || 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.locality.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocality = selectedLocality === "" || selectedLocality === "all" || property.locality === selectedLocality;
    
    return matchesSearch && matchesLocality;
  });

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Property Search & Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Find and analyze properties with investment potential
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Search Properties</label>
              <Input
                placeholder="Search by locality or property name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Locality</label>
              <Select value={selectedLocality} onValueChange={setSelectedLocality}>
                <SelectTrigger>
                  <SelectValue placeholder="Select locality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Localities</SelectItem>
                  {localities.map((locality) => (
                    <SelectItem key={locality} value={locality}>
                      {locality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Price Range</label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Budget</SelectItem>
                  <SelectItem value="30-50">₹30L - ₹50L</SelectItem>
                  <SelectItem value="50-75">₹50L - ₹75L</SelectItem>
                  <SelectItem value="75-100">₹75L - ₹1Cr</SelectItem>
                  <SelectItem value="100+">₹1Cr+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Property Type</label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="2bhk">2 BHK</SelectItem>
                  <SelectItem value="3bhk">3 BHK</SelectItem>
                  <SelectItem value="4bhk">4 BHK</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="plot">Plot</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button className="bg-gradient-primary hover:opacity-90">
              <Search className="h-4 w-4 mr-2" />
              Search Properties
            </Button>
            <Button variant="outline">
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Property Results */}
      <Card className="bg-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Featured Investment Properties ({filteredProperties.length} found)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProperties.map((property) => (
              <div key={property.id} className="border border-border rounded-lg overflow-hidden bg-gradient-card hover:shadow-medium transition-all duration-300">
                <div className="relative">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                    {property.status}
                  </Badge>
                  <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {property.expectedAppreciation}
                  </Badge>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground text-lg">{property.title}</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < Math.floor(property.investmentRating) ? 'text-real-estate-accent fill-current' : 'text-muted'}`} 
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">({property.investmentRating})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{property.locality}</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{property.builder}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Price</span>
                      <p className="font-semibold text-foreground">{property.price}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">₹/sqft</span>
                      <p className="font-semibold text-foreground">{property.pricePerSqft}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Size</span>
                      <p className="font-semibold text-foreground">{property.size}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1">Type: {property.type}</p>
                    <div className="flex flex-wrap gap-1">
                      {property.amenities.slice(0, 3).map((amenity, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {property.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{property.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-gradient-primary hover:opacity-90">
                      <Home className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <IndianRupee className="h-3 w-3 mr-1" />
                      Investment Analysis
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertySearch;
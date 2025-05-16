import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="container max-w-[900px] px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-white mb-6 tracking-tight leading-tight">
            Find Your Dream Home
          </h1>
          <p className="text-lg md:text-xl text-[#EAEAEA] mb-12 max-w-[600px] mx-auto">
            Discover the perfect property in your ideal location
          </p>

          {/* Search Bar */}
          <div className="relative w-full max-w-[720px] mx-auto mb-10">
            <div className="flex gap-2 shadow-xl rounded-lg overflow-hidden bg-white p-2">
              <Input
                className="flex-1 text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12 px-4"
                placeholder="Enter location, property type, or keyword"
              />
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-hover text-white px-8 h-12 rounded-md transition-all duration-200 hover:scale-[0.98] active:scale-[0.97] text-base font-semibold min-w-[140px]"
              >
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-4">
            {["Popular: Luxury Homes", "New Listings", "Price Reduced"].map(
              (filter) => (
                <Button
                  key={filter}
                  variant="outline"
                  className="bg-white/95 hover:bg-white text-secondary border-[#D9D9D9] hover:border-primary transition-colors rounded-full px-6 h-11 text-sm font-medium shadow-sm"
                >
                  {filter}
                </Button>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

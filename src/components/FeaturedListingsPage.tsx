import Header from "./Header";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Map } from "lucide-react";
import { useMapStore } from "@/lib/store/map";

const FeaturedListingsPage = () => {
  const { isMapVisible, toggleMap } = useMapStore();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Search Bar */}
      <div className="sticky top-20 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-7xl mx-auto py-4 px-4 lg:px-8">
          <div className="flex gap-2">
            <Input
              className="flex-1 bg-muted border-0"
              placeholder="Search properties..."
            />
            <Button className="bg-primary hover:bg-primary-hover text-white px-4 sm:px-8">
              <Search className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Search</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex gap-8 py-6">
          {/* Map Section */}
          {isMapVisible && (
            <div className="hidden lg:block w-[400px] sticky top-48 h-[calc(100vh-12rem)]">
              <div className="relative w-full h-full rounded-lg overflow-hidden border">
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 z-10 bg-background/95 backdrop-blur-sm"
                  onClick={toggleMap}
                  title="Hide Map"
                >
                  <Map className="h-4 w-4" />
                </Button>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d52865.94280924921!2d-117.71937159521484!3d34.09665414227983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1708195735071!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          )}

          {/* Listings Section */}
          <div className="flex-1">
            {!isMapVisible && (
              <Button
                variant="outline"
                size="icon"
                className="mb-4 bg-background/95 backdrop-blur-sm"
                onClick={toggleMap}
                title="Show Map"
              >
                <Map className="h-4 w-4" />
              </Button>
            )}
            <div className="min-h-[600px] border rounded-lg bg-white p-6 flex items-center justify-center">
              <p className="text-muted-foreground text-center">
                Featured listings will be displayed here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedListingsPage;

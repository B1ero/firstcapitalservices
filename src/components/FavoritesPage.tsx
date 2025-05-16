import Header from "./Header";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const FavoritesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-primary/10 hover:text-primary flex items-center gap-2 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">My Favorites</h1>
        </div>

        <div className="min-h-[400px] border rounded-lg bg-white p-6 flex items-center justify-center">
          <p className="text-muted-foreground text-center">
            Your favorite properties will be displayed here
          </p>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;

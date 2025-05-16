import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth";
import SignInModal from "./SignInModal";
import CreateAccountModal from "./CreateAccountModal";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { useFavoritesStore } from "../lib/store/favorites";
import { Link, useNavigate } from "react-router-dom";

interface PropertyCardProps {
  id: string;
  image?: string;
  title?: string;
  price?: string;
  location?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  status?: "For Sale" | "For Rent" | "Sold" | "Pending";
}

const PropertyCard = ({
  id,
  image = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80",
  title = "Modern Family Home",
  price = "$750,000",
  location = "Beverly Hills, CA",
  beds = 4,
  baths = 3,
  sqft = 2500,
  status = "For Sale",
}: PropertyCardProps) => {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { user } = useAuthStore();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const isFavorited = isFavorite(id);
  const navigate = useNavigate();

  const statusColors = {
    "For Sale": "bg-status-active text-white",
    "For Rent": "bg-status-coming text-white",
    Sold: "bg-secondary text-white",
    Pending: "bg-status-pending text-white",
  };

  const handleCardClick = () => {
    navigate(`/property/${id}`);
  };

  return (
    <>
      <Card
        className="w-full bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer hover:bg-gray-50"
        onClick={handleCardClick}
      >
        <div className="relative">
          <img src={image} alt={title} className="w-full h-48 object-cover" />
          <Badge
            className={`absolute top-2 left-2 ${statusColors[status]}`}
            variant="secondary"
            onClick={(e) => e.stopPropagation()}
          >
            {status}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white ${isFavorited ? "text-red-500" : "text-gray-500"}`}
            onClick={(e) => {
              e.stopPropagation();
              if (!user) {
                setShowSignIn(true);
                return;
              }
              toggleFavorite(id);
            }}
          >
            <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
          </Button>
        </div>

        <CardContent className="p-4">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-2xl font-bold text-primary mb-2">{price}</p>
          <p className="text-gray-600 mb-4">{location}</p>

          <div className="flex justify-between text-gray-600 mt-4">
            <div className="flex items-center gap-1">
              <span className="font-semibold">{beds}</span> Beds
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold">{baths}</span> Baths
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold">{sqft.toLocaleString()}</span>{" "}
              sqft
            </div>
          </div>
        </CardContent>
      </Card>

      <SignInModal
        open={showSignIn}
        onOpenChange={setShowSignIn}
        onCreateAccount={() => {
          setShowSignIn(false);
          setShowCreateAccount(true);
        }}
      />

      <CreateAccountModal
        open={showCreateAccount}
        onOpenChange={setShowCreateAccount}
        onSignIn={() => {
          setShowCreateAccount(false);
          setShowSignIn(true);
        }}
      />
    </>
  );
};

export default PropertyCard;

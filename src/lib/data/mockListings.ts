export interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  status: "For Sale" | "For Rent" | "Sold" | "Pending";
  featured: boolean;
  description: string;
  yearBuilt: number;
  propertyType: "House" | "Condo" | "Townhouse" | "Land";
  agent: {
    name: string;
    image: string;
  };
}

export const mockListings: Listing[] = [
  {
    id: "1",
    title: "Modern Luxury Villa",
    price: 2500000,
    location: "Beverly Hills, CA",
    beds: 5,
    baths: 4,
    sqft: 4500,
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=60",
    status: "For Sale",
    featured: true,
    description: "Stunning modern villa with panoramic views",
    yearBuilt: 2020,
    propertyType: "House",
    agent: {
      name: "Sarah Johnson",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
  },
  {
    id: "2",
    title: "Downtown Penthouse",
    price: 1800000,
    location: "Los Angeles, CA",
    beds: 3,
    baths: 2.5,
    sqft: 2200,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=60",
    status: "For Sale",
    featured: true,
    description: "Luxurious penthouse in the heart of downtown",
    yearBuilt: 2019,
    propertyType: "Condo",
    agent: {
      name: "Michael Chen",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
  },
  {
    id: "3",
    title: "Beachfront Paradise",
    price: 3200000,
    location: "Malibu, CA",
    beds: 4,
    baths: 3,
    sqft: 3800,
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=60",
    status: "For Sale",
    featured: true,
    description: "Direct beach access with stunning ocean views",
    yearBuilt: 2018,
    propertyType: "House",
    agent: {
      name: "Emily Davis",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    },
  },
  {
    id: "4",
    title: "Urban Loft",
    price: 850000,
    location: "Downtown LA",
    beds: 1,
    baths: 1,
    sqft: 1200,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=60",
    status: "Pending",
    featured: false,
    description: "Modern loft in a historic building",
    yearBuilt: 2015,
    propertyType: "Condo",
    agent: {
      name: "Alex Thompson",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
  },
];

export const getFeaturedListings = () =>
  mockListings.filter((listing) => listing.featured);

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

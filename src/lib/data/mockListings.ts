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
    price: 1200000,
    location: "San Diego, CA",
    beds: 2,
    baths: 2,
    sqft: 1800,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=60",
    status: "Pending",
    featured: true,
    description: "Modern loft in a historic building",
    yearBuilt: 2015,
    propertyType: "Condo",
    agent: {
      name: "Alex Thompson",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
  },
  {
    id: "5",
    title: "Cozy Cottage",
    price: 950000,
    location: "Pasadena, CA",
    beds: 3,
    baths: 2,
    sqft: 1500,
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop&q=60",
    status: "For Sale",
    featured: true,
    description: "Charming cottage with beautiful garden",
    yearBuilt: 1985,
    propertyType: "House",
    agent: {
      name: "Jessica Martinez",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    },
  },
  {
    id: "6",
    title: "Suburban Retreat",
    price: 1450000,
    location: "Irvine, CA",
    beds: 4,
    baths: 3,
    sqft: 2600,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60",
    status: "For Sale",
    featured: true,
    description: "Spacious family home in quiet neighborhood",
    yearBuilt: 2010,
    propertyType: "House",
    agent: {
      name: "David Wilson",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
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

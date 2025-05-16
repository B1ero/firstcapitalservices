import { useParams } from "react-router-dom";
import { mockListings, formatPrice } from "@/lib/data/mockListings";
import Header from "./Header";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useState } from "react";

const PropertyDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const property = mockListings.find((listing) => listing.id === id);
  const [activeImage, setActiveImage] = useState(0);

  // Error state if property not found
  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-8">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Images for the gallery (using the same image for demo purposes)
  const images = [property.image, property.image, property.image];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Main Image */}
        <div className="relative w-full h-[400px] md:h-[500px] mb-4 overflow-hidden rounded-lg">
          <img
            src={images[activeImage]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white ${
                property.status === "For Sale"
                  ? "bg-status-active"
                  : property.status === "For Rent"
                    ? "bg-status-coming"
                    : property.status === "Sold"
                      ? "bg-secondary"
                      : "bg-status-pending"
              }`}
            >
              {property.status}
            </span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
          {images.map((img, index) => (
            <div
              key={index}
              className={`w-24 h-24 flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 ${
                activeImage === index ? "border-primary" : "border-transparent"
              }`}
              onClick={() => setActiveImage(index)}
            >
              <img
                src={img}
                alt={`View ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Property Title and Price */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
              <p className="text-2xl font-bold text-primary">
                {formatPrice(property.price)}
              </p>
              <p className="text-gray-600">{property.location}</p>
            </div>

            {/* Property Details Grid */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-gray-500 text-sm">Bedrooms</p>
                    <p className="font-semibold text-lg">{property.beds}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Bathrooms</p>
                    <p className="font-semibold text-lg">{property.baths}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Square Feet</p>
                    <p className="font-semibold text-lg">
                      {property.sqft.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Property Type</p>
                    <p className="font-semibold text-lg">
                      {property.propertyType}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Year Built</p>
                    <p className="font-semibold text-lg">
                      {property.yearBuilt}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Map Section (Placeholder) */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Location</h2>
              <div className="w-full h-[300px] bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">
                  Map placeholder - {property.location}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Agent Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    <img
                      src={property.agent.image}
                      alt={property.agent.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {property.agent.name}
                    </h3>
                    <p className="text-gray-600">Listing Agent</p>
                  </div>
                </div>

                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Your email"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Your phone number"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="I'm interested in this property..."
                      defaultValue={`I'm interested in ${property.title} (${property.location})`}
                    />
                  </div>
                  <Button className="w-full">Contact Agent</Button>
                </form>

                <div className="mt-4 text-center">
                  <Button variant="outline" className="w-full">
                    Schedule a Tour
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;

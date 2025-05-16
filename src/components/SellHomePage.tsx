import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Header from "./Header";
import { Loader2 } from "lucide-react";

const steps = [
  {
    icon: "📊",
    title: "Marketing Analysis & Pricing",
    description: "Get a detailed market analysis and optimal pricing strategy",
  },
  {
    icon: "🏠",
    title: "Home Preparation & Staging",
    description: "Professional guidance on presenting your home at its best",
  },
  {
    icon: "📸",
    title: "Marketing & Showings",
    description:
      "Premium listing with professional photography and virtual tours",
  },
  {
    icon: "💬",
    title: "Offers & Negotiation",
    description: "Expert negotiation to secure the best possible terms",
  },
  {
    icon: "📝",
    title: "Contract & Paperwork",
    description: "Smooth handling of all legal documents and disclosures",
  },
  {
    icon: "✅",
    title: "Closing & Beyond",
    description: "Coordinated closing process and continued support",
  },
];

const SellHomePage = () => {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleGetStarted = () => {
    setShowForm(true);
    // Smooth scroll to the form section
    setTimeout(() => {
      document.getElementById("property-form-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="relative h-[600px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2946&q=80)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        </div>

        <div className="relative h-full flex flex-col items-center justify-center">
          <div className="container max-w-[800px] px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Sell Your Home with Confidence
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-12 max-w-[600px] mx-auto">
              List your home with confidence. Fast, easy, and guided support.
            </p>

            <Button
              onClick={handleGetStarted}
              size="lg"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 h-auto rounded-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-lg font-semibold min-w-[280px] shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Get Started With Your Home Sale"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="container max-w-7xl mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Our Home Selling Process
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border bg-white hover:shadow-lg transition-shadow duration-200"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form Section */}
      <div
        id="property-form-section"
        className="container max-w-3xl mx-auto px-4 py-16 md:py-24"
      >
        {showForm ? (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Tell Us About Your Property
            </h2>
            <p className="text-lg text-muted-foreground mb-12 text-center">
              Please provide details about your property to help us create an
              accurate valuation
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setLoading(true);
                // Simulate form submission
                setTimeout(() => {
                  setLoading(false);
                  setFormSubmitted(true);
                }, 1500);
              }}
              className="space-y-8"
            >
              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Property Address</h3>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="street"
                      className="block text-sm font-medium mb-1"
                    >
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      required
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium mb-1"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium mb-1"
                      >
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        required
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="zip"
                        className="block text-sm font-medium mb-1"
                      >
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        id="zip"
                        name="zip"
                        required
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Property Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="bedrooms"
                        className="block text-sm font-medium mb-1"
                      >
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        id="bedrooms"
                        name="bedrooms"
                        min="0"
                        required
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="bathrooms"
                        className="block text-sm font-medium mb-1"
                      >
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        id="bathrooms"
                        name="bathrooms"
                        min="0"
                        step="0.5"
                        required
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="squareFeet"
                        className="block text-sm font-medium mb-1"
                      >
                        Square Footage
                      </label>
                      <input
                        type="number"
                        id="squareFeet"
                        name="squareFeet"
                        min="0"
                        required
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="yearBuilt"
                        className="block text-sm font-medium mb-1"
                      >
                        Year Built
                      </label>
                      <input
                        type="number"
                        id="yearBuilt"
                        name="yearBuilt"
                        min="1800"
                        max={new Date().getFullYear()}
                        required
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="lotSize"
                      className="block text-sm font-medium mb-1"
                    >
                      Lot Size (acres)
                    </label>
                    <input
                      type="number"
                      id="lotSize"
                      name="lotSize"
                      min="0"
                      step="0.01"
                      required
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <h3 className="text-xl font-semibold mb-4">
                  Additional Features
                </h3>
                <div>
                  <label
                    htmlFor="additionalFeatures"
                    className="block text-sm font-medium mb-1"
                  >
                    Additional Features (pool, garage, renovations, etc.)
                  </label>
                  <textarea
                    id="additionalFeatures"
                    name="additionalFeatures"
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Describe any special features or recent upgrades..."
                  />
                </div>
              </div>

              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <h3 className="text-xl font-semibold mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-1"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium mb-1"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 h-auto rounded-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-lg font-semibold min-w-[280px] shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit Property Information"
                  )}
                </Button>
              </div>
            </form>
          </div>
        ) : null}

        {/* Success Message */}
        {formSubmitted && (
          <div className="text-center bg-white p-8 rounded-lg border shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
            <p className="text-lg mb-6">
              Your property information has been submitted successfully. One of
              our real estate experts will contact you shortly with your home
              valuation.
            </p>
            <Button
              onClick={() => {
                setFormSubmitted(false);
                setShowForm(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              variant="outline"
              className="px-6 py-2"
            >
              Return to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellHomePage;

import Header from "./Header";
import HeroSection from "./HeroSection";
import FilterSidebar from "./FilterSidebar";
import PropertyGrid from "./PropertyGrid";

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <div className="container max-w-7xl mx-auto px-4 lg:px-8">
        <PropertyGrid />
      </div>
    </div>
  );
}

export default Home;

import { Suspense, useEffect, useState } from "react";
import { useRoutes, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/home";
import FavoritesPage from "./components/FavoritesPage";
import ListingsPage from "./components/ListingsPage";
import FeaturedListingsPage from "./components/FeaturedListingsPage";
import SellHomePage from "./components/SellHomePage";
import PropertyDetailsPage from "./components/PropertyDetailsPage";
import routes from "tempo-routes";
import { AuthProvider } from "./providers/AuthProvider";
import { AnimatePresence, motion } from "framer-motion";
import { crmlsService } from "./lib/services/crmls";

function App() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Show loading state when navigation starts
    setIsLoading(true);

    // Hide loading state after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Initialize CRMLS service on app start
  useEffect(() => {
    const initializeCRMLS = async () => {
      try {
        const isConnected = await crmlsService.testConnection();
        if (isConnected) {
          console.log("CRMLS service initialized successfully");
        } else {
          console.warn("CRMLS service connection failed");
        }
      } catch (error) {
        console.error("Failed to initialize CRMLS service:", error);
      }
    };

    initializeCRMLS();
  }, []);

  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        {isLoading && <div className="page-loading-bar" />}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="page-transition-wrapper"
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/listings" element={<ListingsPage />} />
              <Route path="/sell" element={<SellHomePage />} />
              <Route
                path="/featured-listings"
                element={<FeaturedListingsPage />}
              />
              <Route path="/property/:id" element={<PropertyDetailsPage />} />
            </Routes>
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          </motion.div>
        </AnimatePresence>
      </Suspense>
    </AuthProvider>
  );
}

export default App;

import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import FavoritesPage from "./components/FavoritesPage";
import ListingsPage from "./components/ListingsPage";
import FeaturedListingsPage from "./components/FeaturedListingsPage";
import SellHomePage from "./components/SellHomePage";
import PropertyDetailsPage from "./components/PropertyDetailsPage";
import routes from "tempo-routes";
import { AuthProvider } from "./providers/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          <Routes>
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
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;

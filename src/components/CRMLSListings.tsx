import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const CRMLSListings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeHeight, setIframeHeight] = useState(900);

  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.innerHeight;
      setIframeHeight(Math.max(900, viewportHeight - 200));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full h-full min-h-[900px] bg-white rounded-lg border overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading Listings...</p>
          </div>
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <div className="text-center max-w-md mx-auto px-4">
            <p className="text-red-500 mb-4">{error}</p>
            <a
              href="https://apexidx.com/idx_lite/advancedsearch/EN_LA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              View Listings on ApexIDX Website
            </a>
          </div>
        </div>
      ) : (
        <iframe
          src="https://apexidx.com/idx_lite/advancedsearch/EN_LA"
          className="w-full h-full min-h-[900px] border-none"
          style={{ overflow: "hidden" }}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setError(
              "Unable to load listings. Please try viewing them directly on the ApexIDX website.",
            );
            setIsLoading(false);
          }}
          title="Property Listings"
          allowFullScreen
        />
      )}
    </div>
  );
};

export default CRMLSListings;

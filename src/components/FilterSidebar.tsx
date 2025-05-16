import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";

const FilterSidebar = () => {
  return (
    <div className="w-full max-w-xs p-4 bg-background border-r h-full">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-secondary">Price Range</h3>
          <Slider defaultValue={[500000]} max={2000000} step={50000} />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>$0</span>
            <span>$2M+</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-secondary">
            Property Type
          </h3>
          <div className="space-y-2">
            {["House", "Apartment", "Condo", "Townhouse"].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox id={type} />
                <Label htmlFor={type}>{type}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-secondary">Bedrooms</h3>
          <div className="flex gap-2">
            {["Any", "1+", "2+", "3+", "4+"].map((beds) => (
              <button
                key={beds}
                className="px-3 py-1 border rounded-md bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                {beds}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-secondary">Bathrooms</h3>
          <div className="flex gap-2">
            {["Any", "1+", "2+", "3+"].map((baths) => (
              <button
                key={baths}
                className="px-3 py-1 border rounded-md bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                {baths}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;

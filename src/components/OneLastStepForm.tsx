import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface OneLastStepFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFinish: () => void;
}

interface FormData {
  firstTimeBuyer: string;
  timeframe: string;
  preQualified: string;
  houseToSell: string;
  hasAgent: string;
}

const OneLastStepForm = ({
  open,
  onOpenChange,
  onFinish,
}: OneLastStepFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstTimeBuyer: "",
    timeframe: "",
    preQualified: "",
    houseToSell: "",
    hasAgent: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onFinish();
    } finally {
      setIsLoading(false);
    }
  };

  const isFormComplete = Object.values(formData).every((value) => value !== "");

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">One Last Step</h2>
            <p className="text-sm text-muted-foreground">
              Some questions will improve your estimate
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Are you a first-time home buyer?</Label>
              <RadioGroup
                value={formData.firstTimeBuyer}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, firstTimeBuyer: value }))
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="firstTimeBuyer-yes" />
                  <Label htmlFor="firstTimeBuyer-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="firstTimeBuyer-no" />
                  <Label htmlFor="firstTimeBuyer-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Within how many months do you plan to buy a home?</Label>
              <RadioGroup
                value={formData.timeframe}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, timeframe: value }))
                }
                className="grid grid-cols-2 gap-4"
              >
                {[
                  "0-1 months",
                  "1-3 months",
                  "3-6 months",
                  "6-12 months",
                  "12+ months",
                ].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`timeframe-${option}`} />
                    <Label htmlFor={`timeframe-${option}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Have you been pre-qualified for a mortgage?</Label>
              <RadioGroup
                value={formData.preQualified}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, preQualified: value }))
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="preQualified-yes" />
                  <Label htmlFor="preQualified-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="preQualified-no" />
                  <Label htmlFor="preQualified-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Do you have a house to sell first?</Label>
              <RadioGroup
                value={formData.houseToSell}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, houseToSell: value }))
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="houseToSell-yes" />
                  <Label htmlFor="houseToSell-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="houseToSell-no" />
                  <Label htmlFor="houseToSell-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Do you have an agent already?</Label>
              <RadioGroup
                value={formData.hasAgent}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, hasAgent: value }))
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="hasAgent-yes" />
                  <Label htmlFor="hasAgent-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="hasAgent-no" />
                  <Label htmlFor="hasAgent-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white"
            size="lg"
            disabled={!isFormComplete || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finishing Up...
              </>
            ) : (
              "Finished"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OneLastStepForm;

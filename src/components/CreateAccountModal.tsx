import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  UserCircle2,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { useToast } from "./ui/use-toast";
import {
  isValidEmail,
  isValidPhone,
  formatPhoneNumber,
} from "@/lib/utils/validation";

interface CreateAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignIn: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  termsAccepted?: string;
  is_first_time_buyer?: string;
  purchase_timeline?: string;
  selling_current_home?: string;
}

type FormStep = "account" | "questions" | "success";

export default function CreateAccountModal({
  open,
  onOpenChange,
  onSignIn,
}: CreateAccountModalProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>("account");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    termsAccepted: false,
  });
  const [buyerQuestions, setBuyerQuestions] = useState({
    is_first_time_buyer: "",
    purchase_timeline: "",
    selling_current_home: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const signUp = useAuthStore((state) => state.signUp);
  const { toast } = useToast();

  const validateField = (name: string, value: string | boolean) => {
    if (!touched[name]) return true;

    const newErrors: FormErrors = {};

    switch (name) {
      case "email":
        if (!value || typeof value !== "string" || !value.trim()) {
          newErrors.email = "Email is required";
        } else if (!isValidEmail(value)) {
          newErrors.email = "Invalid email format";
        }
        break;
      case "password":
        if (!value || typeof value !== "string" || !value.trim()) {
          newErrors.password = "Password is required";
        } else if (value.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
        }
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        break;
      case "confirmPassword":
        if (!value || typeof value !== "string" || !value.trim()) {
          newErrors.confirmPassword = "Please confirm your password";
        } else if (value !== formData.password) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        break;
      case "first_name":
        if (!value || typeof value !== "string" || !value.trim()) {
          newErrors.first_name = "First name is required";
        }
        break;
      case "last_name":
        if (!value || typeof value !== "string" || !value.trim()) {
          newErrors.last_name = "Last name is required";
        }
        break;
      case "phone_number":
        if (!value || typeof value !== "string" || !value.trim()) {
          newErrors.phone_number = "Phone number is required";
        } else if (!isValidPhone(value)) {
          newErrors.phone_number = "Invalid phone number";
        }
        break;
      case "termsAccepted":
        if (!value) {
          newErrors.termsAccepted =
            "You must agree to the terms and privacy policy to continue.";
        }
        break;
      case "is_first_time_buyer":
        if (!value || typeof value !== "string" || !value.trim()) {
          newErrors.is_first_time_buyer = "Please select an option";
        }
        break;
      case "purchase_timeline":
        if (!value || typeof value !== "string" || !value.trim()) {
          newErrors.purchase_timeline = "Please select your timeline";
        }
        break;
      case "selling_current_home":
        if (!value || typeof value !== "string" || !value.trim()) {
          newErrors.selling_current_home = "Please select an option";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let newValue: any = value;

    if (type === "checkbox") {
      newValue = checked;
    } else if (name === "phone_number") {
      newValue = formatPhoneNumber(value);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Clear error when user starts typing if field was touched
    if (touched[name]) {
      setErrors((prev) => {
        const { [name]: _, ...rest } = prev as any;
        return rest;
      });
    }

    // Validate confirm password when password changes
    if (name === "password" && touched.confirmPassword) {
      validateField("confirmPassword", formData.confirmPassword);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name as keyof typeof formData]);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, termsAccepted: checked }));

    // Clear error when user checks the box
    if (touched.termsAccepted && checked) {
      setErrors((prev) => {
        const { termsAccepted: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleBuyerQuestionChange = (field: string, value: string) => {
    setBuyerQuestions((prev) => ({ ...prev, [field]: value }));

    // Clear error when user selects an option
    if (touched[field]) {
      setErrors((prev) => {
        const { [field]: _, ...rest } = prev as any;
        return rest;
      });
    }
  };

  const handleBuyerQuestionBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, buyerQuestions[field as keyof typeof buyerQuestions]);
  };

  const handleAccountFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    setTouched(allTouched);

    // Validate all fields
    const isValid = Object.entries(formData).every(([name, value]) =>
      validateField(name, value),
    );

    if (!isValid) return;

    // Additional check for terms acceptance
    if (!formData.termsAccepted) {
      setErrors((prev) => ({
        ...prev,
        termsAccepted:
          "You must agree to the terms and privacy policy to continue.",
      }));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    // Move to questions step
    setCurrentStep("questions");
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all buyer question fields as touched
    const questionsTouched = Object.keys(buyerQuestions).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    setTouched((prev) => ({ ...prev, ...questionsTouched }));

    // Validate buyer questions
    const isQuestionsValid = Object.entries(buyerQuestions).every(
      ([name, value]) => validateField(name, value),
    );

    if (!isQuestionsValid) return;

    setLoading(true);

    try {
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
        },
        {
          is_first_time_buyer: buyerQuestions.is_first_time_buyer === "yes",
          purchase_timeline: buyerQuestions.purchase_timeline,
          selling_current_home: buyerQuestions.selling_current_home,
        },
      );

      if (error) {
        // Handle specific error cases
        if (
          error.message.toLowerCase().includes("already registered") ||
          error.message.toLowerCase().includes("already in use") ||
          error.message.toLowerCase().includes("already exists") ||
          error.message.toLowerCase().includes("user already exists")
        ) {
          setCurrentStep("account");
          setErrors((prev) => ({
            ...prev,
            email: "This email is already registered. Please sign in instead.",
          }));
          return;
        }
        throw error;
      }

      // Move to success step
      setCurrentStep("success");

      // Check if email confirmation is required
      const emailConfirmationRequired = !data?.user || data?.session === null;

      // Auto-close modal after showing success for a moment
      setTimeout(() => {
        onOpenChange(false);
        toast({
          title: "Account created successfully",
          description: emailConfirmationRequired
            ? "Please check your email to confirm your account."
            : "Welcome to your real estate journey!",
        });
      }, 2000);
    } catch (error) {
      console.error("Sign up error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      // Handle specific error cases
      if (errorMessage.toLowerCase().includes("already registered")) {
        setCurrentStep("account");
        setErrors((prev) => ({
          ...prev,
          email: "This email is already registered. Please sign in instead.",
        }));
        return;
      }

      if (errorMessage.toLowerCase().includes("password")) {
        setCurrentStep("account");
        setErrors((prev) => ({
          ...prev,
          password: "Password must be at least 6 characters long",
        }));
        return;
      }

      toast({
        title: "Error creating account",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToAccount = () => {
    setCurrentStep("account");
  };

  const resetModal = () => {
    setCurrentStep("account");
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      termsAccepted: false,
    });
    setBuyerQuestions({
      is_first_time_buyer: "",
      purchase_timeline: "",
      selling_current_home: "",
    });
    setErrors({});
    setTouched({});
    setLoading(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetModal();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 gap-0 overflow-auto max-h-[85vh]">
        <div className="relative">
          {/* Account Form Step */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              currentStep === "account"
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-full absolute inset-0 pointer-events-none"
            }`}
          >
            <form onSubmit={handleAccountFormSubmit} className="p-6 space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="flex justify-center mb-2">
                  <UserCircle2 className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Create Account
                </h2>
                <p className="text-sm text-muted-foreground">
                  Start your real estate journey today
                </p>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      className={`bg-muted border-0 ${touched.first_name && errors.first_name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      value={formData.first_name}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                    />
                    {touched.first_name && errors.first_name && (
                      <p className="text-xs text-red-500">
                        {errors.first_name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      className={`bg-muted border-0 ${touched.last_name && errors.last_name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      value={formData.last_name}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                    />
                    {touched.last_name && errors.last_name && (
                      <p className="text-xs text-red-500">{errors.last_name}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    className={`bg-muted border-0 ${touched.email && errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                  />
                  {touched.email && errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    placeholder="(555) 555-5555"
                    className={`bg-muted border-0 ${touched.phone_number && errors.phone_number ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                  />
                  {touched.phone_number && errors.phone_number && (
                    <p className="text-xs text-red-500">
                      {errors.phone_number}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className={`bg-muted border-0 pr-10 ${touched.password && errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      value={formData.password}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {touched.password && errors.password && (
                    <p className="text-xs text-red-500">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className={`bg-muted border-0 pr-10 ${touched.confirmPassword && errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <p className="text-xs text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Terms and Privacy Policy Checkbox */}
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="termsAccepted"
                      checked={formData.termsAccepted}
                      onCheckedChange={handleCheckboxChange}
                      className={`mt-1 ${touched.termsAccepted && errors.termsAccepted ? "border-red-500" : ""}`}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="termsAccepted"
                        className="text-sm font-normal leading-relaxed cursor-pointer"
                        onClick={() => {
                          setTouched((prev) => ({
                            ...prev,
                            termsAccepted: true,
                          }));
                          validateField(
                            "termsAccepted",
                            formData.termsAccepted,
                          );
                        }}
                      >
                        By creating an account, you agree to abide by our{" "}
                        <a
                          href="/terms"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Privacy Policy
                        </a>
                        . You also consent to receive communications from us
                        electronically. You confirm that the information you
                        provide is truthful, complete, and accurate.
                      </Label>
                    </div>
                  </div>
                  {touched.termsAccepted && errors.termsAccepted && (
                    <p className="text-xs text-red-500 ml-7">
                      {errors.termsAccepted}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white"
                  size="lg"
                >
                  Continue to Buyer Questions
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Already have an account?
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/5"
                  size="lg"
                  onClick={onSignIn}
                >
                  Sign In
                </Button>
              </div>
            </form>
          </div>

          {/* Buyer Questions Step */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              currentStep === "questions"
                ? "opacity-100 translate-x-0"
                : currentStep === "success"
                  ? "opacity-0 -translate-x-full absolute inset-0 pointer-events-none"
                  : "opacity-0 translate-x-full absolute inset-0 pointer-events-none"
            }`}
          >
            <form onSubmit={handleFinalSubmit} className="p-6 space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="flex justify-center mb-2">
                  <UserCircle2 className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Tell Us About Your Goals
                </h2>
                <p className="text-sm text-muted-foreground">
                  Help us personalize your experience
                </p>
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {/* First-time buyer question */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    Are you a first-time home buyer?
                  </Label>
                  <RadioGroup
                    value={buyerQuestions.is_first_time_buyer}
                    onValueChange={(value) =>
                      handleBuyerQuestionChange("is_first_time_buyer", value)
                    }
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="first-time-yes" />
                      <Label
                        htmlFor="first-time-yes"
                        className="cursor-pointer"
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="first-time-no" />
                      <Label htmlFor="first-time-no" className="cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                  {touched.is_first_time_buyer &&
                    errors.is_first_time_buyer && (
                      <p className="text-xs text-red-500">
                        {errors.is_first_time_buyer}
                      </p>
                    )}
                </div>

                {/* Purchase timeline question */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    What is your estimated timeline for purchasing a home?
                  </Label>
                  <Select
                    value={buyerQuestions.purchase_timeline}
                    onValueChange={(value) =>
                      handleBuyerQuestionChange("purchase_timeline", value)
                    }
                  >
                    <SelectTrigger
                      className={`bg-muted border-0 ${touched.purchase_timeline && errors.purchase_timeline ? "border-red-500 focus:ring-red-500" : ""}`}
                      onBlur={() =>
                        handleBuyerQuestionBlur("purchase_timeline")
                      }
                    >
                      <SelectValue placeholder="Select your timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="within-1-month">
                        Within 1 month
                      </SelectItem>
                      <SelectItem value="1-3-months">1–3 months</SelectItem>
                      <SelectItem value="3-6-months">3–6 months</SelectItem>
                      <SelectItem value="6-12-months">6–12 months</SelectItem>
                      <SelectItem value="more-than-1-year">
                        More than 1 year
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {touched.purchase_timeline && errors.purchase_timeline && (
                    <p className="text-xs text-red-500">
                      {errors.purchase_timeline}
                    </p>
                  )}
                </div>

                {/* Selling current home question */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    Do you plan to sell your current home before buying a new
                    one?
                  </Label>
                  <RadioGroup
                    value={buyerQuestions.selling_current_home}
                    onValueChange={(value) =>
                      handleBuyerQuestionChange("selling_current_home", value)
                    }
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="selling-yes" />
                      <Label htmlFor="selling-yes" className="cursor-pointer">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="selling-no" />
                      <Label htmlFor="selling-no" className="cursor-pointer">
                        No
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-sure" id="selling-not-sure" />
                      <Label
                        htmlFor="selling-not-sure"
                        className="cursor-pointer"
                      >
                        Not Sure
                      </Label>
                    </div>
                  </RadioGroup>
                  {touched.selling_current_home &&
                    errors.selling_current_home && (
                      <p className="text-xs text-red-500">
                        {errors.selling_current_home}
                      </p>
                    )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={handleBackToAccount}
                  disabled={loading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Account Details
                </Button>
              </div>
            </form>
          </div>

          {/* Success Step */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              currentStep === "success"
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-full absolute inset-0 pointer-events-none"
            }`}
          >
            <div className="p-6 space-y-6 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-green-600">
                Account Created Successfully!
              </h2>
              <p className="text-muted-foreground">
                Welcome to your real estate journey. We're setting up your
                personalized experience...
              </p>
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

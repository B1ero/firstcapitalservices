import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { UserCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
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
}

export default function CreateAccountModal({
  open,
  onOpenChange,
  onSignIn,
}: CreateAccountModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const signUp = useAuthStore((state) => state.signUp);
  const { toast } = useToast();

  const validateField = (name: string, value: string) => {
    if (!touched[name]) return true;

    const newErrors: FormErrors = {};

    switch (name) {
      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (!isValidEmail(value)) {
          newErrors.email = "Invalid email format";
        }
        break;
      case "password":
        if (!value.trim()) {
          newErrors.password = "Password is required";
        } else if (value.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
        }
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        break;
      case "confirmPassword":
        if (!value.trim()) {
          newErrors.confirmPassword = "Please confirm your password";
        } else if (value !== formData.password) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        break;
      case "first_name":
        if (!value.trim()) {
          newErrors.first_name = "First name is required";
        }
        break;
      case "last_name":
        if (!value.trim()) {
          newErrors.last_name = "Last name is required";
        }
        break;
      case "phone_number":
        if (!value.trim()) {
          newErrors.phone_number = "Phone number is required";
        } else if (!isValidPhone(value)) {
          newErrors.phone_number = "Invalid phone number";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "phone_number") {
      newValue = formatPhoneNumber(value);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Clear error when user starts typing if field was touched
    if (touched[name]) {
      setErrors((prev) => {
        const { [name]: _, ...rest } = prev;
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
    validateField(name, formData[name]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signUp(formData.email, formData.password, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
      });

      if (error) {
        // Handle specific error cases
        if (
          error.message.toLowerCase().includes("already registered") ||
          error.message.toLowerCase().includes("already in use") ||
          error.message.toLowerCase().includes("already exists") ||
          error.message.toLowerCase().includes("user already exists")
        ) {
          setErrors((prev) => ({
            ...prev,
            email: "This email is already registered. Please sign in instead.",
          }));
          return;
        }
        throw error;
      }

      onOpenChange(false);

      // Check if email confirmation is required
      const emailConfirmationRequired = !data?.user || data?.session === null;

      toast({
        title: "Account created successfully",
        description: emailConfirmationRequired
          ? "Please check your email to confirm your account."
          : "Welcome to your real estate journey!",
      });
    } catch (error) {
      console.error("Sign up error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      // Handle specific error cases
      if (errorMessage.toLowerCase().includes("already registered")) {
        setErrors((prev) => ({
          ...prev,
          email: "This email is already registered. Please sign in instead.",
        }));
        return;
      }

      if (errorMessage.toLowerCase().includes("password")) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 gap-0 overflow-auto max-h-[85vh]">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                  <p className="text-xs text-red-500">{errors.first_name}</p>
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
                <p className="text-xs text-red-500">{errors.phone_number}</p>
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword}</p>
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
                "Create Account"
              )}
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
      </DialogContent>
    </Dialog>
  );
}

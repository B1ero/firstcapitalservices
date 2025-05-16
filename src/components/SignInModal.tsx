import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { UserCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { useToast } from "./ui/use-toast";
import { isValidEmail } from "@/lib/utils/validation";
import { supabase } from "@/lib/supabase/client";

interface SignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAccount: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
  [key: string]: string | undefined;
}

const SignInModal = ({
  open,
  onOpenChange,
  onCreateAccount,
}: SignInModalProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const signIn = useAuthStore((state) => state.signIn);
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
        }
        break;
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing if field was touched
    if (touched[name]) {
      setErrors((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
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

    // Validate all fields before submission
    const emailValid = validateField("email", formData.email);
    const passwordValid = validateField("password", formData.password);

    if (!emailValid || !passwordValid) {
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signIn(formData.email, formData.password);

      if (error) {
        // Check for specific error messages
        if (
          error.message.toLowerCase().includes("email not confirmed") ||
          error.message.toLowerCase().includes("email confirmation")
        ) {
          toast({
            title: "Email not confirmed",
            description: (
              <div className="flex flex-col gap-2">
                <p>Please verify your email before signing in.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResendConfirmation(formData.email)}
                  disabled={resendingEmail}
                >
                  {resendingEmail ? "Sending..." : "Resend confirmation email"}
                </Button>
              </div>
            ),
            duration: 10000,
          });
        } else if (
          error.message.toLowerCase().includes("invalid login") ||
          error.message.toLowerCase().includes("invalid credentials")
        ) {
          setErrors({
            password: "Invalid email or password",
          });
        } else {
          throw error;
        }
        return;
      }

      onOpenChange(false);
      toast({
        title: "Successfully signed in",
        description: "Welcome back!",
      });
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Error signing in",
        description:
          error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async (email: string) => {
    setResendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) throw error;

      toast({
        title: "Confirmation email sent",
        description:
          "Please check your inbox and follow the link to verify your email.",
      });
    } catch (error) {
      console.error("Error resending confirmation:", error);
      toast({
        title: "Error sending confirmation email",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setResendingEmail(false);
    }
  };

  const handleForgotPassword = async () => {
    // Validate email first
    if (!formData.email || !isValidEmail(formData.email)) {
      setTouched((prev) => ({ ...prev, email: true }));
      setErrors((prev) => ({
        ...prev,
        email: !formData.email ? "Email is required" : "Invalid email format",
      }));
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        formData.email,
        {
          redirectTo: window.location.origin + "/reset-password",
        },
      );

      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description:
          "Please check your inbox for instructions to reset your password.",
      });
    } catch (error) {
      console.error("Error sending password reset:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to send password reset email",
        variant: "destructive",
      });
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
            <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
            <p className="text-sm text-muted-foreground">
              Sign in to access your real estate journey
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button
                  variant="link"
                  className="px-0 font-normal text-xs text-primary hover:underline"
                  type="button"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </Button>
              </div>
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

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal">
                Remember me
              </Label>
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
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Don't have an account?
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/5"
              size="lg"
              onClick={onCreateAccount}
            >
              Create Account
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;

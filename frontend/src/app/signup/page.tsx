"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, User, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/authContext";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const { setUser } = useAuth();

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        if (value.trim().length < 2) return "First name must be at least 2 characters";
        break;
      case "lastName":
        if (!value.trim()) return "Last name is required";
        if (value.trim().length < 2) return "Last name must be at least 2 characters";
        break;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
        break;
      case "username":
        if (!value.trim()) return "Username is required";
        if (value.trim().length < 3) return "Username must be at least 3 characters";
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Username can only contain letters, numbers, and underscores";
        break;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
        if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
        if (!/[0-9]/.test(value)) return "Password must contain at least one number";
        break;
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        break;
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name as keyof FormData, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    if (serverError) setServerError("");
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name as keyof FormData, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setServerError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          username: formData.username.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      setUser(data)

      router.push("/");
      router.refresh();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClassName =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors";

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-6">
            <span className="text-foreground">RunBench</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-2 text-muted-foreground">
            Start your coding practice journey with spaced repetition
          </p>
        </div>

        <div className="rounded-xl border border-border p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {serverError && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                    className={`${inputClassName} pl-10`}
                    placeholder="John"
                    aria-invalid={errors.firstName ? "true" : "false"}
                    aria-describedby={errors.firstName ? "firstName-error" : undefined}
                  />
                </div>
                {errors.firstName && (
                  <p id="firstName-error" className="text-sm text-destructive" role="alert">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                    className={`${inputClassName} pl-10`}
                    placeholder="Doe"
                    aria-invalid={errors.lastName ? "true" : "false"}
                    aria-describedby={errors.lastName ? "lastName-error" : undefined}
                  />
                </div>
                {errors.lastName && (
                  <p id="lastName-error" className="text-sm text-destructive" role="alert">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  className={`${inputClassName} pl-10`}
                  placeholder="you@example.com"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  className={`${inputClassName} pl-10`}
                  placeholder="johndoe"
                  aria-invalid={errors.username ? "true" : "false"}
                  aria-describedby={errors.username ? "username-error" : undefined}
                />
              </div>
              {errors.username && (
                <p id="username-error" className="text-sm text-destructive" role="alert">
                  {errors.username}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  className={`${inputClassName} pl-10`}
                  placeholder="••••••••"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
              </div>
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  className={`${inputClassName} pl-10`}
                  placeholder="••••••••"
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                />
              </div>
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="text-sm text-destructive" role="alert">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
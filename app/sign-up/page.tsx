"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import {
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  AtSign,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Clean username into valid handle: lowercase, alphanumeric and underscores/dashes
  const handleUsernameChange = (val: string) => {
    const formatted = val.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    setUsername(formatted);
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedName = name.trim();
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedUsername || !trimmedEmail || !password) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (trimmedUsername.length < 3) {
      setErrorMessage("Username must be at least 3 characters long.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      await signUp.email(
        {
          email: trimmedEmail,
          password,
          name: trimmedName,
          username: trimmedUsername,
        },
        {
          onSuccess: () => {
            setSuccessMessage(
              `Account created successfully! Welcome to CanvasCraft, @${trimmedUsername}. Redirecting...`
            );
            setTimeout(() => {
              router.push("/");
              router.refresh();
            }, 1000);
          },
          onError: (ctx) => {
            setLoading(false);
            setErrorMessage(
              ctx.error.message ||
                "Failed to register account. Please check your credentials."
            );
          },
        }
      );
    } catch (err: unknown) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : "Registration error.";
      setErrorMessage(msg);
    }
  };

  const handleSocialSignUp = async (provider: "google" | "github") => {
    setErrorMessage(null);
    setSocialLoading(provider);

    try {
      await signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (err: unknown) {
      setSocialLoading(null);
      const msg = err instanceof Error ? err.message : "Social signup failed.";
      setErrorMessage(
        `${msg} (Ensure ${provider.toUpperCase()}_CLIENT_ID is configured in your .env)`
      );
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 flex items-center justify-center bg-[#faf8f5] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/60 text-amber-900 text-xs font-bold tracking-wider uppercase mb-4 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Create Your Member Account</span>
          </Link>
          <h1 className="text-3xl font-serif text-stone-950 font-bold mb-2">
            Join CanvasCraft BD
          </h1>
          <p className="text-sm text-stone-600">
            Save custom canvas configurations, unlock combo deals, and track workshop production in Dhaka.
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xl ring-1 ring-stone-900/5">
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Social Sign-Up Buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => handleSocialSignUp("google")}
              disabled={loading || !!socialLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 text-sm font-semibold border border-stone-200/90 hover:border-stone-300 transition shadow-2xs disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.7 0 3 .7 3.9 1.5l2.9-2.9C17 2 14.7 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.6 2.8C6.4 7.2 8.9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.5 14.9c-.2-.7-.4-1.5-.4-2.4 0-.8.2-1.6.4-2.4L1.9 7.3C.7 9.7 0 12.3 0 15.1c0 2.8.7 5.4 1.9 7.8l3.6-2.8z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.6-2.2-6.5-5.1L1.9 17C3.7 20.7 7.5 24 12 24z"
                />
              </svg>
              <span>
                {socialLoading === "google"
                  ? "Connecting to Google..."
                  : "Sign up with Google"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialSignUp("github")}
              disabled={loading || !!socialLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 text-sm font-semibold border border-stone-200/90 hover:border-stone-300 transition shadow-2xs disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-stone-900" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>
                {socialLoading === "github"
                  ? "Connecting to GitHub..."
                  : "Sign up with GitHub"}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-stone-200 w-full" />
            <span className="bg-white px-3 text-xs text-stone-400 uppercase tracking-widest font-mono">
              or register with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-stone-700 mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50/60 border border-stone-300 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-400/20 rounded-xl text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none shadow-2xs transition"
                />
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Username */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="username"
                  className="block text-xs font-semibold text-stone-700"
                >
                  Username Handle
                </label>
                <span className="text-[11px] text-stone-500 font-mono">
                  {username ? `@${username}` : "min 3 characters"}
                </span>
              </div>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  required
                  placeholder="tanvir_bd"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50/60 border border-stone-300 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-400/20 rounded-xl text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none shadow-2xs transition font-mono"
                />
                <AtSign className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-stone-700 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="tanvir@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50/60 border border-stone-300 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-400/20 rounded-xl text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none shadow-2xs transition"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-stone-700"
                >
                  Password
                </label>
                <span className="text-[11px] text-stone-500">
                  min 8 characters
                </span>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-stone-50/60 border border-stone-300 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-400/20 rounded-xl text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none shadow-2xs transition"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !!socialLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm shadow-md hover:shadow-lg transition disabled:opacity-50 mt-2 cursor-pointer active:scale-98"
            >
              <span>{loading ? "Creating Account..." : "Create Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 text-center text-xs text-stone-600">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-amber-800 hover:text-stone-950 font-bold underline underline-offset-4"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

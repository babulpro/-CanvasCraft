"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Sparkles, ArrowRight, Eye, EyeOff, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier || !password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const isEmail = trimmedIdentifier.includes("@");

      if (isEmail) {
        await signIn.email(
          {
            email: trimmedIdentifier,
            password,
          },
          {
            onSuccess: () => {
              setSuccessMessage("Welcome back! Redirecting...");
              setTimeout(() => {
                router.push("/");
                router.refresh();
              }, 800);
            },
            onError: (ctx) => {
              setLoading(false);
              setErrorMessage(
                ctx.error.message || "Invalid email or password. Please try again."
              );
            },
          }
        );
      } else {
        await signIn.username(
          {
            username: trimmedIdentifier,
            password,
          },
          {
            onSuccess: () => {
              setSuccessMessage("Welcome back! Redirecting...");
              setTimeout(() => {
                router.push("/");
                router.refresh();
              }, 800);
            },
            onError: (ctx) => {
              setLoading(false);
              setErrorMessage(
                ctx.error.message || "Invalid username or password. Please try again."
              );
            },
          }
        );
      }
    } catch (err: unknown) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : "Authentication failed.";
      setErrorMessage(msg);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setErrorMessage(null);
    setSocialLoading(provider);

    try {
      await signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (err: unknown) {
      setSocialLoading(null);
      const msg = err instanceof Error ? err.message : "Social login failed.";
      setErrorMessage(
        `${msg} (Ensure ${provider.toUpperCase()}_CLIENT_ID is configured in your .env)`
      );
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 flex items-center justify-center bg-stone-950 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs tracking-wider uppercase mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>CanvasCraft BD Member Portal</span>
          </Link>
          <h1 className="text-3xl font-serif text-stone-100 font-bold mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-stone-400">
            Sign in to access your saved studio designs and exclusive combo deals.
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-stone-900/80 backdrop-blur-xl border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Social Sign-In Buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => handleSocialSignIn("google")}
              disabled={loading || !!socialLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-sm font-medium border border-stone-700/80 hover:border-stone-600 transition disabled:opacity-50"
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
                  : "Continue with Google"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialSignIn("github")}
              disabled={loading || !!socialLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-sm font-medium border border-stone-700/80 hover:border-stone-600 transition disabled:opacity-50"
            >
              <svg className="w-4 h-4 fill-stone-100" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>
                {socialLoading === "github"
                  ? "Connecting to GitHub..."
                  : "Continue with GitHub"}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-stone-800 w-full" />
            <span className="bg-stone-900 px-3 text-xs text-stone-500 uppercase tracking-widest font-mono">
              or credentials
            </span>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="identifier"
                className="block text-xs font-medium text-stone-300 mb-1.5"
              >
                Email or Username
              </label>
              <div className="relative">
                <input
                  id="identifier"
                  type="text"
                  required
                  placeholder="name@domain.com or @username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-950/80 border border-stone-800 focus:border-amber-500/80 rounded-xl text-stone-100 placeholder-stone-600 text-sm focus:outline-none transition"
                />
                <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-stone-300"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-stone-950/80 border border-stone-800 focus:border-amber-500/80 rounded-xl text-stone-100 placeholder-stone-600 text-sm focus:outline-none transition"
                />
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
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
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold text-sm shadow-lg shadow-amber-500/20 transition disabled:opacity-50 mt-2"
            >
              <span>{loading ? "Signing in..." : "Sign In to Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 text-center text-xs text-stone-400">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/sign-up"
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4"
            >
              Sign Up with Username
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

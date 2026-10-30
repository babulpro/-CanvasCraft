"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Sparkles, ArrowRight, Eye, EyeOff, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

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
      const msg = "Please fill in all required fields.";
      setErrorMessage(msg);
      toast.error(msg);
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
              const msg = "Welcome back! Redirecting...";
              setSuccessMessage(msg);
              toast.success(msg);
              setTimeout(() => {
                router.push("/");
                router.refresh();
              }, 800);
            },
            onError: (ctx) => {
              setLoading(false);
              const msg = ctx.error.message || "Invalid email or password. Please try again.";
              setErrorMessage(msg);
              toast.error(msg);
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
              const msg = "Welcome back! Redirecting...";
              setSuccessMessage(msg);
              toast.success(msg);
              setTimeout(() => {
                router.push("/");
                router.refresh();
              }, 800);
            },
            onError: (ctx) => {
              setLoading(false);
              const msg = ctx.error.message || "Invalid username or password. Please try again.";
              setErrorMessage(msg);
              toast.error(msg);
            },
          }
        );
      }
    } catch (err: unknown) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : "Authentication failed.";
      setErrorMessage(msg);
      toast.error(msg);
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
      const fullMsg = `${msg} (Ensure ${provider.toUpperCase()}_CLIENT_ID is configured in your .env)`;
      setErrorMessage(fullMsg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 flex items-center justify-center bg-[#faf8f5] dark:bg-[#0c0a09] relative overflow-hidden transition-colors duration-200">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300/60 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-bold tracking-wider uppercase mb-4 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>CanvasCraft BD Member Portal</span>
          </Link>
          <h1 className="text-3xl font-serif text-stone-950 dark:text-stone-100 font-bold mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Sign in to access your saved studio designs and exclusive combo deals.
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-[#1c1917] border border-stone-200/90 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl ring-1 ring-stone-900/5 transition-colors">
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-3 text-red-700 dark:text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Social Sign-In Buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => handleSocialSignIn("google")}
              disabled={loading || !!socialLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm font-semibold border border-stone-200/90 dark:border-stone-700 hover:border-stone-300 transition shadow-2xs disabled:opacity-50 cursor-pointer"
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
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm font-semibold border border-stone-200/90 dark:border-stone-700 hover:border-stone-300 transition shadow-2xs disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-stone-900 dark:fill-stone-100" viewBox="0 0 24 24">
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
            <div className="border-t border-stone-200 dark:border-stone-800 w-full" />
            <span className="bg-white dark:bg-[#1c1917] px-3 text-xs text-stone-400 uppercase tracking-widest font-mono">
              or credentials
            </span>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="identifier"
                className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5"
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
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50/60 dark:bg-stone-900/80 border border-stone-300 dark:border-stone-700 focus:border-amber-500 focus:bg-white dark:focus:bg-stone-900 focus:ring-2 focus:ring-amber-400/20 rounded-xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 text-sm focus:outline-none shadow-2xs transition"
                />
                <User className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
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
                  className="w-full pl-10 pr-10 py-2.5 bg-stone-50/60 dark:bg-stone-900/80 border border-stone-300 dark:border-stone-700 focus:border-amber-500 focus:bg-white dark:focus:bg-stone-900 focus:ring-2 focus:ring-amber-400/20 rounded-xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 text-sm focus:outline-none shadow-2xs transition"
                />
                <Lock className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
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
              <span>{loading ? "Signing in..." : "Sign In to Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 text-center text-xs text-stone-600 dark:text-stone-400">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/sign-up"
              className="text-amber-800 dark:text-amber-400 hover:text-stone-950 dark:hover:text-stone-100 font-bold underline underline-offset-4"
            >
              Sign Up with Username
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

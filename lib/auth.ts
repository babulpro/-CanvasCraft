import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { username, admin } from "better-auth/plugins";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/canvascraft";
const client = new MongoClient(uri);
const db = client.db();

// Support standard names and custom aliases (GOOGLE_SECRECT, GITHUB_CLIENT)
const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret =
  process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_SECRECT || "";

const githubClientId =
  process.env.GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT || "";
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET || "";

// Configured admin emails (comma-separated in env)
const adminEmails = (process.env.ADMIN_EMAILS || "")
  .toLowerCase()
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
      requireLocalEmailVerified: false,
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const userEmail = (user.email || "").toLowerCase();
          // Any new user strictly receives 'user' role initially, unless explicitly listed in ADMIN_EMAILS
          const isAdmin = adminEmails.length > 0 && adminEmails.includes(userEmail);
          return {
            data: {
              ...user,
              role: isAdmin ? "admin" : "user",
            },
          };
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: googleClientId || "google_client_id_placeholder",
      clientSecret: googleClientSecret || "google_client_secret_placeholder",
    },
    github: {
      clientId: githubClientId || "github_client_id_placeholder",
      clientSecret: githubClientSecret || "github_client_secret_placeholder",
    },
  },
  plugins: [
    username(),
    admin({
      defaultRole: "user",
      adminRole: "admin",
    }),
  ],
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "canvascraft_fallback_secret_key_at_least_32_characters_long",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});

export type Session = typeof auth.$Infer.Session;

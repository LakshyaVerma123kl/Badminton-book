import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

// Icons
import { LayoutDashboard, CalendarDays } from "lucide-react";

// Auth & Theme Imports
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ui/themetoggle";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "CourtBooker | Premium Sports Facility",
  description:
    "Book badminton courts, rent equipment, and hire coaches instantly.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Fetch User on Server Side to check role
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  // 2. ADMIN CHECK: Replace with your exact email (must match admin page & API)
  const ADMIN_EMAILS = ["lakshya123kl@gmail.com"];
  const isAdmin = ADMIN_EMAILS.includes(userEmail || "");

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} min-h-screen bg-background text-foreground font-sans antialiased transition-colors duration-300`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* --- NAVBAR --- */}
            <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md transition-colors duration-300 shadow-sm">
              <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                    CB
                  </div>
                  <span className="text-lg font-bold tracking-tight text-foreground">
                    CourtBooker
                  </span>
                </Link>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                  {/* ADMIN LINK (Only visible to Admin) */}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="hidden md:flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-3 py-2 rounded-md hover:bg-primary/20 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Admin</span>
                    </Link>
                  )}

                  {/* MY BOOKINGS LINK (Visible to all logged-in users) */}
                  <SignedIn>
                    <Link
                      href="/my-bookings"
                      className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mr-2"
                    >
                      <CalendarDays className="w-4 h-4" />
                      <span>My Bookings</span>
                    </Link>
                  </SignedIn>

                  {/* Theme Switcher */}
                  <ThemeToggle />

                  {/* Auth Buttons */}
                  <div className="flex items-center ml-2">
                    <SignedOut>
                      <SignInButton mode="modal">
                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-all shadow-sm">
                          Sign In
                        </button>
                      </SignInButton>
                    </SignedOut>

                    <SignedIn>
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox:
                              "h-9 w-9 ring-2 ring-border hover:ring-primary transition-all",
                          },
                        }}
                      />
                    </SignedIn>
                  </div>
                </div>
              </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main>{children}</main>

            {/* --- FOOTER --- */}
            <footer className="py-8 border-t border-border bg-card mt-20 transition-colors duration-300">
              <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
                <p>
                  © {new Date().getFullYear()} CourtBooker Inc. All rights
                  reserved.
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

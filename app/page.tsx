import Link from "next/link";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowRight, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default async function LandingPage() {
  // 1. Get Current User Server-Side
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  // 2. Check Admin Status (MUST MATCH layout.tsx, admin page, and API route)
  const ADMIN_EMAILS = ["lakshyaverma123kl@gmail.com"];
  const isAdmin = ADMIN_EMAILS.includes(userEmail || "");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 transition-colors duration-300">
      {/* Hero Text */}
      <div className="text-center max-w-2xl mb-12 space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight text-foreground">
          Court<span className="text-primary">Booker</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          The premium platform for sports facility management.
          {!isAdmin && " Select your portal to continue."}
        </p>
      </div>

      {/* Portal Cards - Centered when only Player, Grid when both */}
      <div
        className={`grid ${
          isAdmin ? "md:grid-cols-2" : "md:grid-cols-1"
        } gap-8 w-full max-w-4xl justify-items-center`}
      >
        {/* PLAYER PORTAL - Always Visible */}
        <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-xl flex flex-col items-center text-center transition-all hover:-translate-y-1 duration-300">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Player Portal
          </h2>
          <p className="text-muted-foreground mb-8 flex-grow">
            Book courts, rent equipment, and schedule coaches instantly.
          </p>

          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/book">
              <Button className="w-full py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground">
                Login to Book <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/book" className="w-full">
              <Button className="w-full py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground">
                Go to Booking <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </SignedIn>
        </div>

        {/* ADMIN PORTAL - ONLY VISIBLE IF ADMIN */}
        {isAdmin && (
          <div className="w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-800 dark:from-black dark:to-slate-950 p-8 rounded-2xl shadow-xl border border-slate-700 dark:border-slate-800 flex flex-col items-center text-center transition-all hover:-translate-y-1 duration-300 relative overflow-hidden">
            {/* Aesthetic background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>

            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 relative z-10">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 relative z-10">
              Admin Portal
            </h2>
            <p className="text-slate-300 dark:text-slate-400 mb-8 flex-grow relative z-10">
              Manage facility schedules, view revenue, and configure resources.
            </p>

            <SignedOut>
              <SignInButton mode="modal" forceRedirectUrl="/admin">
                <Button className="w-full py-6 text-lg bg-emerald-600 hover:bg-emerald-700 text-white border-none relative z-10">
                  Admin Login <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link href="/admin" className="w-full relative z-10">
                <Button className="w-full py-6 text-lg bg-emerald-600 hover:bg-emerald-700 text-white border-none">
                  Access Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </SignedIn>
          </div>
        )}
      </div>
    </div>
  );
}

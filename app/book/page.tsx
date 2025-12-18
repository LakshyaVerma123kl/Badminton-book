import dbConnect from "@/lib/db";
import { Court, Coach, Equipment } from "@/lib/models";
import BookingWizard from "@/components/booking/BookingWizard";

// Force dynamic rendering to ensure fresh data on every request
export const dynamic = "force-dynamic";

async function getResources() {
  await dbConnect();

  // Fetch all resources in parallel for performance
  const [courts, coaches, equipment] = await Promise.all([
    Court.find({ isActive: true }).lean(),
    Coach.find({}).lean(),
    Equipment.find({}).lean(),
  ]);

  // Serialize MongoDB objects (convert _id to string) for Client Components
  return {
    courts: JSON.parse(JSON.stringify(courts)),
    coaches: JSON.parse(JSON.stringify(coaches)),
    equipment: JSON.parse(JSON.stringify(equipment)),
  };
}

export default async function Page() {
  const data = await getResources();

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 pb-20 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-950 dark:to-black text-white py-20 mb-10 shadow-inner overflow-hidden">
        {/* Background Pattern (Optional Aesthetic Touch) */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="container mx-auto px-4 relative z-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Book Your Game.
          </h1>
          <p className="text-slate-300 dark:text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed">
            Premium courts, professional coaches, and top-tier equipment.
            <span className="text-primary block sm:inline">
              {" "}
              Everything you need to win.
            </span>
          </p>
        </div>
      </section>

      {/* Main Wizard Component */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <BookingWizard
          courts={data.courts}
          coaches={data.coaches}
          equipmentList={data.equipment}
        />
      </div>
    </div>
  );
}

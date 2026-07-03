import Link from "next/link";

export default function Navbar({ role }: { role?: "Farmer" | "Admin" }) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-lg font-bold tracking-tight">
          YieldSense<span className="text-canopy">.</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm sm:gap-6">
          <Link href="/dashboard" className="hover:text-canopy">
            Dashboard
          </Link>
          <Link href="/onboarding" className="hover:text-canopy">
            Farms
          </Link>
          {role && (
            <span className="hidden border border-line px-2 py-1 font-mono text-xs text-ink/60 sm:inline">
              {role}
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}

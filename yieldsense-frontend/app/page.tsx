import Link from "next/link";
import SoilHorizonBar from "@/components/SoilHorizonBar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <SoilHorizonBar />
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-16 sm:px-6 sm:py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-canopy">
          Predictive analytics · kg/ha forecasts
        </p>
        <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-6xl">
          Know the harvest
          <br />
          before you plant it.
        </h1>
        <p className="max-w-xl text-base text-ink/70 sm:text-lg">
          YieldSense reads your soil, your coordinates, and the season&apos;s weather,
          then forecasts yield and flags climate risk before resources are
          committed to the field.
        </p>
        <div className="flex flex-col gap-4 pt-4 sm:flex-row">
          <Link
            href="/signup"
            className="border border-ink bg-ink px-6 py-3 text-center text-sm font-medium text-paper transition hover:bg-canopyDeep hover:border-canopyDeep"
          >
            Create an account
          </Link>
          <Link
            href="/login"
            className="border border-ink px-6 py-3 text-center text-sm font-medium text-ink transition hover:border-canopy hover:text-canopy"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}

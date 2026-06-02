import { SiteHeader } from "@/components/layout/site-header";
import { HeroSection } from "@/components/portal/hero-section";
import { ProjectRequestForm } from "@/components/portal/project-request-form";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <HeroSection />
      <main className="mx-auto max-w-7xl bg-slate-50 px-4 py-10 sm:px-6 sm:py-16">
        <ProjectRequestForm />
      </main>
      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} ContractorFlow. Built for the construction industry.
      </footer>
    </div>
  );
}

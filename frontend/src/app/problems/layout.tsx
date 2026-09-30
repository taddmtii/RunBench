import Navbar from "@/components/Navbar";

export default function ProblemsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <header className="px-6 sm:px-10">
        <Navbar />
      </header>
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

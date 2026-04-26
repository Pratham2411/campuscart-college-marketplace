import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";

export default function AppShell({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-hero-grid">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-4rem] h-64 w-64 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-24 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-sky-300/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <Navbar />
        <main className="flex-1 py-10">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-hero-grid">
      <Navbar />
      <div className="relative z-10 flex min-h-screen flex-col">
        <main className="page-content flex-1">
          <div className="container">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

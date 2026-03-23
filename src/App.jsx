import { Outlet, Link, useLocation } from "react-router-dom";
import "./App.css";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Leaderboard", to: "#" },
  { label: "Categories", to: "#" },
  { label: "Quests", to: "#" },
];

function TopNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#191920]/70 backdrop-blur-xl shadow-[0_8px_40px_rgba(157,167,255,0.06)] h-20">
      <div className="flex justify-between items-center px-8 h-full w-full max-w-7xl mx-auto font-[Plus_Jakarta_Sans] tracking-tight">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-br from-[#9da7ff] to-[#8c98ff] bg-clip-text text-transparent">
          Arcade Hub
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className={`transition-colors ${
                pathname === to
                  ? "text-[#9da7ff] border-b-2 border-[#9da7ff] pb-1"
                  : "text-[#9da7ff]/60 hover:text-[#9da7ff]"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-[#9da7ff] hover:bg-[#1f1f27] rounded-full transition-all duration-300">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-[#9da7ff] hover:bg-[#1f1f27] rounded-full transition-all duration-300">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-[#1f1f27] border border-[#48474e]/30 overflow-hidden flex items-center justify-center">
            <span className="material-symbols-outlined text-[#9da7ff]">person</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0e0e14] w-full py-12">
      <div className="bg-[#131319] h-px w-full mb-8" />
      <div className="flex flex-col items-center justify-center text-center px-6 font-[Manrope] text-xs uppercase tracking-widest">
        <div className="font-bold text-[#9da7ff] mb-6 text-lg tracking-normal normal-case">Arcade Hub</div>
        <div className="flex gap-8 mb-8">
          {["Privacy Policy", "Terms of Service", "Support"].map((l) => (
            <a key={l} href="#" className="text-[#9da7ff]/40 hover:text-[#9da7ff] transition-colors hover:underline decoration-[#bc87fe]">{l}</a>
          ))}
        </div>
        <p className="opacity-80">© 2024 Arcade Hub. Powering Ethereal Learning.</p>
      </div>
    </footer>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;

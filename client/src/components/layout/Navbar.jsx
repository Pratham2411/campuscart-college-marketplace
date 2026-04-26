import {
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  ShoppingBag,
  UserRound,
  X
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const navigation = [
  { label: "Marketplace", to: "/marketplace" },
  { label: "Wishlist", to: "/wishlist", protected: true },
  { label: "Messages", to: "/messages", protected: true }
];

const navClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-ink text-white"
      : "text-slate-600 hover:bg-white/80 hover:text-ink"
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-4 z-30 pt-4">
      <div className="surface-card flex items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-white">
            <ShoppingBag size={20} />
          </div>
          <div>
            <p className="font-display text-lg font-bold text-ink">CampusCart</p>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
              College Marketplace
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navigation
            .filter((item) => !item.protected || isAuthenticated)
            .map((item) => (
              <NavLink key={item.to} className={navClass} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          {isAuthenticated && (
            <Link className="btn-primary" to="/create-listing">
              <PlusCircle className="mr-2" size={16} />
              New Listing
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              {user?.role === "admin" && (
                <NavLink className={navClass} to="/admin">
                  <LayoutDashboard className="mr-2 inline-flex" size={16} />
                  Admin
                </NavLink>
              )}
              <NavLink className={navClass} to="/profile">
                <UserRound className="mr-2 inline-flex" size={16} />
                {user?.name?.split(" ")[0] || "Profile"}
              </NavLink>
              <button className="btn-secondary" onClick={handleLogout} type="button">
                <LogOut className="mr-2" size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn-secondary" to="/login">
                Login
              </Link>
              <Link className="btn-primary" to="/signup">
                Create Account
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-full border border-slate-200 p-3 text-slate-700 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="surface-card mt-3 space-y-3 px-4 py-4 lg:hidden">
          {navigation
            .filter((item) => !item.protected || isAuthenticated)
            .map((item) => (
              <NavLink
                key={item.to}
                className={navClass}
                onClick={() => setOpen(false)}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          {isAuthenticated && (
            <Link className="btn-primary w-full" onClick={() => setOpen(false)} to="/create-listing">
              <PlusCircle className="mr-2" size={16} />
              Create Listing
            </Link>
          )}
          {isAuthenticated ? (
            <>
              <NavLink className={navClass} onClick={() => setOpen(false)} to="/profile">
                <UserRound className="mr-2 inline-flex" size={16} />
                Profile
              </NavLink>
              {user?.role === "admin" && (
                <NavLink className={navClass} onClick={() => setOpen(false)} to="/admin">
                  <LayoutDashboard className="mr-2 inline-flex" size={16} />
                  Admin
                </NavLink>
              )}
              <button className="btn-secondary w-full" onClick={handleLogout} type="button">
                <LogOut className="mr-2" size={16} />
                Logout
              </button>
            </>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <Link className="btn-secondary w-full" onClick={() => setOpen(false)} to="/login">
                Login
              </Link>
              <Link className="btn-primary w-full" onClick={() => setOpen(false)} to="/signup">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

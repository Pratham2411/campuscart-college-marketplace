import {
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  ShoppingBag,
  UserRound,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";

const navigation = [
  { label: "Marketplace", to: "/marketplace" },
  { label: "Wishlist", to: "/wishlist", protected: true },
  { label: "Messages", to: "/messages", protected: true }
];

const navClass = ({ isActive }) =>
  `nav-link ${isActive ? "active" : ""}`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return undefined;
    }

    const loadUnreadCount = async () => {
      try {
        const { data } = await api.get("/messages/unread-count");
        setUnreadCount(data.count || 0);
      } catch {
        setUnreadCount(0);
      }
    };

    loadUnreadCount();
    const intervalId = window.setInterval(loadUnreadCount, 15000);

    return () => window.clearInterval(intervalId);
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <ShoppingBag size={20} />
          </div>
          <div>
            <p>CampusCart</p>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
              College Marketplace
            </p>
          </div>
        </Link>

        <nav className="navbar-links">
          {navigation
            .filter((item) => !item.protected || isAuthenticated)
            .map((item) => (
              <NavLink key={item.to} className={navClass} to={item.to}>
                {item.label}
                {item.to === "/messages" && unreadCount > 0 ? (
                  <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[0.68rem] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                ) : null}
              </NavLink>
            ))}
          {isAuthenticated && (
            <Link className="btn btn-primary" to="/create-listing">
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
              <button className="btn btn-secondary" onClick={handleLogout} type="button">
                <LogOut className="mr-2" size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-secondary" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary" to="/signup">
                Create Account
              </Link>
            </>
          )}
        </div>

        <button
          className="btn btn-secondary lg:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="container mt-3 space-y-3 px-4 py-4 lg:hidden">
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
                {item.to === "/messages" && unreadCount > 0 ? (
                  <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[0.68rem] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                ) : null}
              </NavLink>
            ))}
          {isAuthenticated && (
            <Link className="btn btn-primary w-full" onClick={() => setOpen(false)} to="/create-listing">
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
              <button className="btn btn-secondary w-full" onClick={handleLogout} type="button">
                <LogOut className="mr-2" size={16} />
                Logout
              </button>
            </>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <Link className="btn btn-secondary w-full" onClick={() => setOpen(false)} to="/login">
                Login
              </Link>
              <Link className="btn btn-primary w-full" onClick={() => setOpen(false)} to="/signup">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

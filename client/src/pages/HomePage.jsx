import { ArrowRight, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Loader from "../components/ui/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getApiErrorMessage } from "../utils/formatters.js";

const featureCards = [
  {
    title: "Verified student exchange",
    description:
      "Designed for campus communities so buying, selling, and trust all stay close to home.",
    icon: ShieldCheck
  },
  {
    title: "Fast peer-to-peer chat",
    description:
      "Coordinate pickup times, negotiate fairly, and close deals without leaving the platform.",
    icon: MessageSquareText
  },
  {
    title: "Modern listing workflow",
    description:
      "Upload images, add tags, manage wishlists, and keep your listings polished.",
    icon: Sparkles
  }
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const { data } = await api.get("/products?limit=6");
        setProducts(data.products || []);
      } catch (fetchError) {
        setError(getApiErrorMessage(fetchError, "Unable to load featured listings right now."));
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, []);

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="surface-card px-6 py-8 sm:px-10 sm:py-12">
          <p className="pill">Student-first marketplace</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-ink sm:text-5xl">
            Buy smarter. Sell faster. Keep campus commerce inside your community.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            CampusCart gives students a clean, trustworthy space to list textbooks,
            gadgets, hostel essentials, furniture, and everything in between.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link className="btn-primary" to="/marketplace">
              Explore Listings
              <ArrowRight className="ml-2" size={18} />
            </Link>
            <Link className="btn-secondary" to={isAuthenticated ? "/create-listing" : "/signup"}>
              {isAuthenticated ? "Create a Listing" : "Join CampusCart"}
            </Link>
          </div>
        </div>

        <div className="surface-card flex flex-col justify-between px-6 py-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Why students use it
            </p>
            <div className="mt-6 space-y-5">
              {featureCards.map(({ title, description, icon: Icon }) => (
                <div className="rounded-3xl bg-slate-50 p-5" key={title}>
                  <Icon className="text-accent" size={22} />
                  <h3 className="mt-3 text-lg font-bold text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="pill">Fresh on Campus</p>
            <h2 className="mt-3 text-3xl font-bold text-ink">Recently listed essentials</h2>
          </div>
          <Link className="text-sm font-semibold text-accent" to="/marketplace">
            Browse the full marketplace
          </Link>
        </div>

        {loading ? (
          <Loader label="Loading featured listings..." />
        ) : error ? (
          <EmptyState
            description={error}
            title="Featured listings are taking a moment"
            action={<Link className="btn-secondary" to="/marketplace">Open Marketplace</Link>}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

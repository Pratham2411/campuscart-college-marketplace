import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import ProductFilters from "../components/ProductFilters.jsx";
import Alert from "../components/ui/Alert.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Loader from "../components/ui/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import useDebounce from "../hooks/useDebounce.js";
import { getApiErrorMessage } from "../utils/formatters.js";

const defaultFilters = {
  search: "",
  category: "All",
  minPrice: "",
  maxPrice: "",
  sortBy: "latest"
};

export default function MarketplacePage() {
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState(defaultFilters);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const debouncedSearch = useDebounce(filters.search, 350);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set("search", debouncedSearch);
    if (filters.category !== "All") params.set("category", filters.category);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);

    return params.toString();
  }, [debouncedSearch, filters.category, filters.maxPrice, filters.minPrice, filters.sortBy]);

  const loadWishlist = async () => {
    if (!isAuthenticated) {
      setWishlistIds([]);
      return;
    }

    const { data } = await api.get("/wishlist");
    setWishlistIds((data.wishlist?.items || []).map((item) => item._id));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await api.get(`/products${queryString ? `?${queryString}` : ""}`);
        setProducts(data.products || []);
        setCategories(data.categories || []);
      } catch (fetchError) {
        setError(getApiErrorMessage(fetchError, "Unable to load marketplace listings."));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [queryString]);

  useEffect(() => {
    loadWishlist().catch(() => setWishlistIds([]));
  }, [isAuthenticated]);

  const handleToggleWishlist = async (productId) => {
    try {
      const { data } = await api.post(`/wishlist/${productId}/toggle`);
      setWishlistIds((current) =>
        data.isWishlisted
          ? [...new Set([...current, productId])]
          : current.filter((id) => id !== productId)
      );
    } catch (toggleError) {
      setError(getApiErrorMessage(toggleError, "Unable to update wishlist."));
    }
  };

  return (
    <div className="space-y-6">
      <div className="surface-card flex flex-col gap-5 px-6 py-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="pill">Marketplace</p>
          <h1 className="mt-4 text-4xl font-bold text-ink">Find the right item for campus life</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Browse peer-listed essentials, compare prices, save favorites, and chat with sellers.
          </p>
        </div>
        <Link className="btn-primary" to="/create-listing">
          Post a Listing
        </Link>
      </div>

      {error ? <Alert>{error}</Alert> : null}

      <ProductFilters
        categories={categories}
        filters={filters}
        onChange={(field, value) =>
          setFilters((current) => ({
            ...current,
            [field]: value
          }))
        }
        onReset={() => setFilters(defaultFilters)}
      />

      {loading ? (
        <Loader label="Loading marketplace..." />
      ) : products.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              onToggleWishlist={isAuthenticated ? handleToggleWishlist : null}
              product={product}
              wishlisted={wishlistIds.includes(product._id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          description="Try widening the price range or using a different keyword."
          title="No listings match these filters"
          action={<button className="btn-secondary" onClick={() => setFilters(defaultFilters)} type="button">Reset filters</button>}
        />
      )}
    </div>
  );
}

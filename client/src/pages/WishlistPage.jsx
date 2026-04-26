import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import Alert from "../components/ui/Alert.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Loader from "../components/ui/Loader.jsx";
import { getApiErrorMessage } from "../utils/formatters.js";

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWishlist = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/wishlist");
      setItems((data.wishlist?.items || []).filter(Boolean));
    } catch (wishlistError) {
      setError(getApiErrorMessage(wishlistError, "Unable to load wishlist."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleToggleWishlist = async (productId) => {
    try {
      await api.post(`/wishlist/${productId}/toggle`);
      setItems((current) => current.filter((item) => item._id !== productId));
    } catch (toggleError) {
      setError(getApiErrorMessage(toggleError, "Unable to update wishlist."));
    }
  };

  if (loading) {
    return <Loader fullScreen label="Loading wishlist..." />;
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="pill">Wishlist</p>
        <h1 className="mt-3 text-4xl font-bold text-ink">Saved campus picks</h1>
        <p className="mt-2 text-sm text-slate-500">
          Keep track of items you want to revisit before someone else grabs them.
        </p>
      </div>

      {error ? <Alert>{error}</Alert> : null}

      {items.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((product) => (
            <ProductCard
              key={product._id}
              onToggleWishlist={handleToggleWishlist}
              product={product}
              wishlisted
            />
          ))}
        </div>
      ) : (
        <EmptyState
          description="Browse the marketplace and tap the heart on listings you want to compare later."
          title="Your wishlist is empty"
          action={<Link className="btn-primary" to="/marketplace">Explore Marketplace</Link>}
        />
      )}
    </div>
  );
}

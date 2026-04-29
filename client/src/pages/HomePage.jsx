import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const CATEGORIES = ["All", "Books", "Electronics", "Clothing", "Furniture", "Stationery", "Sports", "Other"];

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);

    try {
      const params = {};
      if (search) params.search = search;
      if (category !== "All") params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const { data } = await api.get("/products", { params });
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, maxPrice, minPrice, search]);

  useEffect(() => {
    const timeoutId = window.setTimeout(fetchProducts, 350);
    return () => window.clearTimeout(timeoutId);
  }, [fetchProducts]);

  return (
    <>
      <section className="hero">
        <div className="hero-eyebrow">Campus-only marketplace</div>
        <h1 className="hero-title">
          Buy &amp; Sell
          <br />
          <span className="gradient">Within Your Campus</span>
        </h1>
        <p className="hero-subtitle">
          Find great deals on textbooks, electronics, and more, listed by
          students, for students.
        </p>
        <div className="hero-cta">
          {isAuthenticated ? (
            <Link to="/create-listing" className="btn btn-primary btn-lg">+ List an Item</Link>
          ) : (
            <Link to="/signup" className="btn btn-primary btn-lg">Get Started Free</Link>
          )}
          <a href="#listings" className="btn btn-secondary btn-lg">Browse Listings</a>
        </div>
      </section>

      <div id="listings" className="filters-bar">
        <div className="search-wrap">
          <span className="search-icon">Search</span>
          <input
            id="search-input"
            className="form-input"
            placeholder="Search listings..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          id="category-filter"
          className="form-select filter-select"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {CATEGORIES.map((item) => <option key={item}>{item}</option>)}
        </select>

        <input
          id="min-price"
          className="form-input filter-select"
          placeholder="Min INR"
          type="number"
          min="0"
          value={minPrice}
          onChange={(event) => setMinPrice(event.target.value)}
          style={{ maxWidth: 120 }}
        />
        <input
          id="max-price"
          className="form-input filter-select"
          placeholder="Max INR"
          type="number"
          min="0"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
          style={{ maxWidth: 120 }}
        />
      </div>

      {loading ? (
        <div className="loader-page"><div className="spinner" /></div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">Listings</div>
          <h3>No listings found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}
    </>
  );
}

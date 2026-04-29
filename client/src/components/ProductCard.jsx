import { Link } from "react-router-dom";
import { formatCurrency, getImageSrc } from "../utils/formatters.js";
import WishlistButton from "./ui/WishlistButton.jsx";

export default function ProductCard({
  product,
  wishlisted = false,
  onToggleWishlist = null
}) {
  const productHref = `/products/${product._id}`;
  const isSold = product.status === "sold";

  return (
    <article className="product-card">
      <Link to={productHref}>
        <div className="card-image-wrap">
          <img
            alt={product.title}
            src={getImageSrc(product.images?.[0])}
          />
          <div className="card-badge">
            <span className="badge badge-violet">{product.category}</span>
          </div>
          {isSold ? (
            <div className="card-sold-overlay">
              <span>Sold</span>
            </div>
          ) : null}
          {onToggleWishlist ? (
            <div className="absolute right-3 top-3">
              <WishlistButton active={wishlisted} onClick={() => onToggleWishlist(product._id)} />
            </div>
          ) : null}
        </div>

        <div className="card-body">
          <h3 className="card-title">{product.title}</h3>
          <div className="card-price">{formatCurrency(product.price)}</div>
          <div className="card-meta">
            <span>{product.seller?.name || "Student Seller"}</span>
            <span>|</span>
            <span>{product.condition || "Good"}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

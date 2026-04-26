import { MapPin, MessageSquare, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency, getImageSrc } from "../utils/formatters.js";
import RatingStars from "./ui/RatingStars.jsx";
import WishlistButton from "./ui/WishlistButton.jsx";

export default function ProductCard({
  product,
  wishlisted = false,
  onToggleWishlist = null
}) {
  return (
    <article className="surface-card group overflow-hidden">
      <div className="relative">
        <img
          alt={product.title}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          src={getImageSrc(product.images?.[0])}
        />
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="pill">{product.category}</span>
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
            {product.condition}
          </span>
        </div>
        {onToggleWishlist ? (
          <div className="absolute right-4 top-4">
            <WishlistButton active={wishlisted} onClick={() => onToggleWishlist(product._id)} />
          </div>
        ) : null}
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-ink">
              <Link to={`/products/${product._id}`}>{product.title}</Link>
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-slate-500">
              {product.description}
            </p>
          </div>
          <p className="text-xl font-extrabold text-ink">{formatCurrency(product.price)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="inline-flex items-center gap-2">
            <MapPin size={16} />
            {product.campusLocation}
          </span>
          <span className="inline-flex items-center gap-2">
            <MessageSquare size={16} />
            {product.seller?.name || "Student Seller"}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            <RatingStars rating={Math.round(product.averageRating || 0)} small />
            <span className="text-xs font-medium text-slate-500">
              {product.reviewCount || 0} review{product.reviewCount === 1 ? "" : "s"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Tag size={14} />
            {(product.tags || []).slice(0, 2).join(" • ") || "Campus-ready"}
          </div>
        </div>
      </div>
    </article>
  );
}

import {
  Flag,
  MessageSquare,
  Pencil,
  Star,
  Trash2
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import Alert from "../components/ui/Alert.jsx";
import Loader from "../components/ui/Loader.jsx";
import RatingStars from "../components/ui/RatingStars.jsx";
import WishlistButton from "../components/ui/WishlistButton.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  formatCurrency,
  formatDate,
  getApiErrorMessage,
  getImageSrc,
  getInitials
} from "../utils/formatters.js";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlisted, setWishlisted] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reportForm, setReportForm] = useState({ reason: "", details: "" });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const isOwner = useMemo(
    () => user && product && product.seller?._id === user._id,
    [product, user]
  );

  const isAdmin = user?.role === "admin";

  const loadWishlistState = async () => {
    if (!isAuthenticated) {
      setWishlisted(false);
      return;
    }

    const { data } = await api.get("/wishlist");
    const savedIds = (data.wishlist?.items || []).map((item) => item._id);
    setWishlisted(savedIds.includes(productId));
  };

  const loadPage = async () => {
    setLoading(true);
    setError("");

    try {
      const [productResponse, reviewsResponse] = await Promise.all([
        api.get(`/products/${productId}`),
        api.get(`/reviews/product/${productId}`)
      ]);

      setProduct(productResponse.data.product);
      setRelatedProducts(productResponse.data.relatedProducts || []);
      setReviews(reviewsResponse.data.reviews || []);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, "Unable to load this listing."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, [productId]);

  useEffect(() => {
    loadWishlistState().catch(() => setWishlisted(false));
  }, [isAuthenticated, productId]);

  const handleToggleWishlist = async () => {
    try {
      const { data } = await api.post(`/wishlist/${productId}/toggle`);
      setWishlisted(data.isWishlisted);
    } catch (toggleError) {
      setError(getApiErrorMessage(toggleError, "Unable to update wishlist."));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this listing permanently?")) {
      return;
    }

    setActionLoading(true);
    try {
      await api.delete(`/products/${productId}`);
      navigate("/profile");
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError, "Unable to delete listing."));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    setReviewLoading(true);

    try {
      await api.post(`/reviews/product/${productId}`, reviewForm);
      setReviewForm({ rating: 5, comment: "" });
      await loadPage();
    } catch (reviewError) {
      setError(getApiErrorMessage(reviewError, "Unable to save review."));
    } finally {
      setReviewLoading(false);
    }
  };

  const handleReportSubmit = async (event) => {
    event.preventDefault();
    setReportLoading(true);

    try {
      await api.post(`/reports/product/${productId}`, reportForm);
      setReportForm({ reason: "", details: "" });
    } catch (reportError) {
      setError(getApiErrorMessage(reportError, "Unable to submit report."));
    } finally {
      setReportLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen label="Loading listing..." />;
  }

  if (!product) {
    return <Alert>{error || "Listing not found."}</Alert>;
  }

  return (
    <div className="space-y-8">
      {error ? <Alert>{error}</Alert> : null}

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="surface-card overflow-hidden">
          <img
            alt={product.title}
            className="h-[28rem] w-full object-cover"
            src={getImageSrc(product.images?.[0])}
          />
          <div className="grid gap-3 p-5 sm:grid-cols-3">
            {product.images?.slice(1).map((image, index) => (
              <img
                alt={`${product.title} view ${index + 2}`}
                className="h-32 w-full rounded-2xl object-cover"
                key={`${image.url}-${index + 1}`}
                src={getImageSrc(image)}
              />
            ))}
          </div>
        </div>

        <div className="surface-card space-y-6 px-6 py-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="pill">{product.category}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {product.condition}
              </span>
            </div>
            {isAuthenticated && !isOwner ? (
              <WishlistButton active={wishlisted} onClick={handleToggleWishlist} />
            ) : null}
          </div>

          <div>
            <h1 className="text-4xl font-bold text-ink">{product.title}</h1>
            <p className="mt-3 text-sm leading-7 text-slate-500">{product.description}</p>
          </div>

          <div className="flex items-center justify-between rounded-3xl bg-slate-50 px-5 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Asking Price</p>
              <p className="mt-2 text-3xl font-extrabold text-ink">{formatCurrency(product.price)}</p>
            </div>
            <div className="text-right">
              <RatingStars rating={Math.round(product.averageRating || 0)} />
              <p className="mt-2 text-sm text-slate-500">
                {product.reviewCount || 0} review{product.reviewCount === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 rounded-3xl border border-slate-100 p-5 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Campus Location</p>
              <p className="mt-2 font-semibold text-slate-700">{product.campusLocation}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Listed On</p>
              <p className="mt-2 font-semibold text-slate-700">{formatDate(product.createdAt)}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 px-5 py-5 text-white">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Seller</p>
            <div className="mt-4 flex items-center gap-4">
              {product.seller?.avatar?.url ? (
                <img
                  alt={product.seller.name}
                  className="h-14 w-14 rounded-2xl object-cover"
                  src={product.seller.avatar.url}
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold">
                  {getInitials(product.seller?.name)}
                </div>
              )}
              <div>
                <p className="font-semibold">{product.seller?.name}</p>
                <p className="text-sm text-slate-300">{product.seller?.college}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {isAuthenticated && !isOwner ? (
              <button
                className="btn-primary"
                onClick={() =>
                  navigate(
                    `/messages?productId=${product._id}&participantId=${product.seller._id}`
                  )
                }
                type="button"
              >
                <MessageSquare className="mr-2" size={16} />
                Message Seller
              </button>
            ) : null}

            {(isOwner || isAdmin) && (
              <>
                <Link className="btn-secondary" to={`/products/${productId}/edit`}>
                  <Pencil className="mr-2" size={16} />
                  Edit
                </Link>
                <button
                  className="btn-secondary"
                  disabled={actionLoading}
                  onClick={handleDelete}
                  type="button"
                >
                  <Trash2 className="mr-2" size={16} />
                  {actionLoading ? "Deleting..." : "Delete"}
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="surface-card space-y-6 px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="pill">Ratings & Reviews</p>
              <h2 className="mt-3 text-2xl font-bold text-ink">What other students are saying</h2>
            </div>
          </div>

          {reviews.length ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div className="rounded-3xl border border-slate-100 p-5" key={review._id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-800">{review.reviewer?.name}</p>
                      <p className="text-xs text-slate-500">{formatDate(review.createdAt)}</p>
                    </div>
                    <RatingStars rating={review.rating} small />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{review.comment || "No comment provided."}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No reviews yet. Be the first to leave one.</p>
          )}

          {isAuthenticated && !isOwner && (
            <form className="space-y-4 rounded-3xl bg-slate-50 p-5" onSubmit={handleReviewSubmit}>
              <div>
                <label className="label-text" htmlFor="rating">
                  Rating
                </label>
                <select
                  className="input-field"
                  id="rating"
                  onChange={(event) =>
                    setReviewForm((current) => ({
                      ...current,
                      rating: Number(event.target.value)
                    }))
                  }
                  value={reviewForm.rating}
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value} Star{value === 1 ? "" : "s"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-text" htmlFor="comment">
                  Review
                </label>
                <textarea
                  className="input-field min-h-28"
                  id="comment"
                  onChange={(event) =>
                    setReviewForm((current) => ({
                      ...current,
                      comment: event.target.value
                    }))
                  }
                  placeholder="Share what the transaction was like."
                  value={reviewForm.comment}
                />
              </div>
              <button className="btn-primary" disabled={reviewLoading} type="submit">
                <Star className="mr-2" size={16} />
                {reviewLoading ? "Saving..." : "Submit Review"}
              </button>
            </form>
          )}
        </div>

        {!isOwner && isAuthenticated && (
          <div className="surface-card h-fit space-y-5 px-6 py-8">
            <div>
              <p className="pill">Safety Tools</p>
              <h2 className="mt-3 text-2xl font-bold text-ink">Report this listing</h2>
              <p className="mt-2 text-sm text-slate-500">
                Flag spam, misleading details, unsafe behavior, or policy violations for moderation.
              </p>
            </div>
            <form className="space-y-4" onSubmit={handleReportSubmit}>
              <div>
                <label className="label-text" htmlFor="reason">
                  Reason
                </label>
                <input
                  className="input-field"
                  id="reason"
                  onChange={(event) =>
                    setReportForm((current) => ({
                      ...current,
                      reason: event.target.value
                    }))
                  }
                  placeholder="Misleading description"
                  value={reportForm.reason}
                />
              </div>
              <div>
                <label className="label-text" htmlFor="details">
                  Details
                </label>
                <textarea
                  className="input-field min-h-32"
                  id="details"
                  onChange={(event) =>
                    setReportForm((current) => ({
                      ...current,
                      details: event.target.value
                    }))
                  }
                  placeholder="Add context for moderators."
                  value={reportForm.details}
                />
              </div>
              <button className="btn-secondary" disabled={reportLoading} type="submit">
                <Flag className="mr-2" size={16} />
                {reportLoading ? "Submitting..." : "Submit Report"}
              </button>
            </form>
          </div>
        )}
      </section>

      {relatedProducts.length ? (
        <section className="space-y-5">
          <div>
            <p className="pill">You may also like</p>
            <h2 className="mt-3 text-3xl font-bold text-ink">Similar campus listings</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

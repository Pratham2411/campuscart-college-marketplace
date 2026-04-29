import {
  Camera,
  Eye,
  Pencil,
  PencilLine,
  PlusCircle,
  RotateCcw,
  Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import Alert from "../components/ui/Alert.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Loader from "../components/ui/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  formatCurrency,
  getApiErrorMessage,
  getImageSrc,
  getInitials
} from "../utils/formatters.js";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    college: "",
    phone: "",
    bio: ""
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const activeListings = listings.filter((listing) => listing.status === "active");
  const soldListings = listings.filter((listing) => listing.status === "sold");

  const loadProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const [profileResponse, listingsResponse] = await Promise.all([
        api.get("/users/profile"),
        api.get("/users/listings")
      ]);

      setProfile(profileResponse.data.user);
      setStats(profileResponse.data.stats);
      setListings(listingsResponse.data.listings || []);
      setFormValues({
        name: profileResponse.data.user.name || "",
        email: profileResponse.data.user.email || "",
        college: profileResponse.data.user.college || "",
        phone: profileResponse.data.user.phone || "",
        bio: profileResponse.data.user.bio || ""
      });
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, "Unable to load your profile."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();

      Object.entries(formValues).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const { data } = await api.patch("/users/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setProfile(data.user);
      updateUser(data.user);
    } catch (saveError) {
      setError(getApiErrorMessage(saveError, "Unable to save profile."));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm("Delete this listing permanently?")) {
      return;
    }

    setError("");

    try {
      await api.delete(`/products/${listingId}`);
      setListings((current) => current.filter((listing) => listing._id !== listingId));
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError, "Unable to delete listing."));
    }
  };

  const handleToggleStatus = async (listing) => {
    const nextStatus = listing.status === "sold" ? "active" : "sold";
    setError("");

    try {
      const { data } = await api.patch(`/products/${listing._id}/status`, {
        status: nextStatus
      });
      setListings((current) =>
        current.map((item) => (item._id === listing._id ? data.product : item))
      );
    } catch (statusError) {
      setError(getApiErrorMessage(statusError, "Unable to update listing status."));
    }
  };

  if (loading) {
    return <Loader fullScreen label="Loading your profile..." />;
  }

  return (
    <div className="space-y-8">
      {error ? <Alert>{error}</Alert> : null}

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="surface-card space-y-6 px-6 py-8">
          <div className="flex items-center gap-4">
            {profile?.avatar?.url ? (
              <img
                alt={profile.name}
                className="h-20 w-20 rounded-3xl object-cover"
                src={profile.avatar.url}
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-ink text-2xl font-bold text-white">
                {getInitials(profile?.name || user?.name)}
              </div>
            )}
            <div>
              <p className="pill">{profile?.role === "admin" ? "Administrator" : "Student Seller"}</p>
              <h1 className="mt-3 text-3xl font-bold text-ink">{profile?.name}</h1>
              <p className="text-sm text-slate-500">{profile?.college}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Listings</p>
              <p className="mt-2 text-3xl font-bold text-ink">{stats?.listingCount || 0}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Wishlist</p>
              <p className="mt-2 text-3xl font-bold text-ink">{stats?.wishlistCount || 0}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-ink">Bio</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              {profile?.bio || "Add a short introduction so buyers know who they are dealing with."}
            </p>
          </div>
        </div>

        <form className="surface-card space-y-5 px-6 py-8" onSubmit={handleSave}>
          <div className="flex items-center justify-between">
            <div>
              <p className="pill">Profile Settings</p>
              <h2 className="mt-3 text-2xl font-bold text-ink">Keep your seller profile current</h2>
            </div>
            <PencilLine className="text-accent" size={22} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label-text" htmlFor="name">
                Name
              </label>
              <input
                className="input-field"
                id="name"
                onChange={(event) =>
                  setFormValues((current) => ({ ...current, name: event.target.value }))
                }
                value={formValues.name}
              />
            </div>
            <div>
              <label className="label-text" htmlFor="email">
                Email
              </label>
              <input
                className="input-field"
                id="email"
                onChange={(event) =>
                  setFormValues((current) => ({ ...current, email: event.target.value }))
                }
                type="email"
                value={formValues.email}
              />
            </div>
            <div>
              <label className="label-text" htmlFor="college">
                College
              </label>
              <input
                className="input-field"
                id="college"
                onChange={(event) =>
                  setFormValues((current) => ({ ...current, college: event.target.value }))
                }
                value={formValues.college}
              />
            </div>
            <div>
              <label className="label-text" htmlFor="phone">
                Phone
              </label>
              <input
                className="input-field"
                id="phone"
                onChange={(event) =>
                  setFormValues((current) => ({ ...current, phone: event.target.value }))
                }
                value={formValues.phone}
              />
            </div>
          </div>

          <div>
            <label className="label-text" htmlFor="bio">
              Bio
            </label>
            <textarea
              className="input-field min-h-32"
              id="bio"
              onChange={(event) =>
                setFormValues((current) => ({ ...current, bio: event.target.value }))
              }
              value={formValues.bio}
            />
          </div>

          <div>
            <label className="label-text" htmlFor="avatar">
              Avatar
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-600">
              <Camera className="text-accent" size={18} />
              <span>{avatarFile ? avatarFile.name : "Upload a new profile image"}</span>
              <input
                className="hidden"
                id="avatar"
                onChange={(event) => setAvatarFile(event.target.files?.[0] || null)}
                type="file"
              />
            </label>
          </div>

          <button className="btn-primary" disabled={saving} type="submit">
            {saving ? "Saving changes..." : "Save Profile"}
          </button>
        </form>
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="pill">Your Listings</p>
            <h2 className="mt-3 text-3xl font-bold text-ink">Manage what you have posted</h2>
          </div>
          <Link className="btn-primary" to="/create-listing">
            <PlusCircle className="mr-2" size={16} />
            Create Listing
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total", value: listings.length },
            { label: "Active", value: activeListings.length },
            { label: "Sold", value: soldListings.length }
          ].map((item) => (
            <div className="surface-card px-5 py-4 text-center" key={item.label}>
              <p className="text-3xl font-extrabold text-accent">{item.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {listings.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => {
              const isSold = listing.status === "sold";

              return (
                <article className="surface-card overflow-hidden" key={listing._id}>
                  <Link className="block overflow-hidden" to={`/products/${listing._id}`}>
                    <img
                      alt={listing.title}
                      className="h-48 w-full object-cover transition duration-500 hover:scale-[1.03]"
                      src={getImageSrc(listing.images?.[0])}
                    />
                  </Link>

                  <div className="space-y-4 p-5">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isSold
                            ? "bg-red-500/15 text-red-200"
                            : "bg-emerald-500/15 text-emerald-200"
                        }`}
                      >
                        {isSold ? "Sold" : "Active"}
                      </span>
                      <span className="pill">{listing.category}</span>
                    </div>

                    <div>
                      <h3 className="truncate text-lg font-bold text-ink" title={listing.title}>
                        {listing.title}
                      </h3>
                      <p className="mt-1 text-xl font-extrabold text-accent">
                        {formatCurrency(listing.price)}
                      </p>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <Link
                        aria-label={`View ${listing.title}`}
                        className="btn-secondary px-3 py-2"
                        to={`/products/${listing._id}`}
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        aria-label={`Edit ${listing.title}`}
                        className="btn-secondary px-3 py-2"
                        to={`/products/${listing._id}/edit`}
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        aria-label={isSold ? "Mark active" : "Mark sold"}
                        className="btn-secondary px-3 py-2"
                        onClick={() => handleToggleStatus(listing)}
                        type="button"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button
                        aria-label={`Delete ${listing.title}`}
                        className="btn-secondary px-3 py-2 text-red-200 hover:text-red-100"
                        onClick={() => handleDeleteListing(listing._id)}
                        type="button"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            description="Once you publish listings, they'll appear here for quick editing and tracking."
            title="You have not posted anything yet"
            action={<Link className="btn-primary" to="/create-listing">Create your first listing</Link>}
          />
        )}
      </section>
    </div>
  );
}

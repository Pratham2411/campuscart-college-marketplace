import { Heart } from "lucide-react";

export default function WishlistButton({
  active,
  disabled = false,
  onClick
}) {
  return (
    <button
      className={`rounded-full border p-2 transition ${
        active
          ? "border-rose-200 bg-rose-50 text-rose-600"
          : "border-slate-200 bg-white text-slate-500 hover:border-rose-200 hover:text-rose-600"
      }`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <Heart className={active ? "fill-current" : ""} size={18} />
    </button>
  );
}

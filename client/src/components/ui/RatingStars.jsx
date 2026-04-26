import { Star } from "lucide-react";

export default function RatingStars({ rating = 0, small = false }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const active = rating >= index + 1;
        return (
          <Star
            key={`${index + 1}`}
            className={active ? "fill-amber-400 text-amber-400" : "text-slate-300"}
            size={small ? 14 : 18}
          />
        );
      })}
    </div>
  );
}

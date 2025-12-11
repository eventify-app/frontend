import { Star } from "lucide-react";

export function RatingStars({ rating, onChange }) {

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((value) => {
        const active = value <= rating;

        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className="p-1"
          >
            <Star
              size={28}
              className={`transition-all cursor-pointer ${
                active
                  ? "fill-yellow-400 text-yellow-500 scale-110"
                  : "text-gray-300 hover:text-yellow-400 hover:scale-110"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

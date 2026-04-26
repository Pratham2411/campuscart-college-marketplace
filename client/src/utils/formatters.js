export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value || 0);

export const formatDate = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(value));

export const getApiErrorMessage = (error, fallback = "Something went wrong.") =>
  error?.response?.data?.message || error?.message || fallback;

export const getInitials = (name = "Campus User") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

const placeholderSvg = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="480" height="320">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fff7ed"/>
        <stop offset="100%" stop-color="#e0f2fe"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="96" cy="96" r="64" fill="#fb923c" fill-opacity="0.18"/>
    <circle cx="400" cy="60" r="48" fill="#0f766e" fill-opacity="0.16"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#0f172a">CampusCart</text>
  </svg>
`);

export const getImageSrc = (image) =>
  image?.url || `data:image/svg+xml;charset=UTF-8,${placeholderSvg}`;

const colorMap = {
  violet: {
    bg: "bg-violet-50 dark:bg-violet-900/20",
    icon: "bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-100 dark:border-violet-900/40",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    icon: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-100 dark:border-emerald-900/40",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-900/20",
    icon: "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-100 dark:border-rose-900/40",
  },
  sky: {
    bg: "bg-sky-50 dark:bg-sky-900/20",
    icon: "bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400",
    text: "text-sky-700 dark:text-sky-300",
    border: "border-sky-100 dark:border-sky-900/40",
  },
};

export default function SummaryCard({
  label,
  value,
  icon,
  color,
  trend,
  trendUp,
  desc,
  isPercent,
}) {
  const c = colorMap[color];

  const formatValue = (v) => {
    if (isPercent) return v;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(v);
  };

  return (
    <div
      className={`rounded-2xl border ${c.border} ${c.bg} p-5 transition-all hover:shadow-md hover:-translate-y-0.5 duration-200`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${c.icon}`}
        >
          {icon}
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1
          ${
            trendUp
              ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
              : "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400"
          }`}
        >
          {trendUp ? "↑" : "↑"} {trend}
        </span>
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className={`text-2xl font-bold ${c.text}`}>{formatValue(value)}</p>
        <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">{desc}</p>
      </div>
    </div>
  );
}

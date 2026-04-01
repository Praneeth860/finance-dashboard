import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const fmt = (v) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(v);
    return (
      <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-3 shadow-xl text-sm">
        <p className="font-semibold text-slate-700 dark:text-gray-200 mb-2">
          {label}
        </p>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: p.color }}
            />
            <span className="text-slate-500 dark:text-gray-400 capitalize">
              {p.name}:
            </span>
            <span className="font-semibold text-slate-700 dark:text-gray-200">
              {fmt(p.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function BalanceTrendChart({ data }) {
  const fmt = (v) => `₹${(v / 1000).toFixed(0)}k`;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            Income vs Expenses
          </h3>
          <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">
            Monthly breakdown 2024
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-slate-500 dark:text-gray-400">
            <span className="w-3 h-3 rounded bg-violet-500" /> Income
          </span>
          <span className="flex items-center gap-1.5 text-slate-500 dark:text-gray-400">
            <span className="w-3 h-3 rounded bg-rose-400" /> Expenses
          </span>
          <span className="flex items-center gap-1.5 text-slate-500 dark:text-gray-400">
            <span className="w-3 h-0.5 bg-emerald-500" /> Balance
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} barGap={4}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
            strokeOpacity={0.5}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={fmt}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="income"
            fill="#8b5cf6"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
            name="income"
          />
          <Bar
            dataKey="expenses"
            fill="#fb7185"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
            name="expenses"
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#10b981" }}
            name="balance"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

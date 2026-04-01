import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CATEGORY_COLORS } from "../../data/mockData";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-3 shadow-xl text-sm">
        <p className="font-semibold text-slate-700 dark:text-gray-200">
          {item.name}
        </p>
        <p className="text-slate-500 dark:text-gray-400 mt-1">
          ₹{item.value.toLocaleString("en-IN")}
        </p>
        <p className="text-slate-400 dark:text-gray-500 text-xs">
          {item.payload.percent?.toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

export default function SpendingPieChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const withPercent = data.map((d) => ({
    ...d,
    percent: (d.value / total) * 100,
  }));
  const top5 = withPercent.slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-5 h-full">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-white">
          Spending Breakdown
        </h3>
        <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">
          By category
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-slate-400 dark:text-gray-500 text-sm">
          No expense data available
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={top5}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {top5.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={CATEGORY_COLORS[entry.name] || "#8b5cf6"}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-2 mt-2">
            {top5.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{
                      background: CATEGORY_COLORS[item.name] || "#8b5cf6",
                    }}
                  />
                  <span className="text-xs text-slate-600 dark:text-gray-300 truncate max-w-[100px]">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-gray-200">
                    ₹{item.value.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-gray-500 w-10 text-right">
                    {item.percent.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

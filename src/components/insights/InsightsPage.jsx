import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts";
import { useFinance } from "../../context/FinanceContext";
import { CATEGORY_COLORS } from "../../data/mockData";

const fmt = (v) => `₹${(v / 1000).toFixed(0)}k`;
const fmtFull = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v);

const InsightCard = ({ icon, title, value, sub, color }) => (
  <div
    className={`bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-5 flex items-start gap-4`}
  >
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${color}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-1">
        {title}
      </p>
      <p className="text-xl font-bold text-slate-800 dark:text-white">
        {value}
      </p>
      <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{sub}</p>
    </div>
  </div>
);

export default function InsightsPage() {
  const { state, getMonthlyData, getCategoryData } = useFinance();
  const monthlyData = getMonthlyData();
  const categoryData = getCategoryData();

  const totalIncome = state.transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpenses = state.transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const savingsRate =
    totalIncome > 0
      ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
      : 0;

  const highestCategory = categoryData[0] || { name: "N/A", value: 0 };

  const bestMonth = monthlyData.reduce(
    (best, m) => (m.balance > (best?.balance || -Infinity) ? m : best),
    null,
  );
  const worstMonth = monthlyData.reduce(
    (worst, m) => (m.expenses > (worst?.expenses || -Infinity) ? m : worst),
    null,
  );

  const avgMonthlyExpense = monthlyData.filter((m) => m.expenses > 0).length
    ? monthlyData.reduce((s, m) => s + m.expenses, 0) /
      monthlyData.filter((m) => m.expenses > 0).length
    : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-3 shadow-xl text-sm">
          <p className="font-semibold text-slate-700 dark:text-gray-200 mb-2">
            {label}
          </p>
          {payload.map((p) => (
            <div key={p.name} className="flex items-center gap-2 mb-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: p.color }}
              />
              <span className="text-slate-500 dark:text-gray-400 capitalize">
                {p.name}:
              </span>
              <span className="font-semibold text-slate-700 dark:text-gray-200">
                {fmtFull(p.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          Insights
        </h2>
        <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
          Smart observations from your financial data
        </p>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <InsightCard
          icon="🏆"
          title="Top Spending Category"
          value={highestCategory.name}
          sub={`${fmtFull(highestCategory.value)} total spent`}
          color="bg-amber-50 dark:bg-amber-900/20 text-amber-600"
        />
        <InsightCard
          icon="💾"
          title="Savings Rate"
          value={`${savingsRate}%`}
          sub={`${savingsRate >= 20 ? "✅ Healthy savings" : "⚠️ Consider saving more"}`}
          color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
        />
        <InsightCard
          icon="📅"
          title="Best Month"
          value={bestMonth?.month || "N/A"}
          sub={`Balance: ${fmtFull(bestMonth?.balance || 0)}`}
          color="bg-violet-50 dark:bg-violet-900/20 text-violet-600"
        />
        <InsightCard
          icon="📊"
          title="Avg Monthly Expense"
          value={fmtFull(avgMonthlyExpense)}
          sub={`Highest: ${worstMonth?.month || "N/A"} (${fmtFull(worstMonth?.expenses || 0)})`}
          color="bg-rose-50 dark:bg-rose-900/20 text-rose-600"
        />
      </div>

      {/* Monthly Comparison */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-5">
          <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">
            Monthly Expense Comparison
          </h3>
          <p className="text-xs text-slate-400 dark:text-gray-500 mb-5">
            How your spending changed month over month
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData}>
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
              <ReferenceLine
                y={avgMonthlyExpense}
                stroke="#f97316"
                strokeDasharray="4 4"
                label={{
                  value: "Avg",
                  position: "right",
                  fontSize: 11,
                  fill: "#f97316",
                }}
              />
              <Bar
                dataKey="expenses"
                fill="#fb7185"
                radius={[6, 6, 0, 0]}
                maxBarSize={45}
                name="expenses"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-5">
          <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">
            Net Balance Trend
          </h3>
          <p className="text-xs text-slate-400 dark:text-gray-500 mb-5">
            Monthly net balance (income minus expenses)
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyData}>
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
              <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                dot={{ r: 5, fill: "#8b5cf6" }}
                activeDot={{ r: 7 }}
                name="balance"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-5">
        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">
          Full Category Breakdown
        </h3>
        <p className="text-xs text-slate-400 dark:text-gray-500 mb-5">
          Total spending across all categories
        </p>

        {categoryData.length === 0 ? (
          <div className="text-center py-8 text-slate-400 dark:text-gray-500 text-sm">
            No expense data to analyze
          </div>
        ) : (
          <div className="space-y-3">
            {categoryData.map((item) => {
              const maxVal = categoryData[0].value;
              const pct = (item.value / maxVal) * 100;
              const totalPct = ((item.value / totalExpenses) * 100).toFixed(1);
              return (
                <div key={item.name} className="flex items-center gap-4">
                  <div className="w-32 flex-shrink-0 text-xs font-medium text-slate-600 dark:text-gray-300 truncate">
                    {item.name}
                  </div>
                  <div className="flex-1 h-7 bg-slate-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
                    <div
                      className="h-full rounded-lg transition-all duration-700 flex items-center px-3"
                      style={{
                        width: `${pct}%`,
                        background: CATEGORY_COLORS[item.name] || "#8b5cf6",
                      }}
                    >
                      {pct > 30 && (
                        <span className="text-white text-xs font-semibold">
                          {fmtFull(item.value)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-20 text-right flex-shrink-0">
                    <span className="text-xs font-bold text-slate-700 dark:text-gray-200">
                      {fmtFull(item.value)}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-gray-500 ml-1">
                      ({totalPct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Observations */}
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-2xl border border-violet-100 dark:border-violet-900/40 p-5">
        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
          💡 Key Observations
        </h3>
        <ul className="space-y-2.5">
          {[
            `Your top spending category is <strong>${highestCategory.name}</strong>, accounting for ${totalExpenses > 0 ? ((highestCategory.value / totalExpenses) * 100).toFixed(1) : 0}% of total expenses.`,
            `Your overall savings rate is <strong>${savingsRate}%</strong>${savingsRate >= 20 ? " — excellent financial discipline!" : " — financial experts recommend saving at least 20%."}`,
            `<strong>${bestMonth?.month}</strong> was your best month with a net balance of ${fmtFull(bestMonth?.balance || 0)}.`,
            `<strong>${worstMonth?.month}</strong> had the highest expenses at ${fmtFull(worstMonth?.expenses || 0)}, ${worstMonth && avgMonthlyExpense > 0 ? `which is ${((worstMonth.expenses / avgMonthlyExpense - 1) * 100).toFixed(0)}% above average.` : ""}`,
            `You have a total of <strong>${state.transactions.length} transactions</strong> across ${new Set(state.transactions.map((t) => t.category)).size} different categories.`,
          ].map((obs, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-gray-300"
            >
              <span className="mt-0.5 text-violet-500 flex-shrink-0">→</span>
              <span dangerouslySetInnerHTML={{ __html: obs }} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

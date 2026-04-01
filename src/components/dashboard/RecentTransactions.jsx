import { useFinance } from "../../context/FinanceContext";
import { CATEGORY_COLORS } from "../../data/mockData";

export default function RecentTransactions() {
  const { state } = useFinance();
  const recent = [...state.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            Recent Transactions
          </h3>
          <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">
            Latest 5 activities
          </p>
        </div>
      </div>

      {recent.length === 0 ? (
        <div className="text-center py-8 text-slate-400 dark:text-gray-500 text-sm">
          No transactions yet
        </div>
      ) : (
        <div className="space-y-3">
          {recent.map((txn) => (
            <div
              key={txn.id}
              className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-gray-800 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm"
                  style={{
                    background:
                      (CATEGORY_COLORS[txn.category] || "#8b5cf6") + "22",
                  }}
                >
                  <span
                    style={{
                      color: CATEGORY_COLORS[txn.category] || "#8b5cf6",
                    }}
                  >
                    {txn.type === "income" ? "⬆" : "⬇"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-gray-200">
                    {txn.description}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-gray-500">
                    {txn.category} ·{" "}
                    {new Date(txn.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>
              <span
                className={`text-sm font-bold ${txn.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
              >
                {txn.type === "income" ? "+" : "-"}₹
                {txn.amount.toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

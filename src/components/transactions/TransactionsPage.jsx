import { useState } from "react";
import { useFinance } from "../../context/FinanceContext";
import { CATEGORIES, CATEGORY_COLORS } from "../../data/mockData";
import TransactionModal from "./TransactionModal";

export default function TransactionsPage() {
  const { state, dispatch, getFilteredTransactions } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [editTxn, setEditTxn] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const isAdmin = state.role === "admin";
  const transactions = getFilteredTransactions();

  const handleSort = (field) => {
    if (state.sortBy === field) {
      dispatch({
        type: "SET_SORT",
        payload: {
          sortBy: field,
          sortOrder: state.sortOrder === "desc" ? "asc" : "desc",
        },
      });
    } else {
      dispatch({
        type: "SET_SORT",
        payload: { sortBy: field, sortOrder: "desc" },
      });
    }
  };

  const exportCSV = () => {
    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const rows = transactions.map((t) => [
      t.date,
      t.description,
      t.category,
      t.type,
      t.amount,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  };

  const SortIcon = ({ field }) => {
    if (state.sortBy !== field)
      return <span className="text-slate-300 dark:text-gray-600 ml-1">↕</span>;
    return (
      <span className="text-violet-500 ml-1">
        {state.sortOrder === "desc" ? "↓" : "↑"}
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Transactions
          </h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
            {transactions.length} transaction
            {transactions.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-gray-700 text-sm font-medium text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 transition flex items-center gap-2"
          >
            📥 Export CSV
          </button>
          {isAdmin && (
            <button
              onClick={() => {
                setEditTxn(null);
                setShowModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-sm font-semibold text-white transition shadow-sm flex items-center gap-2"
            >
              + Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              🔍
            </span>
            <input
              value={state.filters.search}
              onChange={(e) =>
                dispatch({
                  type: "SET_FILTER",
                  payload: { search: e.target.value },
                })
              }
              placeholder="Search transactions..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-sm text-slate-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            />
          </div>

          <select
            value={state.filters.type}
            onChange={(e) =>
              dispatch({
                type: "SET_FILTER",
                payload: { type: e.target.value },
              })
            }
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-sm text-slate-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={state.filters.category}
            onChange={(e) =>
              dispatch({
                type: "SET_FILTER",
                payload: { category: e.target.value },
              })
            }
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-sm text-slate-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {(state.filters.search ||
            state.filters.type !== "all" ||
            state.filters.category !== "all") && (
            <button
              onClick={() =>
                dispatch({
                  type: "SET_FILTER",
                  payload: { search: "", type: "all", category: "all" },
                })
              }
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 text-sm text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 transition whitespace-nowrap"
            >
              Clear ✕
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden">
        {transactions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-slate-500 dark:text-gray-400 font-medium">
              No transactions found
            </p>
            <p className="text-slate-400 dark:text-gray-500 text-sm mt-1">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-gray-800">
                  <th
                    className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-violet-600 transition"
                    onClick={() => handleSort("date")}
                  >
                    Date <SortIcon field="date" />
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Category
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Type
                  </th>
                  <th
                    className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-violet-600 transition"
                    onClick={() => handleSort("amount")}
                  >
                    Amount <SortIcon field="amount" />
                  </th>
                  {isAdmin && (
                    <th className="text-center px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-gray-800">
                {transactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-gray-800/30 transition-colors group"
                  >
                    <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(txn.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs flex-shrink-0"
                          style={{
                            background:
                              (CATEGORY_COLORS[txn.category] || "#8b5cf6") +
                              "22",
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
                        <span className="text-sm font-medium text-slate-700 dark:text-gray-200">
                          {txn.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{
                          background:
                            (CATEGORY_COLORS[txn.category] || "#8b5cf6") + "22",
                          color: CATEGORY_COLORS[txn.category] || "#8b5cf6",
                        }}
                      >
                        {txn.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize
                        ${
                          txn.type === "income"
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                            : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"
                        }`}
                      >
                        {txn.type}
                      </span>
                    </td>
                    <td
                      className={`px-5 py-3.5 text-right text-sm font-bold whitespace-nowrap
                      ${txn.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
                    >
                      {txn.type === "income" ? "+" : "-"}₹
                      {txn.amount.toLocaleString("en-IN")}
                    </td>
                    {isAdmin && (
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditTxn(txn);
                              setShowModal(true);
                            }}
                            className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-900/50 transition flex items-center justify-center text-xs"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(txn.id)}
                            className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/50 transition flex items-center justify-center text-xs"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-gray-800">
            <p className="text-4xl text-center mb-3">🗑️</p>
            <h3 className="text-base font-bold text-slate-800 dark:text-white text-center mb-2">
              Delete Transaction?
            </h3>
            <p className="text-sm text-slate-500 dark:text-gray-400 text-center mb-5">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 text-sm font-semibold text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  dispatch({
                    type: "DELETE_TRANSACTION",
                    payload: deleteConfirm,
                  });
                  setDeleteConfirm(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <TransactionModal
          transaction={editTxn}
          onClose={() => {
            setShowModal(false);
            setEditTxn(null);
          }}
        />
      )}
    </div>
  );
}

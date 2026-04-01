import { useState, useEffect } from "react";
import { useFinance } from "../../context/FinanceContext";
import { CATEGORIES } from "../../data/mockData";

export default function TransactionModal({ transaction, onClose }) {
  const { dispatch } = useFinance();
  const isEdit = !!transaction;

  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: CATEGORIES[0],
    type: "expense",
    date: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transaction)
      setForm({ ...transaction, amount: String(transaction.amount) });
  }, [transaction]);

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0)
      e.amount = "Enter a valid amount";
    if (!form.date) e.date = "Date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = {
      ...form,
      amount: parseFloat(form.amount),
      id: isEdit ? transaction.id : `t${Date.now()}`,
    };
    dispatch({
      type: isEdit ? "EDIT_TRANSACTION" : "ADD_TRANSACTION",
      payload,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-gray-800 animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-gray-800">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            {isEdit ? "Edit Transaction" : "Add Transaction"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 flex items-center justify-center text-slate-400 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Type Toggle */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
              Type
            </label>
            <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-gray-700">
              {["expense", "income"].map((t) => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, type: t })}
                  className={`flex-1 py-2.5 text-sm font-semibold capitalize transition-all
                    ${
                      form.type === t
                        ? t === "income"
                          ? "bg-emerald-500 text-white"
                          : "bg-rose-500 text-white"
                        : "text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800"
                    }`}
                >
                  {t === "income" ? "⬆ Income" : "⬇ Expense"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
              Description
            </label>
            <input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="e.g., Monthly Salary"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-slate-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            />
            {errors.description && (
              <p className="text-xs text-rose-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
                Amount (₹)
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-slate-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              />
              {errors.amount && (
                <p className="text-xs text-rose-500 mt-1">{errors.amount}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-slate-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              />
              {errors.date && (
                <p className="text-xs text-rose-500 mt-1">{errors.date}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-slate-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-slate-100 dark:border-gray-800">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 text-sm font-semibold text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition shadow-sm"
          >
            {isEdit ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}

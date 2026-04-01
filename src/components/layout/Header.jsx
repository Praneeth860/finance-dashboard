import { useFinance } from "../../context/FinanceContext";

export default function Header({ toggleSidebar }) {
  const { state } = useFinance();

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-slate-200 dark:border-gray-800 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-600 dark:text-gray-400 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div>
            <p className="text-xs text-slate-400 dark:text-gray-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold
            ${
              state.role === "admin"
                ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400"
                : "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-400"
            }`}
          >
            <span>{state.role === "admin" ? "👑" : "👁️"}</span>
            <span className="capitalize">{state.role}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {state.role === "admin" ? "A" : "V"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

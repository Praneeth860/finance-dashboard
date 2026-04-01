import { useFinance } from "../../context/FinanceContext";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "⬛" },
  { id: "transactions", label: "Transactions", icon: "↕️" },
  { id: "insights", label: "Insights", icon: "💡" },
];

export default function Sidebar({
  activePage,
  setActivePage,
  isOpen,
  setIsOpen,
}) {
  const { state, dispatch } = useFinance();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 z-30 transform transition-transform duration-300
          bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800 flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-slate-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">₹</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800 dark:text-white tracking-tight">
                FinanceIQ
              </h1>
              <p className="text-xs text-slate-400 dark:text-gray-500">
                Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="px-4 py-4 border-b border-slate-100 dark:border-gray-800">
          <p className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-2">
            Role
          </p>
          <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-gray-700">
            {["admin", "viewer"].map((role) => (
              <button
                key={role}
                onClick={() => dispatch({ type: "SET_ROLE", payload: role })}
                className={`flex-1 py-2 text-xs font-semibold capitalize transition-all
                  ${
                    state.role === role
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800"
                  }`}
              >
                {role === "admin" ? "👑" : "👁️"} {role}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 dark:text-gray-600 mt-2">
            {state.role === "admin"
              ? "Can add & edit transactions"
              : "View only mode"}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${
                  activePage === item.id
                    ? "bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 shadow-sm"
                    : "text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800/60"
                }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
              {activePage === item.id && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500" />
              )}
            </button>
          ))}
        </nav>

        {/* Dark mode */}
        <div className="px-4 py-4 border-t border-slate-100 dark:border-gray-800">
          <button
            onClick={() => dispatch({ type: "TOGGLE_DARK_MODE" })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
              text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 transition-all"
          >
            <span>{state.darkMode ? "☀️" : "🌙"}</span>
            {state.darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </aside>
    </>
  );
}

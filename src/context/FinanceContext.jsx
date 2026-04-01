import { createContext, useContext, useReducer, useEffect } from "react";
import { generateTransactions } from "../data/mockData";

const FinanceContext = createContext();

const STORAGE_KEY = "finance_dashboard_data";

const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const saveToStorage = (state) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ transactions: state.transactions, role: state.role }),
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};

const initialState = {
  transactions: generateTransactions(),
  role: "admin",
  filters: { type: "all", category: "all", search: "" },
  sortBy: "date",
  sortOrder: "desc",
  darkMode: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_ROLE":
      return { ...state, role: action.payload };
    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "SET_SORT":
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder,
      };
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case "EDIT_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case "TOGGLE_DARK_MODE":
      return { ...state, darkMode: !state.darkMode };
    case "LOAD_FROM_STORAGE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const stored = loadFromStorage();
    if (stored) return { ...init, ...stored };
    return init;
  });

  useEffect(() => {
    saveToStorage(state);
  }, [state.transactions, state.role]);

  const getFilteredTransactions = () => {
    let result = [...state.transactions];
    if (state.filters.type !== "all")
      result = result.filter((t) => t.type === state.filters.type);
    if (state.filters.category !== "all")
      result = result.filter((t) => t.category === state.filters.category);
    if (state.filters.search)
      result = result.filter(
        (t) =>
          t.description
            .toLowerCase()
            .includes(state.filters.search.toLowerCase()) ||
          t.category.toLowerCase().includes(state.filters.search.toLowerCase()),
      );
    result.sort((a, b) => {
      if (state.sortBy === "date") {
        return state.sortOrder === "desc"
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date);
      }
      if (state.sortBy === "amount") {
        return state.sortOrder === "desc"
          ? b.amount - a.amount
          : a.amount - b.amount;
      }
      return 0;
    });
    return result;
  };

  const getSummary = () => {
    const income = state.transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expenses = state.transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  };

  const getMonthlyData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const monthNums = ["01", "02", "03", "04", "05", "06"];
    return months.map((month, i) => {
      const monthTxns = state.transactions.filter((t) =>
        t.date.includes(`2024-${monthNums[i]}`),
      );
      const income = monthTxns
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0);
      const expenses = monthTxns
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0);
      return { month, income, expenses, balance: income - expenses };
    });
  };

  const getCategoryData = () => {
    const expenseTxns = state.transactions.filter((t) => t.type === "expense");
    const catMap = {};
    expenseTxns.forEach((t) => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });
    return Object.entries(catMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  return (
    <FinanceContext.Provider
      value={{
        state,
        dispatch,
        getFilteredTransactions,
        getSummary,
        getMonthlyData,
        getCategoryData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => useContext(FinanceContext);

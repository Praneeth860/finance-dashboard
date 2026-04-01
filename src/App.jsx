import { useState } from "react";
import { FinanceProvider, useFinance } from "./context/FinanceContext";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import DashboardPage from "./components/dashboard/DashboardPage";
import TransactionsPage from "./components/transactions/TransactionsPage";
import InsightsPage from "./components/insights/InsightsPage";

function AppContent() {
  const { state } = useFinance();
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pages = {
    dashboard: DashboardPage,
    transactions: TransactionsPage,
    insights: InsightsPage,
  };
  const ActivePage = pages[activePage];

  return (
    <div className={state.darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300 font-sans">
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
        <div className="lg:ml-64 flex flex-col min-h-screen">
          <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <ActivePage />
          </main>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

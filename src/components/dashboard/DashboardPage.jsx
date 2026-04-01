import { useFinance } from "../../context/FinanceContext";
import SummaryCard from "./SummaryCard";
import BalanceTrendChart from "./BalanceTrendChart";
import SpendingPieChart from "./SpendingPieChart";
import RecentTransactions from "./RecentTransactions";

export default function DashboardPage() {
  const { getSummary, getMonthlyData, getCategoryData, state } = useFinance();
  const summary = getSummary();
  const monthlyData = getMonthlyData();
  const categoryData = getCategoryData();

  const cards = [
    {
      label: "Total Balance",
      value: summary.balance,
      icon: "💰",
      color: "violet",
      trend: "+12.5%",
      trendUp: true,
      desc: "vs last period",
    },
    {
      label: "Total Income",
      value: summary.income,
      icon: "📈",
      color: "emerald",
      trend: "+8.2%",
      trendUp: true,
      desc: "vs last period",
    },
    {
      label: "Total Expenses",
      value: summary.expenses,
      icon: "📉",
      color: "rose",
      trend: "+3.1%",
      trendUp: false,
      desc: "vs last period",
    },
    {
      label: "Savings Rate",
      value:
        summary.income > 0
          ? `${Math.round((summary.balance / summary.income) * 100)}%`
          : "0%",
      icon: "🎯",
      color: "sky",
      trend: "Good",
      trendUp: true,
      desc: "of income saved",
      isPercent: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          Financial Overview
        </h2>
        <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">
          Your financial summary for Jan – Jun 2024
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <BalanceTrendChart data={monthlyData} />
        </div>
        <div>
          <SpendingPieChart data={categoryData} />
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
}

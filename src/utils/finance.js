import { CHALLENGE_DAYS, STARTING_BUDGET } from "../data/initialData.js";

export function safeAmount(value) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? amount : 0;
}

export function formatMoney(value) {
  const amount = Number.isFinite(Number(value)) ? Number(value) : 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0
  }).format(amount);
}

export function calculateFinance({
  transactions, income = 0, emergency = 0, commitments = 1500,
  subscriptions = [], day = 5, goal = 2000, saved = 600
}) {
  const validTransactions = transactions.filter(t =>
    t && typeof t.title === "string" && t.title.trim() &&
    Number.isFinite(Number(t.amount)) && Number(t.amount) > 0
  );
  const spent = validTransactions.reduce((sum, t) => sum + safeAmount(t.amount), 0);
  const extraIncome = safeAmount(income);
  const emergencyCost = safeAmount(emergency);
  const balance = STARTING_BUDGET + extraIncome - spent - emergencyCost;
  const activeSubscriptions = subscriptions.filter(s => s.active);
  const recurring = activeSubscriptions.reduce((sum, s) => sum + safeAmount(s.amount), 0);
  const reserved = safeAmount(commitments) + recurring;
  const daysLeft = Math.max(1, CHALLENGE_DAYS - Math.min(CHALLENGE_DAYS, Math.max(1, Number(day) || 1)) + 1);
  const flexibleMoney = Math.max(0, balance - reserved);
  const dailyAllowance = flexibleMoney / daysLeft;
  const safeBalance = Math.max(0, balance);
  const forecast = balance - (spent / Math.max(1, Number(day) || 1)) *
    Math.max(0, CHALLENGE_DAYS - Math.max(1, Number(day) || 1)) - recurring;
  const risk = balance < 2000 || dailyAllowance < 100 ? "High"
    : balance < 4000 || dailyAllowance < 180 ? "Watch" : "Low";
  const health = Math.max(0, Math.min(100, Math.round(
    (Math.max(0, balance) / STARTING_BUDGET) * 65 +
    (Math.min(dailyAllowance, 333) / 333) * 35
  )));
  const goalTarget = Math.max(1, safeAmount(goal));
  const savingsProgress = Math.min(100, Math.round(safeAmount(saved) / goalTarget * 100));
  return {
    spent, income: extraIncome, emergency: emergencyCost, balance, recurring,
    reserved, flexibleMoney, dailyAllowance, daysLeft, forecast, risk, health,
    safeBalance, savingsProgress, goalTarget, validTransactionCount: validTransactions.length
  };
}

export function simulatePurchase(finance, amount) {
  const purchase = safeAmount(amount);
  const balanceAfter = finance.balance - purchase;
  const flexibleAfter = Math.max(0, balanceAfter - finance.reserved);
  const dailyAfter = flexibleAfter / finance.daysLeft;
  const riskAfter = balanceAfter < 2000 || dailyAfter < 100 ? "High"
    : balanceAfter < 4000 || dailyAfter < 180 ? "Watch" : "Low";
  const healthAfter = Math.max(0, Math.min(100, Math.round(
    (Math.max(0, balanceAfter) / STARTING_BUDGET) * 65 +
    (Math.min(dailyAfter, 333) / 333) * 35
  )));
  return { purchase, balanceAfter, flexibleAfter, dailyAfter, riskAfter, healthAfter,
    affordable: purchase <= finance.balance && balanceAfter >= finance.reserved };
}

export function validateTransaction({ title, amount }) {
  const cleanedTitle = String(title ?? "").trim().replace(/\s+/g, " ");
  const parsedAmount = Number(amount);
  if (!cleanedTitle) return { valid: false, error: "Enter a transaction name." };
  if (cleanedTitle.length > 70) return { valid: false, error: "Use 70 characters or fewer." };
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return { valid: false, error: "Enter an amount greater than ₹0." };
  if (parsedAmount > 10000000) return { valid: false, error: "Enter a realistic amount below ₹1 crore." };
  return { valid: true, title: cleanedTitle, amount: Math.round(parsedAmount * 100) / 100 };
}
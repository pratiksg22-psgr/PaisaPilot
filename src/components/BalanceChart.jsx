import React, { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHALLENGE_DAYS, STARTING_BUDGET } from "../data/initialData.js";
import { formatMoney, safeAmount } from "../utils/finance.js";

export default function BalanceChart({ transactions, income, emergency, day }) {
  const data = useMemo(() => {
    const spentPerDay = Array(CHALLENGE_DAYS).fill(0);
    transactions.forEach(t => { const index = Math.max(0, Math.min(CHALLENGE_DAYS - 1, Number(t.day) - 1)); spentPerDay[index] += safeAmount(t.amount); });
    let balance = STARTING_BUDGET + safeAmount(income);
    return spentPerDay.map((amount, index) => {
      balance -= amount;
      if (index === Math.min(CHALLENGE_DAYS - 1, Math.max(0, day - 1))) balance -= safeAmount(emergency);
      return { label: `Day ${index + 1}`, balance: Math.round(balance) };
    });
  }, [transactions, income, emergency, day]);
  return (
    <div className="chart-wrap" role="img" aria-label="Line chart forecasting your remaining balance for each day of the month">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs><linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9b8cff" stopOpacity={0.28}/><stop offset="100%" stopColor="#9b8cff" stopOpacity={0.02}/></linearGradient></defs>
          <CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#29313f"/>
          <XAxis dataKey="label" tick={{ fill: "#8993a4", fontSize: 10 }} tickLine={false} axisLine={false} interval={4}/>
          <YAxis tick={{ fill: "#8993a4", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `₹${Math.round(v / 1000)}k`}/>
          <Tooltip contentStyle={{ background: "#171e2a", border: "1px solid #30394a", borderRadius: 10 }} formatter={v => [formatMoney(v), "Balance"]}/>
          <Area type="monotone" dataKey="balance" stroke="#9b8cff" strokeWidth={2.5} fill="url(#balanceFill)"/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
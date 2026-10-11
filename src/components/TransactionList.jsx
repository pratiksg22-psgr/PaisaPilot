import React from "react";
import { Trash2 } from "lucide-react";
import { formatMoney } from "../utils/finance.js";

const emoji = { Food: "🍜", Transport: "🛺", Lifestyle: "🛍️", Bills: "📱", Other: "🧾" };

export default function TransactionList({ transactions, onDelete, showDelete = false }) {
  if (!transactions.length) return <p className="empty-state">No transactions yet. Add your first expense to get started.</p>;
  return (
    <div className="transaction-list">
      {[...transactions].reverse().map(item => (
        <div className="transaction-row" key={item.id}>
          <div className="transaction-emoji" aria-hidden="true">{emoji[item.category] || "🧾"}</div>
          <div className="transaction-info">
            <strong>{item.title}</strong>
            <span>{item.category} · Day {item.day}</span>
          </div>
          <strong className="transaction-amount">−{formatMoney(item.amount)}</strong>
          {showDelete && <button className="icon-button delete-button" type="button"
            onClick={() => onDelete(item.id)} aria-label={`Delete ${item.title}`}><Trash2 size={15}/></button>}
        </div>
      ))}
    </div>
  );
}
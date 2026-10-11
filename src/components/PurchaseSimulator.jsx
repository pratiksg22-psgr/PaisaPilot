import React, { useMemo, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { formatMoney, safeAmount, simulatePurchase } from "../utils/finance.js";

export default function PurchaseSimulator({ finance, onCommit }) {
  const [name, setName] = useState("New headphones");
  const [amount, setAmount] = useState("2000");
  const simulation = useMemo(() => simulatePurchase(finance, amount), [finance, amount]);
  return (
    <section className="panel simulator-panel" aria-labelledby="sim-title">
      <div className="panel-heading"><div><div className="eyebrow purple-eyebrow"><Sparkles size={13}/> TRY BEFORE YOU BUY</div><h2 id="sim-title">Can I afford it?</h2><p>See the impact before you commit.</p></div></div>
      <label htmlFor="purchase-name">What are you considering?</label>
      <input id="purchase-name" value={name} maxLength={70} onChange={e => setName(e.target.value)} />
      <label htmlFor="purchase-amount">Purchase amount (₹)</label>
      <input id="purchase-amount" type="number" min="0" max="10000000" step="1" value={amount} onChange={e => setAmount(e.target.value)} />
      <div className="simulation-results" aria-live="polite">
        <div><span>Balance after purchase</span><strong className={simulation.balanceAfter < 0 ? "danger" : ""}>{formatMoney(simulation.balanceAfter)}</strong></div>
        <div><span>New daily allowance</span><strong>{formatMoney(simulation.dailyAfter)}</strong></div>
        <div><span>Financial health</span><strong>{simulation.healthAfter}/100</strong></div>
        <div><span>Risk after purchase</span><strong className={`risk-text ${simulation.riskAfter.toLowerCase()}`}>{simulation.riskAfter}</strong></div>
      </div>
      <button className="primary-button full-button" disabled={!name.trim() || safeAmount(amount) <= 0 || !simulation.affordable}
        onClick={() => onCommit({ title: name.trim(), amount: safeAmount(amount), category: "Lifestyle" })}>
        <Check size={16}/> Record this decision
      </button>
      {!simulation.affordable && safeAmount(amount) > 0 && <p className="form-hint" role="status">This purchase would use money reserved for commitments or exceed your current balance. Reduce the amount or postpone it.</p>}
    </section>
  );
}
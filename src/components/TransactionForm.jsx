import React, { useState } from "react";
import { categories } from "../data/initialData.js";
import { validateTransaction } from "../utils/finance.js";

export default function TransactionForm({ onAdd, onClose, day }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    const result = validateTransaction({ title, amount });
    if (!result.valid) { setError(result.error); return; }
    onAdd({ id: crypto.randomUUID(), title: result.title, amount: result.amount, category, day });
    onClose();
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="transaction-title">
        <div className="modal-heading"><div><span className="eyebrow">TRACK YOUR SPENDING</span><h2 id="transaction-title">Add transaction</h2></div>
          <button className="icon-button" onClick={onClose} type="button" aria-label="Close transaction form">×</button>
        </div>
        <form onSubmit={submit} noValidate>
          <label htmlFor="expense-title">Description</label>
          <input id="expense-title" value={title} onChange={e => setTitle(e.target.value)} maxLength={70} autoFocus required placeholder="e.g. Lunch"/>
          <label htmlFor="expense-amount">Amount (₹)</label>
          <input id="expense-amount" type="number" min="0.01" max="10000000" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="0"/>
          <label htmlFor="expense-category">Category</label>
          <select id="expense-category" value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button full-button" type="submit">Save transaction</button>
        </form>
      </section>
    </div>
  );
}
import React, { useMemo, useState } from "react";
import { Activity, ArrowUpRight, Bell, CalendarDays, CreditCard, Gauge, Home, Plus, ReceiptText, Target, Wallet, Download, Sparkles, Lightbulb } from "lucide-react";
import { CHALLENGE_DAYS, STARTING_BUDGET, initialSubscriptions, initialTransactions } from "./data/initialData.js";
import { calculateFinance, formatMoney, safeAmount } from "./utils/finance.js";
import MetricCard from "./components/MetricCard.jsx";
import TransactionList from "./components/TransactionList.jsx";
import TransactionForm from "./components/TransactionForm.jsx";
import PurchaseSimulator from "./components/PurchaseSimulator.jsx";
import BalanceChart from "./components/BalanceChart.jsx";
import "./styles/app.css";

const navItems = [{ label: "Overview", icon: Home }, { label: "Transactions", icon: ReceiptText }, { label: "Plan & goals", icon: Target }, { label: "Subscriptions", icon: CreditCard }];

export default function App() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [income, setIncome] = useState(0);
  const [emergency, setEmergency] = useState(0);
  const [day, setDay] = useState(5);
  const [commitments, setCommitments] = useState(1500);
  const [goal, setGoal] = useState(2000);
  const [saved, setSaved] = useState(600);
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [active, setActive] = useState("Overview");
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");

  const finance = useMemo(() => calculateFinance({
    transactions, income, emergency, commitments, subscriptions, day, goal, saved
  }), [transactions, income, emergency, commitments, subscriptions, day, goal, saved]);

  function addTransaction(item) {
    setTransactions(current => [...current, item]);
    setNotice("Transaction added and budget recalculated.");
  }
  function recordPurchase(item) {
    addTransaction({ ...item, id: crypto.randomUUID(), day: Math.min(CHALLENGE_DAYS, day + 1) });
    setNotice("Purchase recorded. Your budget has been recalculated.");
  }
  function exportCsv() {
    const rows = [["Description", "Category", "Amount INR", "Day"], ...transactions.map(t => [t.title, t.category, t.amount, t.day])];
    const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a"); link.href = url; link.download = "paisapilot-transactions.csv"; link.click(); URL.revokeObjectURL(url);
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#overview" onClick={e => { e.preventDefault(); setActive("Overview"); }}><span className="brand-mark"><Wallet size={21}/></span><span>Paisa<span className="brand-light">Pilot</span></span></a>
      <p className="sidebar-label">YOUR MONEY SPACE</p>
      <nav aria-label="Main navigation">{navItems.map(item => <button key={item.label} className={`nav-link ${active === item.label ? "selected" : ""}`} aria-current={active === item.label ? "page" : undefined} onClick={() => setActive(item.label)}><item.icon size={18}/><span>{item.label}</span></button>)}</nav>
      <div className="sidebar-tip"><Sparkles size={18}/><strong>Small choices add up.</strong><p>Plan a little today to give future-you more freedom.</p></div>
      <div className="sidebar-profile"><span className="avatar">Y</span><span><b>Your space</b><small>Demo profile</small></span></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="breadcrumb">Personal finance <span>/</span> <strong>{active}</strong></div><div className="top-actions"><label className="day-control">Challenge day <select aria-label="Current challenge day" value={day} onChange={e => setDay(Number(e.target.value))}>{Array.from({length:CHALLENGE_DAYS},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}</select></label><button className="icon-button" onClick={()=>setNotice("You are all caught up.")} aria-label="Notifications"><Bell size={17}/></button></div></header>
      {notice && <div className="notice" role="status">{notice}<button onClick={()=>setNotice("")} aria-label="Dismiss message">×</button></div>}
      {active === "Overview" && <>
        <section className="welcome-row"><div><p className="eyebrow">YOUR 30-DAY CHALLENGE</p><h1>Make your money <span>make sense.</span></h1><p className="muted">A little clarity today. A lot less stress tomorrow.</p></div><button className="primary-button" onClick={()=>setShowForm(true)}><Plus size={16}/> Add transaction</button></section>
        <section className="hero-card" aria-labelledby="balance-title"><div className="hero-main"><p className="hero-label" id="balance-title"><Wallet size={16}/> MONEY LEFT TO LIVE ON</p><p className="hero-balance">{formatMoney(finance.balance)}</p><p className="hero-sub">{formatMoney(STARTING_BUDGET)} starting budget {finance.income ? `+ ${formatMoney(finance.income)} extra income` : ""}</p><div className="progress-track" role="progressbar" aria-label="Remaining starting budget" aria-valuemin="0" aria-valuemax={STARTING_BUDGET} aria-valuenow={Math.max(0,Math.min(STARTING_BUDGET,finance.balance))}><span style={{width:`${Math.max(0,Math.min(100,finance.balance/STARTING_BUDGET*100))}%`}}/></div><div className="progress-labels"><span>Balance remaining</span><span>{Math.round(finance.balance/STARTING_BUDGET*100)}%</span></div></div><div className="hero-side"><p className="hero-label">SAFE DAILY ALLOWANCE</p><p className="daily-value">{formatMoney(finance.dailyAllowance)} <small>/ day</small></p><p className="muted">After commitments and active subscriptions across {finance.daysLeft} days.</p><span className={`risk-pill ${finance.risk.toLowerCase()}`}><i/> {finance.risk} financial risk</span></div></section>
        <section className="metric-grid" aria-label="Financial summary">
          <MetricCard icon={Activity} label="Total spent" value={formatMoney(finance.spent+finance.emergency)} note={`${transactions.length} transactions`} tone="purple"/>
          <MetricCard icon={Target} label="Savings progress" value={`${finance.savingsProgress}%`} note={`${formatMoney(saved)} of ${formatMoney(goal)}`} tone="green"/>
          <MetricCard icon={CalendarDays} label="Days remaining" value={`${finance.daysLeft} days`} note={`Day ${day} of ${CHALLENGE_DAYS}`} tone="blue"/>
          <MetricCard icon={Gauge} label="Financial health" value={`${finance.health}/100`} note="Illustrative planning score" tone="orange"/>
        </section>
        <section className="content-grid"><article className="panel forecast-panel"><div className="panel-heading"><div><h2>Month-end forecast</h2><p>Estimated balance across your 30-day challenge</p></div><span className="small-badge">30-day view</span></div><div className="forecast-summary"><span>Current estimated balance</span><strong>{formatMoney(finance.balance)}</strong></div><BalanceChart transactions={transactions} income={income} emergency={emergency} day={day}/><div className="insight"><Lightbulb size={16}/><span>{finance.risk==="High"?"Your budget is under pressure. Review optional spending and protect essential commitments.":finance.risk==="Watch"?"Keep an eye on optional purchases to protect your remaining budget.":"Your budget has some breathing room. Keep checking before larger purchases."}</span></div></article>
          <article className="panel plan-panel"><div className="panel-heading"><div><h2>Plan your money</h2><p>Connect income, commitments and savings.</p></div></div><label htmlFor="income-input">Additional income (₹)</label><input id="income-input" type="number" min="0" max="10000000" value={income} onChange={e=>setIncome(safeAmount(e.target.value))}/><label htmlFor="commitment-input">Bills & essentials to reserve (₹)</label><input id="commitment-input" type="number" min="0" max="10000000" value={commitments} onChange={e=>setCommitments(safeAmount(e.target.value))}/><label htmlFor="emergency-input">Unexpected expense (₹)</label><input id="emergency-input" type="number" min="0" max="10000000" value={emergency} onChange={e=>setEmergency(safeAmount(e.target.value))}/><label htmlFor="goal-input">Savings target (₹)</label><input id="goal-input" type="number" min="1" max="10000000" value={goal} onChange={e=>setGoal(Math.max(1,safeAmount(e.target.value)))}/><label htmlFor="saved-input">Already saved (₹)</label><input id="saved-input" type="number" min="0" max="10000000" value={saved} onChange={e=>setSaved(safeAmount(e.target.value))}/><div className="reserve-summary"><span>Flexible money after reserves</span><strong>{formatMoney(finance.flexibleMoney)}</strong></div></article></section>
        <section className="bottom-grid"><article className="panel"><div className="panel-heading"><div><h2>Recent transactions</h2><p>Track what leaves your wallet</p></div><button className="text-button" onClick={()=>setActive("Transactions")}>See all <ArrowUpRight size={14}/></button></div><TransactionList transactions={transactions.slice(-4)} /></article><PurchaseSimulator finance={finance} onCommit={recordPurchase}/></section>
      </>}
      {active === "Transactions" && <section className="page-section"><div className="page-title-row"><div><p className="eyebrow">YOUR MONEY IN MOTION</p><h1>Transactions</h1><p className="muted">Review expenses and export your records.</p></div><div className="button-row"><button className="secondary-button" onClick={exportCsv}><Download size={15}/> Export CSV</button><button className="primary-button" onClick={()=>setShowForm(true)}><Plus size={15}/> Add transaction</button></div></div><div className="metric-grid two-metrics"><MetricCard icon={Wallet} label="Current balance" value={formatMoney(finance.balance)} note="After recorded spending" tone="green"/><MetricCard icon={Activity} label="Total expenses" value={formatMoney(finance.spent)} note={`${transactions.length} records`} tone="purple"/></div><article className="panel"><TransactionList transactions={transactions} showDelete onDelete={id=>{setTransactions(current=>current.filter(t=>t.id!==id));setNotice("Transaction deleted and budget recalculated.");}}/></article></section>}
      {active === "Plan & goals" && <section className="page-section"><p className="eyebrow">BUILD A LITTLE BUFFER</p><h1>Plan & goals</h1><div className="content-grid"><article className="panel"><h2>Savings goal</h2><p className="muted">Your goal, your pace.</p><div className="goal-number">{formatMoney(saved)} <small>saved</small></div><div className="progress-track"><span style={{width:`${finance.savingsProgress}%`}}/></div><p className="muted">{finance.savingsProgress}% of {formatMoney(goal)} target</p><label htmlFor="goal-input-page">Target amount (₹)</label><input id="goal-input-page" type="number" min="1" value={goal} onChange={e=>setGoal(Math.max(1,safeAmount(e.target.value)))}/><label htmlFor="saved-input-page">Already saved (₹)</label><input id="saved-input-page" type="number" min="0" value={saved} onChange={e=>setSaved(safeAmount(e.target.value))}/></article><article className="panel"><h2>Commitments & reserves</h2><p className="muted">Reserve essential costs before deciding what is safe to spend.</p><div className="reserve-line"><span>Current balance</span><b>{formatMoney(finance.balance)}</b></div><div className="reserve-line"><span>Bills and essentials</span><b>−{formatMoney(commitments)}</b></div><div className="reserve-line"><span>Active subscriptions</span><b>−{formatMoney(finance.recurring)}</b></div><div className="reserve-line total"><span>Flexible money</span><b>{formatMoney(finance.flexibleMoney)}</b></div></article></div></section>}
      {active === "Subscriptions" && <section className="page-section"><p className="eyebrow">RECURRING DOESN'T MEAN INVISIBLE</p><h1>Subscriptions</h1><p className="muted">Toggle recurring charges to see the impact on your safe allowance.</p><article className="panel subscription-panel">{subscriptions.map(s=><div className="subscription-row" key={s.id}><div className="subscription-icon">{s.id==="music"?"🎧":s.id==="cloud"?"☁️":"🎬"}</div><div className="subscription-name"><strong>{s.name}</strong><small>Monthly · due day {s.dueDay}</small></div><strong>{formatMoney(s.amount)}</strong><label className="switch"><input type="checkbox" checked={s.active} onChange={()=>setSubscriptions(current=>current.map(item=>item.id===s.id?{...item,active:!item.active}:item))} aria-label={`${s.active?"Disable":"Enable"} ${s.name}`}/><span/></label></div>)}<div className="reserve-summary"><span>Active monthly subscriptions</span><strong>{formatMoney(finance.recurring)}</strong></div><p className="muted">Changes are reflected in your reserved money and daily allowance.</p></article></section>}
      <footer className="footer"><strong>PaisaPilot</strong><span>Demo data · No bank account connected · Not financial advice</span><span>Made for the 30-day challenge</span></footer>
    </main>
    {showForm && <TransactionForm onAdd={addTransaction} onClose={()=>setShowForm(false)} day={Math.min(CHALLENGE_DAYS,day+1)}/>}
  </div>;
}
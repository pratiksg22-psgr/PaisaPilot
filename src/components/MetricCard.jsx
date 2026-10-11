import React from "react";

export default function MetricCard({ icon: Icon, label, value, note, tone = "purple" }) {
  return (
    <article className="metric-card" aria-label={`${label}: ${value}`}>
      <div className={`metric-icon ${tone}`} aria-hidden="true"><Icon size={18} /></div>
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      <p className="metric-note">{note}</p>
    </article>
  );
}
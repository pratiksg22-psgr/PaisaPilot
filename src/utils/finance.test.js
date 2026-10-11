import { describe, it, expect } from "vitest";
import { calculateFinance, formatMoney, simulatePurchase, validateTransaction } from "./finance.js";

const base = {
  transactions: [{ title: "Lunch", amount: 100, category: "Food", day: 1 }],
  subscriptions: [{ amount: 100, active: true }],
  commitments: 500,
  day: 1
};

describe("finance calculations", () => {
  it("calculates balance from starting budget, spending and income", () => {
    expect(calculateFinance({ ...base, income: 250 }).balance).toBe(10150);
  });
  it("reserves commitments and active subscriptions before daily allowance", () => {
    const result = calculateFinance(base);
    expect(result.flexibleMoney).toBe(9300);
    expect(result.dailyAllowance).toBe(9300 / 30);
  });
  it("ignores disabled subscriptions", () => {
    expect(calculateFinance({ ...base, subscriptions: [{ amount: 100, active: false }] }).recurring).toBe(0);
  });
  it("flags a large purchase as higher risk", () => {
    const finance = calculateFinance({ ...base, commitments: 1500 });
    expect(simulatePurchase(finance, 9000).riskAfter).toBe("High");
  });
  it("rejects empty names and invalid amounts", () => {
    expect(validateTransaction({ title: " ", amount: 100 }).valid).toBe(false);
    expect(validateTransaction({ title: "Lunch", amount: -1 }).valid).toBe(false);
    expect(validateTransaction({ title: "Lunch", amount: "abc" }).valid).toBe(false);
  });
  it("normalizes transaction title whitespace", () => {
    expect(validateTransaction({ title: "  Lunch   with friends ", amount: 80 })).toMatchObject({ valid: true, title: "Lunch with friends", amount: 80 });
  });
  it("formats rupees in Indian locale", () => {
    expect(formatMoney(1000)).toContain("1,000");
  });
});
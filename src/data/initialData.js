export const STARTING_BUDGET = 10000;
export const CHALLENGE_DAYS = 30;

export const initialTransactions = [
  { id: "seed-1", title: "Groceries & meals", category: "Food", amount: 420, day: 1 },
  { id: "seed-2", title: "Metro & auto", category: "Transport", amount: 180, day: 2 },
  { id: "seed-3", title: "Coffee with friends", category: "Lifestyle", amount: 160, day: 3 },
  { id: "seed-4", title: "Mobile recharge", category: "Bills", amount: 299, day: 4 },
  { id: "seed-5", title: "Lunch", category: "Food", amount: 140, day: 5 }
];

export const initialSubscriptions = [
  { id: "music", name: "Music streaming", amount: 119, dueDay: 12, active: true },
  { id: "cloud", name: "Cloud storage", amount: 75, dueDay: 18, active: true },
  { id: "video", name: "Video streaming", amount: 149, dueDay: 22, active: false }
];

export const categories = ["Food", "Transport", "Lifestyle", "Bills", "Other"];
// Test simple ejecutable con `npm test` (tsx). Sin framework: asserts en consola.
import { scoreFor } from "./score";

const rules = { exact: 3, outcome: 1 };

type Case = {
  desc: string;
  pred: { home: number; away: number } | null;
  result: { home: number; away: number } | null;
  expected: number | null;
};

const cases: Case[] = [
  { desc: "pred 2-1, real 2-1 -> 3", pred: { home: 2, away: 1 }, result: { home: 2, away: 1 }, expected: 3 },
  { desc: "pred 2-0, real 3-1 -> 1", pred: { home: 2, away: 0 }, result: { home: 3, away: 1 }, expected: 1 },
  { desc: "pred 1-1, real 0-0 -> 1", pred: { home: 1, away: 1 }, result: { home: 0, away: 0 }, expected: 1 },
  { desc: "pred 2-1, real 1-2 -> 0", pred: { home: 2, away: 1 }, result: { home: 1, away: 2 }, expected: 0 },
  { desc: "sin pred, real 1-0 -> null", pred: null, result: { home: 1, away: 0 }, expected: null },
];

let failed = 0;
for (const c of cases) {
  const got = scoreFor(c.pred, c.result, rules);
  const ok = got === c.expected;
  if (!ok) failed++;
  console.log(`${ok ? "✅" : "❌"} ${c.desc} (obtenido: ${got})`);
}

if (failed > 0) {
  console.error(`\n${failed} caso(s) fallaron.`);
  process.exit(1);
}
console.log("\nTodos los casos de puntuación pasan.");

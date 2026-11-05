import { questions, computeStats } from "../src/data/questions";
const errs: string[] = [];
const ids = new Set<string>();
const keys = new Set<string>();
for (const q of questions) {
  if (ids.has(q.id)) errs.push("dup id " + q.id);
  ids.add(q.id);
  if (q.choices.length !== 4) errs.push(q.id + " choices != 4");
  if (q.correctIndex < 0 || q.correctIndex > 3) errs.push(q.id + " bad correctIndex");
  const seen = new Set(q.choices.map((c) => c.zh + "|" + c.en + "|" + JSON.stringify(c.visual ?? "")));
  if (seen.size !== 4) errs.push(q.id + " duplicate choices");
  for (const c of q.choices) if (!c.en || (!c.zh && !c.visual)) errs.push(q.id + " empty choice");
  if (!q.explanationZh || !q.explanationEn || !q.questionZh || !q.questionEn) errs.push(q.id + " missing text");
  const key = q.level + q.questionZh + JSON.stringify(q.imageConfig) + JSON.stringify(q.choices);
  if (keys.has(key)) errs.push("duplicate question " + q.id);
  keys.add(key);
  const k2 = q.imageType === "emoji" ? "" : q.level + q.questionZh + JSON.stringify(q.imageConfig);
  if (k2 && keys.has(k2)) errs.push("dup q+visual " + q.id);
  keys.add(k2);
}
const s = computeStats();
console.log("total", s.total, "K2", s.K2, "K3", s.K3);
for (const t of s.topics) console.log(t.level, t.category.padEnd(11), t.topic, t.count);
console.log(errs.length ? errs.join("\n") : "NO ERRORS");

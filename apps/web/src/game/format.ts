// Display formatting.

const longDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const shortDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

const asDate = (iso: string) => new Date(iso.length === 10 ? iso + "T00:00:00Z" : iso);
export const fmtDate = (iso: string) => (iso ? longDate.format(asDate(iso)) : "");
export const fmtShortDate = (iso: string) => (iso ? shortDate.format(asDate(iso)) : "");

// The formatters below compare each value as it would be shown in the smaller unit, so a
// value that rounds up to a threshold moves into the next unit (999.6bn is "$1.00tn", not "$1000bn").

/** USD billions → "$842bn" / "$27.4tn". */
export function fmtGdp(bn: number) {
  if (!Number.isFinite(bn)) return "—";
  if (Math.round(bn) >= 1000) {
    const tn = bn / 1000;
    return `$${tn.toFixed(+tn.toFixed(2) >= 10 ? 1 : 2)}tn`;
  }
  if (+bn.toFixed(1) >= 10) return `$${Math.round(bn)}bn`;
  return `$${bn.toFixed(1)}bn`;
}

/** Millions → "1.41bn" / "83.2m" / "540k". */
export function fmtPop(m: number) {
  if (!Number.isFinite(m)) return "—";
  if (Math.round(m) >= 1000) return `${(m / 1000).toFixed(2)}bn`;
  if (+m.toFixed(1) >= 10) return `${Math.round(m)}m`;
  if (Math.round(m * 1000) >= 1000) return `${m.toFixed(1)}m`;
  return `${Math.round(m * 1000)}k`;
}

export const fmtRelation = (r: number) => (r > 0 ? `+${Math.round(r)}` : `${Math.round(r)}`);

export function relationWord(r: number) {
  if (r >= 70) return "Allied";
  if (r >= 35) return "Friendly";
  if (r >= 10) return "Cordial";
  if (r > -10) return "Neutral";
  if (r > -35) return "Cool";
  if (r > -70) return "Hostile";
  return "Enemies";
}

export const JUMP_OPTIONS: { days: number; label: string }[] = [
  { days: 7, label: "1 week" },
  { days: 30, label: "1 month" },
  { days: 90, label: "3 months" },
  { days: 180, label: "6 months" },
  { days: 365, label: "1 year" },
  { days: 0, label: "Next major event" },
];

export const jumpLabel = (days: number) => JUMP_OPTIONS.find((o) => o.days === days)?.label ?? `${days} days`;

export function fmtCountdown(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

export const uid = (prefix = "") =>
  prefix + (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36)).replace(/-/g, "").slice(0, 12);

const BACKEND_LABEL: Record<string, string> = { openrouter: "OpenRouter", anthropic: "Anthropic", openai: "OpenAI", gemini: "Gemini", local: "Local" };

/** "Mock AI", or the configured backends, e.g. "OpenRouter + Anthropic". */
export function aiLabel(ai: { provider: string; backends?: string[] }) {
  if (ai.provider === "mock") return "Mock AI";
  return ai.backends?.length ? ai.backends.map((b) => BACKEND_LABEL[b] ?? b).join(" + ") : "OpenRouter";
}

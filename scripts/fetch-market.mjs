/**
 * ANEVA — Recolha diária de indicadores de mercado
 * ------------------------------------------------------------
 * Atualiza assets/data/market.json com:
 *   • Câmbio (USD/AOA, EUR/AOA, GBP/AOA, ZAR/AOA) — automático e fiável,
 *     via API pública de câmbio (open.er-api.com, sem chave).
 *   • BNA — MELHOR-ESFORÇO: se a variável de ambiente BNA_URL apontar para
 *     uma página/endpoint com as taxas de referência, tenta extrair USD/EUR.
 *   • BODIVA — MELHOR-ESFORÇO: se BODIVA_URL estiver definida, tenta ler um
 *     valor do boletim. Caso falhe, mantém o valor manual já existente.
 *
 * Filosofia: nunca apaga dados. Os itens marcados "manual" são preservados;
 * só são atualizados os automáticos (e os de melhor-esforço quando o scrape
 * devolve algo válido). Assim o site nunca fica sem indicadores.
 *
 * Sem dependências externas — usa o fetch nativo do Node 18+.
 */
import { readFile, writeFile } from "node:fs/promises";

const FILE = new URL("../assets/data/market.json", import.meta.url);
const UA =
  "Mozilla/5.0 (compatible; AnevaMarketBot/1.0; +https://aneva.co.ao)";
const FX_URL = "https://open.er-api.com/v6/latest/USD";

/* ---------- utilidades ---------- */
async function loadCurrent() {
  try {
    return JSON.parse(await readFile(FILE, "utf8"));
  } catch {
    return { updatedAt: null, items: [] };
  }
}
const byId = (items, id) => items.find((i) => i.id === id);

// Converte "1.234,56" ou "1,234.56" ou "925.02" num número.
function parseNumber(str) {
  if (!str) return null;
  let s = String(str).replace(/[^\d.,]/g, "");
  if (s.includes(",") && s.includes(".")) {
    // o último separador é o decimal
    s = s.lastIndexOf(",") > s.lastIndexOf(".")
      ? s.replace(/\./g, "").replace(",", ".")
      : s.replace(/,/g, "");
  } else if (s.includes(",")) {
    s = s.replace(",", ".");
  }
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

function matchRate(text, re) {
  const m = re.exec(text);
  return m ? parseNumber(m[1]) : null;
}

// Atualiza valor + variação (%) de um item de câmbio face ao valor anterior.
function setFx(item, value, srcLabel) {
  if (!item || value == null) return;
  const prev = item.value;
  item.value = Math.round(value * 100) / 100;
  if (typeof prev === "number" && prev > 0) {
    const pct = ((item.value - prev) / prev) * 100;
    item.chg = Math.round(pct * 100) / 100;
    item.chgType = "pct";
    // Para pares X/AOA, uma subida = Kwanza mais fraco = leitura negativa.
    item.dir = pct > 0.001 ? "bad" : pct < -0.001 ? "good" : "flat";
  }
  if (srcLabel) item.src = srcLabel;
}

/* ---------- fontes ---------- */
async function fetchFx() {
  const res = await fetch(FX_URL, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error("FX HTTP " + res.status);
  const j = await res.json();
  if (j.result !== "success" || !j.rates || !j.rates.AOA) {
    throw new Error("FX: resposta sem AOA");
  }
  const r = j.rates;
  const usdAoa = r.AOA;
  return {
    usdaoa: usdAoa,
    euraoa: r.EUR ? usdAoa / r.EUR : null,
    gbpaoa: r.GBP ? usdAoa / r.GBP : null,
    zaraoa: r.ZAR ? usdAoa / r.ZAR : null,
  };
}

// BNA — melhor-esforço. Só corre se BNA_URL estiver definida.
async function fetchBna() {
  const url = process.env.BNA_URL;
  if (!url) return null;
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return null;
    const text = await res.text();
    const usd = matchRate(text, /USD[^0-9]{0,60}?([0-9][0-9.,]{2,})/i);
    const eur = matchRate(text, /EUR[^0-9]{0,60}?([0-9][0-9.,]{2,})/i);
    if (usd || eur) return { usd, eur };
    return null;
  } catch {
    return null;
  }
}

// BODIVA — melhor-esforço. Só corre se BODIVA_URL estiver definida.
async function fetchBodiva() {
  const url = process.env.BODIVA_URL;
  if (!url) return null;
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return null;
    const text = await res.text();
    // Procura um índice/valor de referência no boletim (padrão configurável).
    const val = matchRate(
      text,
      new RegExp(
        (process.env.BODIVA_PATTERN || "(?:Índice|Index|BODIVA)") +
          "[^0-9]{0,60}?([0-9][0-9.,]{2,})",
        "i"
      )
    );
    return val != null ? { value: val } : null;
  } catch {
    return null;
  }
}

/* ---------- execução ---------- */
async function main() {
  const data = await loadCurrent();
  const items = data.items || [];
  const notes = [];

  // 1) Câmbio automático (obrigatório)
  try {
    const fx = await fetchFx();
    setFx(byId(items, "usdaoa"), fx.usdaoa, "auto");
    setFx(byId(items, "euraoa"), fx.euraoa, "auto");
    setFx(byId(items, "gbpaoa"), fx.gbpaoa, "auto");
    setFx(byId(items, "zaraoa"), fx.zaraoa, "auto");
    notes.push("câmbio: ok (API de mercado)");
  } catch (e) {
    notes.push("câmbio: FALHOU (" + e.message + ") — mantidos valores anteriores");
  }

  // 2) BNA — melhor-esforço (sobrepõe o câmbio se a taxa oficial for lida)
  try {
    const bna = await fetchBna();
    if (bna) {
      if (bna.usd) setFx(byId(items, "usdaoa"), bna.usd, "bna");
      if (bna.eur) setFx(byId(items, "euraoa"), bna.eur, "bna");
      notes.push("BNA: taxa de referência lida");
    } else {
      notes.push("BNA: sem dados (definir BNA_URL) — valor manual mantido");
    }
  } catch {
    notes.push("BNA: erro — valor manual mantido");
  }

  // 3) BODIVA — melhor-esforço
  try {
    const b = await fetchBodiva();
    const item = byId(items, "bodiva");
    if (b && item && b.value != null) {
      const prev = item.value;
      item.value = Math.round(b.value * 100) / 100;
      if (typeof prev === "number" && prev > 0) {
        const pct = ((item.value - prev) / prev) * 100;
        item.chg = Math.round(pct * 100) / 100;
        item.chgType = "pct";
        item.dir = pct > 0 ? "up" : pct < 0 ? "down" : "flat";
      }
      item.src = "bodiva";
      notes.push("BODIVA: boletim lido");
    } else {
      notes.push("BODIVA: sem dados (definir BODIVA_URL) — valor manual mantido");
    }
  } catch {
    notes.push("BODIVA: erro — valor manual mantido");
  }

  data.items = items;
  data.updatedAt = new Date().toISOString();
  data.log = notes;

  await writeFile(FILE, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log("market.json atualizado @", data.updatedAt);
  notes.forEach((n) => console.log("  -", n));
}

main().catch((e) => {
  console.error("Falha inesperada:", e);
  process.exit(1);
});

/**
 * Cliente da API AngoStay. As páginas do protótipo usam dados de demonstração
 * (mock-data.ts) quando a API não está disponível, para que o frontend sirva
 * como protótipo navegável autónomo.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/v1';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Erro ${res.status}`);
  }
  return res.json() as Promise<T>;
}

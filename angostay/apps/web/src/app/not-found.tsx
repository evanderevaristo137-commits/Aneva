import Link from 'next/link';

/** Página 404. */
export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <p className="text-7xl">🧭</p>
      <h1 className="mt-4 text-3xl font-bold">Página não encontrada</h1>
      <p className="mt-2 max-w-md text-muted">
        O endereço que procura não existe ou foi movido. Que tal descobrir uma nova estadia?
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="btn-primary">Voltar à Home</Link>
        <Link href="/pesquisar" className="btn-ghost">Pesquisar alojamentos</Link>
      </div>
    </div>
  );
}

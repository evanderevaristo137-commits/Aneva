'use client';

/** Página 500 — erro inesperado. */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <p className="text-7xl">⚡</p>
      <h1 className="mt-4 text-3xl font-bold">Algo correu mal</h1>
      <p className="mt-2 max-w-md text-muted">
        Ocorreu um erro inesperado do nosso lado. A equipa já foi notificada — tente novamente.
      </p>
      <div className="mt-6 flex gap-3">
        <button onClick={reset} className="btn-primary">Tentar novamente</button>
        <a href="/" className="btn-ghost">Voltar à Home</a>
      </div>
    </div>
  );
}

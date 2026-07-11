# AngoStay — Wireframes (baixa fidelidade)

Convenções: `[ ]` botão · `( )` input · `▤` cartão · `☰` menu · `♡` favorito · `★` avaliação.
Layout mobile-first; em desktop o conteúdo centra num contentor de 1200 px.

## 1. Home `/`

```
┌────────────────────────────────────────────────────────────┐
│ AngoStay        Pesquisar  Anunciar  Ajuda   PT▾  ◐  [Entrar]
├────────────────────────────────────────────────────────────┤
│        HERO — foto de Luanda/Mussulo, overlay azul-noite   │
│   "Encontre a sua estadia em Angola"                       │
│   ┌──────────────────────────────────────────────┐         │
│   │ (Onde? Luanda…) (Check-in) (Check-out) (2 hósp) [🔍]   │
│   └──────────────────────────────────────────────┘         │
├────────────────────────────────────────────────────────────┤
│ Destinos populares:  ▤Luanda ▤Benguela ▤Lubango ▤Namibe    │
│ Em destaque:         ▤▤▤▤  (cartões: foto, preço/noite,    │
│                      ★4.8, selo "Verificado", ♡)           │
│ Como funciona:  1 Pesquise → 2 Reserve → 3 Pague → 4 Fique │
│ Torne-se anfitrião — CTA laranja                           │
│ Rodapé: Sobre · Ajuda · Termos · Privacidade · PT/EN/FR    │
└────────────────────────────────────────────────────────────┘
```

## 2. Resultados de pesquisa `/pesquisar`

```
┌ Filtros: (Preço▾)(Tipo▾)(Quartos▾)(Comodidades▾)(Verificados ☑) ┐
│ ┌───────────────── lista ─────────────────┐ ┌───── mapa ─────┐ │
│ │ ▤ foto | T2 Talatona  ★4.9 · 45.000 Kz  │ │  ● ● pins com  │ │
│ │ ▤ foto | Guest House… ★4.7 · 28.000 Kz  │ │    preço       │ │
│ │ … paginação / scroll infinito           │ │  (toggle mapa) │ │
│ └─────────────────────────────────────────┘ └────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## 3. Detalhes do imóvel `/imovel/[slug]`

```
│ Galeria (1 grande + 4 mini, "ver todas")          ♡ Partilhar │
│ T2 moderno em Talatona · Luanda      ✅ Imóvel verificado     │
│ ★4.9 (37 avaliações) · Anfitrião: Domingos ✅ (desde 2024)    │
│ ── Descrição ── Comodidades (gerador ⚡, água, wifi, AC…) ──  │
│ ── Mapa da zona ── Regras ── Política de cancelamento ──      │
│ ── Avaliações (lista + distribuição) ──                       │
│ ┌ Cartão reserva (sticky) ───────────────┐                    │
│ │ 45.000 Kz/noite  (Check-in)(Check-out) │                    │
│ │ (Hóspedes▾)  Total: 235.000 Kz         │                    │
│ │ [Reservar]  — sem cobrança imediata    │                    │
│ └────────────────────────────────────────┘                    │
```

## 4. Autenticação `/login` · `/criar-conta` · `/recuperar-senha`

```
│        AngoStay                                   │
│  ( Email )  ( Palavra-passe )        [Entrar]     │
│  ── ou ──  [G Google] [f Facebook]                │
│  Esqueceu a senha? · Criar conta                  │
│  (criar conta: nome, email, telefone +244, senha, │
│   tipo: hóspede/anfitrião, aceito Termos ☑)       │
```

## 5. Dashboard do anfitrião `/anfitriao/dashboard`

```
│ ☰ Visão geral | Imóveis | Calendário | Reservas | Mensagens | Avaliações
│ ▤ Reservas do mês: 12   ▤ Receita: 1.240.000 Kz  ▤ Ocupação: 68%  ▤ ★4.8
│ 📈 Gráfico receita 12 meses      📊 Ocupação por imóvel
│ Próximas chegadas: lista (hóspede, datas, estado, [Ver])
│ Ações rápidas: [+ Adicionar imóvel] [Editar preços] [Bloquear datas]
```

## 6. Adicionar/editar imóvel `/anfitriao/imoveis/novo`

Assistente em 6 passos com barra de progresso:
`1 Tipo → 2 Localização (pin no mapa) → 3 Fotos (drag&drop) → 4 Comodidades → 5 Preço/regras → 6 Rever & publicar`

## 7. Outras páginas

- **Reservas `/reservas`** — abas Próximas/Concluídas/Canceladas; cartão com QR Code de check-in.
- **Pagamentos `/pagamentos`** — histórico, métodos guardados, recibos PDF.
- **Mensagens `/mensagens`** — lista de conversas à esquerda, thread à direita, tempo real.
- **Favoritos `/favoritos`** — grelha de cartões guardados.
- **Perfil `/perfil`** — dados, verificação de identidade, 2FA, idioma, preferências.
- **Calendário `/anfitriao/calendario`** — vista mensal, bloquear datas, preços por data.
- **Admin `/admin`** — sidebar: Utilizadores, Imóveis, Reservas, Pagamentos, Comissões,
  Denúncias, Antifraude, Logs, CMS; tabelas com filtros e ações de moderação.
- **Ajuda `/ajuda`** — FAQ pesquisável por categoria; **Contacto `/contacto`** — formulário + WhatsApp.
- **404/500** — ilustração, mensagem clara, [Voltar à Home].

> Protótipo navegável: o frontend em `apps/web` implementa estes wireframes com dados
> de demonstração — serve como protótipo de alta fidelidade clicável.

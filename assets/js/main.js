/* =============================================================
   BEA Consulting — main.js
   Content (PT/EN), rendering and interactions. Vanilla JS, no deps.
   ============================================================= */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  // Safe storage — private mode and sandboxed iframes can block localStorage.
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  var WA_NUMBER = "244936673669";

  /* ---------------------------------------------------------
     1. STATIC STRINGS (data-i18n)
     --------------------------------------------------------- */
  var I18N = {
    pt: {
      "doc.title": "BEA Consulting · Consultoria financeira em Angola",
      "skip": "Saltar para o conteúdo",
      "nav.label": "Principal", "nav.services": "Serviços", "nav.method": "Método", "nav.tiers": "Níveis",
      "nav.tools": "Ferramentas", "nav.insights": "Insights", "nav.contact": "Contacto", "nav.start": "Por onde começar",
      "nav.faq": "Perguntas frequentes",
      "lang.aria": "Mudar para inglês", "theme.aria": "Alternar tema claro/escuro",
      "menu.open": "Abrir menu", "menu.close": "Fechar menu", "mbar.aria": "Acções rápidas",
      "cta.diag": "Diagnóstico gratuito", "cta.diagAsk": "Pedir diagnóstico gratuito", "cta.wa": "Falar no WhatsApp",
      "cta.talk": "Falar com a BEA",
      "hero.eyebrow": "Consultoria financeira · Angola",
      "hero.t1": "Decida com", "hero.t2": "números,", "hero.t3": "não com palpites.",
      "hero.lead": "Contabilidade, fiscalidade, auditoria e gestão financeira para empresas e investidores. Com método, prazos e revisão.",
      "hero.noteK": "Relatório mensal", "hero.noteV": "Resultados · Balanço · Caixa",
      "tag.acc": "Contabilidade", "tag.tax": "Fiscalidade", "tag.audit": "Auditoria", "tag.via": "Viabilidade",
      "tag.credit": "Crédito", "tag.fm": "Gestão financeira",
      "fact.1": "serviços em 3 frentes", "fact.2": "verificações no fecho de cada mês",
      "fact.3": "etapas, zero improvisos", "fact.4": "módulos por estudo de viabilidade",
      "ticker.aria": "Indicadores de mercado", "ticker.tag": "Centro de Inteligência", "ticker.updated": "Actualizado",
      "einv.label": "Factura electrónica",
      "einv.date": "1 de Janeiro de 2027",
      "einv.text": "A factura electrónica passa a ser obrigatória nos regimes geral e simplificado do IVA. A sua empresa está pronta?",
      "einv.dateAfter": "Desde 1 de Janeiro de 2027",
      "einv.textAfter": "A factura electrónica é obrigatória nos regimes geral e simplificado do IVA. Está tudo em ordem na sua empresa?",
      "einv.days": "dias", "einv.day": "dia", "einv.cta": "Preparar a minha empresa",
      "router.eyebrow": "Por onde começar",
      "router.c1": "Facturas num saco.", "router.c2": "Extractos por conciliar.", "router.c3": "Prazos só de cabeça.",
      "router.t1": "A BEA", "router.t2": "põe tudo", "router.t3": "em ordem.",
      "router.lead": "Escolha a situação mais parecida com a sua. Mostramos o serviço certo e falamos consigo.",
      "router.help": "Pedir ajuda com isto", "router.see": "Ver serviço",
      "svc.eyebrow": "Os nossos serviços", "svc.t1": "Tudo o que a BEA faz", "svc.t2": "por si.",
      "svc.lead": "12 serviços em 3 frentes. Toque num serviço para ver o que inclui e pedir uma proposta.",
      "svc.foot": "Precisa de algum destes serviços? Desenhamos o apoio certo para a sua fase.",
      "svc.ask": "Pedir proposta",
      "p1.t": "Gestão Financeira", "p2.t": "Análise & Financiamento", "p3.t": "Fiscalidade, Auditoria & Sistemas",
      "rig.eyebrow": "Porquê a BEA", "rig.t1": "Com método, prazos e", "rig.t2": "revisão.",
      "rig.lead": "Não é uma promessa vaga: é assim que trabalhamos, todos os meses, com todos os clientes.",
      "rig.a.t": "verificações", "rig.a.s": "no fecho de cada mês.",
      "rig.a.1": "Reconciliações bancárias concluídas", "rig.a.2": "Clientes e fornecedores revistos",
      "rig.a.3": "Folha de salários e encargos tratados", "rig.a.4": "Impostos apurados e declarados",
      "rig.a.5": "Pagamentos fiscais controlados", "rig.a.6": "Balancete emitido e analisado",
      "rig.a.more": "+ 9 verificações",
      "rig.a.note": "No fim, recebe um resumo com as principais variações, pendências e riscos do mês.",
      "rig.b.t1": "Os nossos prazos terminam", "rig.b.t2": "antes", "rig.b.t3": "dos da AGT.",
      "rig.b.bea": "Prazo BEA", "rig.b.legal": "Prazo legal", "rig.b.gap": "Margem para rever e corrigir",
      "rig.b.note": "Criamos um calendário fiscal só para a sua empresa, com prazos internos antes dos legais e pedidos de documentos feitos com antecedência.",
      "rig.c.t": "Submeter não é cumprir.",
      "rig.c.1": "Declaração preparada", "rig.c.2": "Declaração revista", "rig.c.3": "Declaração submetida",
      "rig.c.4": "Imposto pago", "rig.c.4b": "Só aqui está cumprida",
      "rig.c.note": "Para nós, uma obrigação só está cumprida quando o imposto está pago e o comprovativo arquivado.",
      "rig.d.t1": "Não esperamos", "rig.d.t2": "pelo fim do mês.",
      "rig.d.1k": "Diária", "rig.d.1": "Movimentos, pagamentos e cobranças registados",
      "rig.d.2k": "Semanal", "rig.d.2": "Revisão de caixa e de contas a pagar e a receber",
      "rig.d.3k": "Mensal", "rig.d.3": "Fecho do mês, relatório de gestão e reunião de resultados",
      "rig.d.4k": "Trimestral", "rig.d.4": "Revisão de cenários e do orçamento, com plano de acção",
      "met.eyebrow": "Como trabalhamos", "met.t1": "8 etapas.", "met.t2": "Zero improvisos.",
      "met.lead": "O mesmo processo com todos os clientes, do primeiro contacto ao acompanhamento das melhorias.",
      "tier.eyebrow": "Níveis de acompanhamento", "tier.t1": "Até onde quer que a BEA", "tier.t2": "vá consigo?",
      "tier.lead": "Três níveis. Cada um inclui o anterior.", "tier.cta": "Quero este nível", "tier.flag": "Mais completo",
      "rep.eyebrow": "Contabilidade de gestão", "rep.t1": "Contabilidade para decidir.", "rep.t2": "Não só para declarar.",
      "rep.1": "Lançamentos por centro de custo", "rep.2": "Fecho mensal em data fixa",
      "rep.3": "Relatório de gestão com resultados, balanço e fluxo de caixa", "rep.cta": "Ver o serviço",
      "rep.kicker": "Relatório mensal de gestão · exemplo",
      "rep.tab1": "Resultados", "rep.tab2": "Fluxo de caixa", "rep.tab3": "Margem",
      "rep.k1": "Margem líquida", "rep.k1v": "17,2%", "rep.k2": "Liquidez geral", "rep.k2v": "1,9x",
      "rep.k3": "Prazo médio de recebimento", "rep.k3v": "42 dias",
      "rep.note": "Valores ilustrativos de um relatório tipo.",
      "diag.q": "Quer saber em que estado está a sua empresa?", "diag.box": "Diagnóstico gratuito",
      "diag.1": "Ficha de diagnóstico", "diag.2": "Mapa de pendências", "diag.3": "Plano de trabalho",
      "diag.lead": "Sem compromisso. Fica a saber onde está e por onde começar.",
      "tools.eyebrow": "Ferramentas", "tools.t1": "Faça as contas", "tools.t2": "antes", "tools.t3": "de decidir.",
      "tools.lead": "Simuladores gratuitos para estimativas rápidas. Para uma análise à medida, fale com a BEA.",
      "ins.eyebrow": "Insights", "ins.t1": "O que precisa de saber,", "ins.t2": "sem rodeios.",
      "ins.lead": "Notas práticas da equipa BEA sobre fiscalidade, financiamento e gestão em Angola.",
      "ins.more": "Ver pontos-chave", "ins.talk": "Falar sobre isto",
      "faq.eyebrow": "Perguntas frequentes", "faq.title": "Antes de falar connosco",
      "ct.eyebrow": "Contacto", "ct.t1": "Fale com a",
      "ct.lead": "Vai investir, pedir crédito ou organizar as finanças? Diga-nos o que precisa. Respondemos pelo WhatsApp.",
      "ct.phone": "Telefone", "ct.how": "Como funciona",
      "ct.how1": "Envia-nos a sua mensagem pelo formulário ou pelo WhatsApp.",
      "ct.how2": "Fazemos o diagnóstico: conhecer a empresa, os riscos e as pendências.",
      "ct.how3": "Recebe o plano de trabalho e uma proposta à medida da sua fase.",
      "ct.f.name": "Nome", "ct.f.company": "Empresa", "ct.f.service": "Assunto",
      "ct.f.msg": "Como podemos ajudar?", "ct.f.msgPh": "Conte-nos brevemente a situação da sua empresa.",
      "ct.f.submit": "Enviar pelo WhatsApp", "ct.f.hint": "Abre o WhatsApp com a sua mensagem pronta a enviar.",
      "ct.f.err": "Indique o seu nome para continuarmos.",
      "ct.f.ok": "A abrir o WhatsApp com a sua mensagem. Se não abriu,",
      "ct.f.okLink": "toque aqui.",
      "subj.start": "Começar", "subj.diag": "Diagnóstico gratuito", "subj.einv": "Factura electrónica (preparação)",
      "subj.tiers": "Níveis de acompanhamento", "subj.other": "Outro assunto",
      "wa.default": "Olá BEA Consulting! Gostaria de saber mais sobre os vossos serviços.",
      "wa.hello": "Olá BEA Consulting!", "wa.me": "Sou {n}", "wa.co": ", da empresa {c}",
      "wa.subj": "Gostaria de falar sobre: {s}.",
      "ftr.about": "Contabilidade, fiscalidade, auditoria, gestão financeira, estudos de viabilidade e acesso ao crédito, em Angola.",
      "ftr.services": "Serviços", "ftr.company": "A BEA", "ftr.contact": "Fale com a BEA",
      "ftr.rights": "Todos os direitos reservados.", "ftr.top": "Voltar ao topo ↑",
      "sim.calcNote": "Estimativa indicativa. Para uma análise rigorosa e à medida, fale com a BEA.",
      "sim.years": "anos", "sim.months": "meses", "sim.unit": "/ un.",
      "chart.months": "Jan,Fev,Mar,Abr,Mai,Jun,Jul,Ago,Set,Out,Nov,Dez"
    },
    en: {
      "doc.title": "BEA Consulting · Financial consulting in Angola",
      "skip": "Skip to content",
      "nav.label": "Main", "nav.services": "Services", "nav.method": "Method", "nav.tiers": "Levels",
      "nav.tools": "Tools", "nav.insights": "Insights", "nav.contact": "Contact", "nav.start": "Where to start",
      "nav.faq": "FAQ",
      "lang.aria": "Switch to Portuguese", "theme.aria": "Toggle light/dark theme",
      "menu.open": "Open menu", "menu.close": "Close menu", "mbar.aria": "Quick actions",
      "cta.diag": "Free diagnosis", "cta.diagAsk": "Request a free diagnosis", "cta.wa": "Chat on WhatsApp",
      "cta.talk": "Talk to BEA",
      "hero.eyebrow": "Financial consulting · Angola",
      "hero.t1": "Decide with", "hero.t2": "numbers,", "hero.t3": "not guesswork.",
      "hero.lead": "Accounting, tax, audit and financial management for companies and investors. With method, deadlines and review.",
      "hero.noteK": "Monthly report", "hero.noteV": "Results · Balance sheet · Cash",
      "tag.acc": "Accounting", "tag.tax": "Tax", "tag.audit": "Audit", "tag.via": "Feasibility",
      "tag.credit": "Credit", "tag.fm": "Financial management",
      "fact.1": "services across 3 areas", "fact.2": "checks at every month-end close",
      "fact.3": "steps, zero improvising", "fact.4": "modules per feasibility study",
      "ticker.aria": "Market indicators", "ticker.tag": "Intelligence Center", "ticker.updated": "Updated",
      "einv.label": "E-invoicing",
      "einv.date": "1 January 2027",
      "einv.text": "E-invoicing becomes mandatory under the general and simplified VAT regimes. Is your company ready?",
      "einv.dateAfter": "Since 1 January 2027",
      "einv.textAfter": "E-invoicing is mandatory under the general and simplified VAT regimes. Is everything in order at your company?",
      "einv.days": "days", "einv.day": "day", "einv.cta": "Get my company ready",
      "router.eyebrow": "Where to start",
      "router.c1": "Invoices in a bag.", "router.c2": "Unreconciled statements.", "router.c3": "Deadlines kept in your head.",
      "router.t1": "BEA", "router.t2": "puts it all", "router.t3": "in order.",
      "router.lead": "Pick the situation closest to yours. We'll show you the right service and talk it through.",
      "router.help": "Get help with this", "router.see": "See service",
      "svc.eyebrow": "Our services", "svc.t1": "Everything BEA does", "svc.t2": "for you.",
      "svc.lead": "12 services across 3 areas. Tap a service to see what it includes and request a proposal.",
      "svc.foot": "Need one of these services? We'll design the right support for your stage.",
      "svc.ask": "Request a proposal",
      "p1.t": "Financial Management", "p2.t": "Analysis & Financing", "p3.t": "Tax, Audit & Systems",
      "rig.eyebrow": "Why BEA", "rig.t1": "With method, deadlines and", "rig.t2": "review.",
      "rig.lead": "Not a vague promise: this is how we work, every month, with every client.",
      "rig.a.t": "checks", "rig.a.s": "at every month-end close.",
      "rig.a.1": "Bank reconciliations completed", "rig.a.2": "Customers and suppliers reviewed",
      "rig.a.3": "Payroll and charges processed", "rig.a.4": "Taxes calculated and filed",
      "rig.a.5": "Tax payments tracked", "rig.a.6": "Trial balance issued and analysed",
      "rig.a.more": "+ 9 more checks",
      "rig.a.note": "At the end you get a summary of the month's key variances, open issues and risks.",
      "rig.b.t1": "Our deadlines end", "rig.b.t2": "before", "rig.b.t3": "AGT's.",
      "rig.b.bea": "BEA deadline", "rig.b.legal": "Legal deadline", "rig.b.gap": "Room to review and fix",
      "rig.b.note": "We build a tax calendar just for your company, with internal deadlines ahead of the legal ones and document requests made well in advance.",
      "rig.c.t": "Filing is not complying.",
      "rig.c.1": "Return prepared", "rig.c.2": "Return reviewed", "rig.c.3": "Return filed",
      "rig.c.4": "Tax paid", "rig.c.4b": "Only now is it done",
      "rig.c.note": "For us, an obligation is only met when the tax is paid and the proof of payment is archived.",
      "rig.d.t1": "We don't wait", "rig.d.t2": "for month-end.",
      "rig.d.1k": "Daily", "rig.d.1": "Transactions, payments and collections recorded",
      "rig.d.2k": "Weekly", "rig.d.2": "Cash, payables and receivables reviewed",
      "rig.d.3k": "Monthly", "rig.d.3": "Month-end close, management report and results meeting",
      "rig.d.4k": "Quarterly", "rig.d.4": "Scenario and budget review, with an action plan",
      "met.eyebrow": "How we work", "met.t1": "8 steps.", "met.t2": "Zero improvising.",
      "met.lead": "The same process with every client, from first contact to following up on improvements.",
      "tier.eyebrow": "Support levels", "tier.t1": "How far do you want BEA", "tier.t2": "to go with you?",
      "tier.lead": "Three levels. Each one includes the previous.", "tier.cta": "I want this level", "tier.flag": "Most complete",
      "rep.eyebrow": "Management accounting", "rep.t1": "Accounting to decide.", "rep.t2": "Not just to file.",
      "rep.1": "Entries by cost centre", "rep.2": "Monthly close on a fixed date",
      "rep.3": "Management report with results, balance sheet and cash flow", "rep.cta": "See the service",
      "rep.kicker": "Monthly management report · example",
      "rep.tab1": "Results", "rep.tab2": "Cash flow", "rep.tab3": "Margin",
      "rep.k1": "Net margin", "rep.k1v": "17.2%", "rep.k2": "Current ratio", "rep.k2v": "1.9x",
      "rep.k3": "Average collection period", "rep.k3v": "42 days",
      "rep.note": "Illustrative figures from a sample report.",
      "diag.q": "Want to know where your company really stands?", "diag.box": "Free diagnosis",
      "diag.1": "Diagnosis sheet", "diag.2": "Map of open issues", "diag.3": "Work plan",
      "diag.lead": "No commitment. You'll know where you stand and where to start.",
      "tools.eyebrow": "Tools", "tools.t1": "Run the numbers", "tools.t2": "before", "tools.t3": "you decide.",
      "tools.lead": "Free simulators for quick estimates. For a tailored analysis, talk to BEA.",
      "ins.eyebrow": "Insights", "ins.t1": "What you need to know,", "ins.t2": "straight to the point.",
      "ins.lead": "Practical notes from the BEA team on tax, financing and management in Angola.",
      "ins.more": "Key points", "ins.talk": "Talk about this",
      "faq.eyebrow": "FAQ", "faq.title": "Before you get in touch",
      "ct.eyebrow": "Contact", "ct.t1": "Talk to",
      "ct.lead": "Planning to invest, apply for credit or get your finances in order? Tell us what you need. We reply on WhatsApp.",
      "ct.phone": "Phone", "ct.how": "How it works",
      "ct.how1": "Send us your message through the form or WhatsApp.",
      "ct.how2": "We run the diagnosis: the company, its risks and its open issues.",
      "ct.how3": "You receive the work plan and a proposal tailored to your stage.",
      "ct.f.name": "Name", "ct.f.company": "Company", "ct.f.service": "Subject",
      "ct.f.msg": "How can we help?", "ct.f.msgPh": "Briefly tell us about your company's situation.",
      "ct.f.submit": "Send via WhatsApp", "ct.f.hint": "Opens WhatsApp with your message ready to send.",
      "ct.f.err": "Please enter your name so we can continue.",
      "ct.f.ok": "Opening WhatsApp with your message. If it didn't open,",
      "ct.f.okLink": "tap here.",
      "subj.start": "Get started", "subj.diag": "Free diagnosis", "subj.einv": "E-invoicing (readiness)",
      "subj.tiers": "Support levels", "subj.other": "Something else",
      "wa.default": "Hello BEA Consulting! I'd like to know more about your services.",
      "wa.hello": "Hello BEA Consulting!", "wa.me": "I'm {n}", "wa.co": " from {c}",
      "wa.subj": "I'd like to talk about: {s}.",
      "ftr.about": "Accounting, tax, audit, financial management, feasibility studies and access to credit, in Angola.",
      "ftr.services": "Services", "ftr.company": "BEA", "ftr.contact": "Talk to BEA",
      "ftr.rights": "All rights reserved.", "ftr.top": "Back to top ↑",
      "sim.calcNote": "Indicative estimate. For a rigorous, tailored analysis, talk to BEA.",
      "sim.years": "years", "sim.months": "months", "sim.unit": "/ unit",
      "chart.months": "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec"
    }
  };

  /* ---------------------------------------------------------
     2. CONTENT (from BEA's own materials)
     --------------------------------------------------------- */
  var PILLARS = [
    { id: "p1", range: "01—05",
      t: { pt: "Gestão Financeira", en: "Financial Management" },
      tag: { pt: "O dia-a-dia financeiro do seu negócio, sob controlo.", en: "Your business's day-to-day finances, under control." },
      items: [
        { id: "s01", t: { pt: "Gestão Financeira Contínua", en: "Ongoing Financial Management" },
          d: { pt: "Acompanhamento diário, semanal, mensal e trimestral: movimentos registados, caixa revista, fecho do mês e relatório de gestão.", en: "Daily, weekly, monthly and quarterly follow-up: transactions recorded, cash reviewed, month-end close and management report." } },
        { id: "s02", t: { pt: "Contabilidade Financeira (de Gestão)", en: "Financial (Management) Accounting" },
          d: { pt: "Contabilidade para decidir, não só para declarar: lançamentos por centro de custo, fecho mensal em data fixa e relatório com resultados, balanço e fluxo de caixa.", en: "Accounting to make decisions, not just to file: entries by cost centre, a fixed monthly close date and a report with results, balance sheet and cash flow." } },
        { id: "s03", t: { pt: "BPO Financeiro", en: "Finance BPO" },
          d: { pt: "Assumimos a operação financeira: contas a pagar e a receber, cobranças, facturação e lançamentos. Você aprova.", en: "We run your finance operations: payables and receivables, collections, invoicing and bookkeeping. You approve." } },
        { id: "s04", t: { pt: "Orçamentação e Projecções", en: "Budgeting and Forecasting" },
          d: { pt: "Orçamento e previsões de caixa, revistos com cenários a cada trimestre e acompanhados de um plano de acção.", en: "Budget and cash forecasts, reviewed against scenarios every quarter and backed by an action plan." } },
        { id: "s05", t: { pt: "Gestão de Projectos", en: "Project Management" },
          d: { pt: "Planeamento, calendário, responsáveis e controlo da execução dos seus projectos, do arranque ao fecho.", en: "Planning, schedule, owners and execution control for your projects, from kick-off to close." } }
      ] },
    { id: "p2", range: "06—08",
      t: { pt: "Análise & Financiamento", en: "Analysis & Financing" },
      tag: { pt: "Para decidir, crescer e financiar com segurança.", en: "To decide, grow and secure financing with confidence." },
      items: [
        { id: "s06", t: { pt: "Estudo de Viabilidade Económico-Financeiro", en: "Economic and Financial Feasibility Study" },
          d: { pt: "Relatório de viabilidade com VAL, TIR e período de recuperação, análise de sensibilidade e condições e gatilhos de decisão. Saiba antes de gastar o primeiro kwanza.", en: "Feasibility report with NPV, IRR and payback period, sensitivity analysis and decision conditions and triggers. Know before you spend the first kwanza." } },
        { id: "s07", t: { pt: "Análise Económica Sectorial", en: "Sector Economic Analysis" },
          d: { pt: "Contexto macro (câmbio, inflação e juros), estrutura sectorial, concorrência e regulação, mercado e procura.", en: "Macro context (FX, inflation and interest rates), sector structure, competition and regulation, market and demand." } },
        { id: "s08", t: { pt: "Apoio ao Acesso ao Crédito — Banca", en: "Bank Credit Access Support" },
          d: { pt: "Diagnóstico de elegibilidade, dossier de crédito (plano de negócios, modelo financeiro e capacidade de pagamento), lista de documentos e acompanhamento da análise do banco.", en: "Eligibility assessment, credit dossier (business plan, financial model and repayment capacity), document checklist and follow-up of the bank's review." } }
      ] },
    { id: "p3", range: "09—12",
      t: { pt: "Fiscalidade, Auditoria & Sistemas", en: "Tax, Audit & Systems" },
      tag: { pt: "Para operar com rigor e conformidade.", en: "To operate with rigour and compliance." },
      items: [
        { id: "s09", t: { pt: "Contabilidade Fiscal", en: "Tax Accounting" },
          d: { pt: "Calendário fiscal próprio, com prazos internos antes dos legais. Impostos apurados, declarados e pagos, com o comprovativo arquivado.", en: "A tax calendar of your own, with internal deadlines ahead of the legal ones. Taxes calculated, filed and paid, with proof of payment archived." } },
        { id: "s10", t: { pt: "Assessoria Jurídico-Tributária", en: "Tax and Legal Advisory" },
          d: { pt: "Recebeu uma notificação da AGT? Analisamos a origem e os documentos, preparamos a resposta ou a reclamação e acompanhamos até ao encerramento.", en: "Received a notice from AGT? We analyse its origin and the documents, prepare the reply or the appeal and follow through to closure." } },
        { id: "s11", t: { pt: "Implementação de Sistemas (ERP)", en: "Systems Implementation (ERP)" },
          d: { pt: "Escolha, configuração e arranque do ERP, com os processos de facturação preparados para a factura electrónica.", en: "Selection, set-up and go-live of your ERP, with invoicing processes ready for e-invoicing." } },
        { id: "s12", t: { pt: "Auditoria Externa", en: "External Audit" },
          d: { pt: "Mapeamos 8 processos (vendas, compras, caixa, bancos, salários, stocks, activos e impostos) e entregamos um plano de melhorias com prioridades, responsáveis e prazos.", en: "We map 8 processes (sales, purchases, cash, banks, payroll, inventory, fixed assets and taxes) and deliver an improvement plan with priorities, owners and deadlines." } }
      ] }
  ];

  var ROUTES = [
    { svc: "s10", open: "s10",
      q: { pt: "Recebeu uma notificação da AGT?", en: "Received a notice from AGT?" },
      a: { pt: "Respire. Analisamos a origem, preparamos a resposta ou a reclamação e acompanhamos até ao encerramento.", en: "Breathe. We analyse its origin, prepare the reply or the appeal and follow through to closure." } },
    { svc: "s08", open: "s08",
      q: { pt: "Vai pedir crédito ao banco?", en: "Applying for a bank loan?" },
      a: { pt: "Chegue ao banco com o dossier pronto: elegibilidade, plano de negócios, modelo financeiro e acompanhamento da análise.", en: "Walk into the bank with your dossier ready: eligibility, business plan, financial model and follow-up of the review." } },
    { svc: "s06", open: "s06",
      q: { pt: "Vale a pena investir?", en: "Is the investment worth it?" },
      a: { pt: "Saiba antes de gastar o primeiro kwanza: VAL, TIR, período de recuperação e análise de sensibilidade.", en: "Know before you spend the first kwanza: NPV, IRR, payback period and sensitivity analysis." } },
    { svc: "s12", open: "s12",
      q: { pt: "Onde está a perder dinheiro?", en: "Where is your company losing money?" },
      a: { pt: "Mapeamos 8 processos para encontrar erros, perdas ou irregularidades, e entregamos um plano de melhorias.", en: "We map 8 processes to find errors, losses or irregularities, and deliver an improvement plan." } },
    { svc: "s02", open: "s02",
      q: { pt: "A contabilidade só serve para declarar?", en: "Is your accounting only for filing?" },
      a: { pt: "Contabilidade para decidir: centros de custo, fecho mensal em data fixa e relatório de gestão.", en: "Accounting to make decisions: cost centres, a fixed monthly close date and a management report." } },
    { svc: "einv", open: "s11",
      q: { pt: "A factura electrónica chega a 1 de Janeiro de 2027.", en: "E-invoicing becomes mandatory on 1 January 2027." },
      a: { pt: "Preparamos sistemas e processos para cumprir a tempo, sem correrias de última hora.", en: "We get your systems and processes ready in time, without a last-minute rush." } }
  ];

  var METHOD = [
    { t: { pt: "Entrada do cliente", en: "Client onboarding" }, d: { pt: "Contrato, dados, documentação e âmbito", en: "Contract, data, documents and scope" } },
    { t: { pt: "Diagnóstico", en: "Diagnosis" }, d: { pt: "Conhecer a empresa, os riscos e as pendências", en: "Understanding the company, its risks and open issues" } },
    { t: { pt: "Planeamento", en: "Planning" }, d: { pt: "Calendário, responsáveis, prazos e recursos", en: "Calendar, owners, deadlines and resources" } },
    { t: { pt: "Execução", en: "Execution" }, d: { pt: "Tarefas previstas e recolha de evidência", en: "Planned tasks and evidence gathering" } },
    { t: { pt: "Revisão", en: "Review" }, d: { pt: "Controlo de qualidade dos pontos críticos", en: "Quality control of critical points" } },
    { t: { pt: "Comunicação", en: "Reporting" }, d: { pt: "Resultados, pendências e recomendações", en: "Results, open issues and recommendations" } },
    { t: { pt: "Arquivo", en: "Archiving" }, d: { pt: "Documentos e papéis de trabalho organizados", en: "Documents and working papers organised" } },
    { t: { pt: "Follow-up", en: "Follow-up" }, d: { pt: "Acompanhamento das pendências e melhorias", en: "Tracking open issues and improvements" } }
  ];

  var TIERS = [
    { id: "t1", n: { pt: "Nível 1", en: "Level 1" }, t: { pt: "Controlo", en: "Control" },
      d: { pt: "Reconciliações bancárias, relatório mensal de gestão e painel de indicadores. A sua equipa continua a operar.", en: "Bank reconciliations, a monthly management report and a KPI dashboard. Your team keeps running operations." } },
    { id: "t2", n: { pt: "Nível 2", en: "Level 2" }, t: { pt: "Operação", en: "Operations" },
      d: { pt: "Nível 1 + contas a pagar e a receber, cobranças, facturação e lançamentos. Você aprova.", en: "Level 1 + payables and receivables, collections, invoicing and bookkeeping. You approve." } },
    { id: "t3", top: true, n: { pt: "Nível 3", en: "Level 3" }, t: { pt: "Departamento financeiro externo", en: "Outsourced finance department" },
      d: { pt: "Nível 2 + previsão de caixa semanal, orçamento, relação com bancos e CFO a tempo parcial.", en: "Level 2 + weekly cash forecast, budget, bank relationships and a part-time CFO." } }
  ];

  var INSIGHTS = [
    { svc: "einv", cat: { pt: "Fiscalidade", en: "Tax" },
      t: { pt: "Factura electrónica obrigatória a 1 de Janeiro de 2027", en: "E-invoicing mandatory from 1 January 2027" },
      s: { pt: "Passa a ser obrigatória nos regimes geral e simplificado do IVA. A sua empresa está pronta?", en: "It becomes mandatory under the general and simplified VAT regimes. Is your company ready?" },
      pts: [{ pt: "Confirme em que regime de IVA está a sua empresa", en: "Confirm which VAT regime your company is in" },
            { pt: "Verifique se o seu sistema de facturação está preparado", en: "Check whether your invoicing system is ready" },
            { pt: "Prepare a equipa e os processos antes da data", en: "Get your team and processes ready before the date" }],
      k: { pt: "Preparamos sistemas e processos a tempo.", en: "We get systems and processes ready in time." } },
    { svc: "s06", cat: { pt: "Investimento", en: "Investment" },
      t: { pt: "Os 6 módulos de um estudo de viabilidade", en: "The 6 modules of a feasibility study" },
      s: { pt: "Um estudo montado à medida do seu projecto. Cada módulo produz uma parte do trabalho final.", en: "A study built around your project. Each module produces part of the final work." },
      pts: [{ pt: "A · Contexto macro: câmbio, inflação e juros", en: "A · Macro context: FX, inflation and interest rates" },
            { pt: "B · Estrutura sectorial: concorrência e regulação", en: "B · Sector structure: competition and regulation" },
            { pt: "C · Mercado e procura: segmentos e preços", en: "C · Market and demand: segments and pricing" },
            { pt: "D · Modelo financeiro: VAL, TIR e fluxo de caixa", en: "D · Financial model: NPV, IRR and cash flow" },
            { pt: "E · Risco: cenários e gatilhos", en: "E · Risk: scenarios and triggers" },
            { pt: "F · Enquadramento: licenças e incentivos", en: "F · Framework: licences and incentives" }],
      k: { pt: "Cada serviço usa os módulos de que precisa.", en: "Each service uses the modules it needs." } },
    { svc: "s12", cat: { pt: "Auditoria", en: "Audit" },
      t: { pt: "Onde é que a sua empresa está a perder dinheiro?", en: "Where is your company losing money?" },
      s: { pt: "Mapeamos 8 processos para encontrar onde podem surgir erros, perdas ou irregularidades.", en: "We map 8 processes to find where errors, losses or irregularities can arise." },
      pts: [{ pt: "Vendas e compras", en: "Sales and purchases" }, { pt: "Caixa e bancos", en: "Cash and banks" },
            { pt: "Salários", en: "Payroll" }, { pt: "Stocks e activos", en: "Inventory and fixed assets" }, { pt: "Impostos", en: "Taxes" }],
      k: { pt: "No fim, recebe um plano de melhorias com prioridades, responsáveis e prazos.", en: "At the end you get an improvement plan with priorities, owners and deadlines." } },
    { svc: "s02", cat: { pt: "Organização", en: "Organisation" },
      t: { pt: "Do caos ao controlo", en: "From chaos to control" },
      s: { pt: "Facturas num saco, extractos por conciliar, prazos só de cabeça? O primeiro passo é pôr tudo em ordem.", en: "Invoices in a bag, unreconciled statements, deadlines kept in your head? Step one is putting it all in order." },
      pts: [{ pt: "Pastas digitais organizadas por período", en: "Digital folders organised by period" },
            { pt: "Mapa dos documentos em falta", en: "A map of missing documents" },
            { pt: "Lista objectiva de pendências", en: "A clear list of open issues" }],
      k: { pt: "Contabilidade, fiscalidade e auditoria para micro e pequenas empresas.", en: "Accounting, tax and audit for micro and small businesses." } },
    { svc: "s08", cat: { pt: "Crédito", en: "Credit" },
      t: { pt: "Chegue ao banco com o dossier pronto", en: "Walk into the bank with your dossier ready" },
      s: { pt: "Um pedido de crédito bem preparado responde às perguntas do banco antes de elas surgirem.", en: "A well-prepared loan application answers the bank's questions before they're asked." },
      pts: [{ pt: "Diagnóstico de elegibilidade", en: "Eligibility assessment" },
            { pt: "Dossier de crédito: plano de negócios, modelo financeiro e capacidade de pagamento", en: "Credit dossier: business plan, financial model and repayment capacity" },
            { pt: "Lista de documentos", en: "Document checklist" },
            { pt: "Submissão e acompanhamento da análise do banco", en: "Submission and follow-up of the bank's review" }],
      k: { pt: "Acompanhamos a análise do banco.", en: "We follow the bank's review with you." } },
    { svc: "s10", cat: { pt: "Fiscalidade", en: "Tax" },
      t: { pt: "Recebeu uma notificação da AGT? Respire.", en: "Received a notice from AGT? Breathe." },
      s: { pt: "Três passos para tratar o assunto com calma e dentro do prazo.", en: "Three steps to handle it calmly and on time." },
      pts: [{ pt: "Analisamos a origem e os documentos", en: "We analyse the origin and the documents" },
            { pt: "Preparamos a resposta ou a reclamação", en: "We prepare the reply or the appeal" },
            { pt: "Acompanhamos até ao encerramento", en: "We follow through to closure" }],
      k: { pt: "Não deixe passar o prazo de resposta.", en: "Don't let the response deadline slip." } }
  ];

  var FAQ = [
    { q: { pt: "O diagnóstico é mesmo gratuito?", en: "Is the diagnosis really free?" },
      a: { pt: "Sim. Recebe uma ficha de diagnóstico, um mapa de pendências e um plano de trabalho, sem compromisso. Basta pedir pelo formulário ou pelo WhatsApp.", en: "Yes. You get a diagnosis sheet, a map of open issues and a work plan, with no commitment. Just ask through the form or on WhatsApp." } },
    { q: { pt: "Trabalham com micro e pequenas empresas?", en: "Do you work with micro and small businesses?" },
      a: { pt: "Sim. Fazemos contabilidade, fiscalidade e auditoria para micro e pequenas empresas, e estudos de viabilidade, acesso ao crédito e gestão financeira para empresas e investidores.", en: "Yes. We provide accounting, tax and audit for micro and small businesses, and feasibility studies, access to credit and financial management for companies and investors." } },
    { q: { pt: "Qual é a diferença entre os três níveis?", en: "What's the difference between the three levels?" },
      a: { pt: "Cada nível inclui o anterior. Controlo: reconciliações, relatório mensal e painel de indicadores. Operação: acrescenta contas a pagar e a receber, cobranças, facturação e lançamentos. Departamento financeiro externo: acrescenta previsão de caixa semanal, orçamento, relação com bancos e CFO a tempo parcial.", en: "Each level includes the previous one. Control: reconciliations, monthly report and KPI dashboard. Operations: adds payables and receivables, collections, invoicing and bookkeeping. Outsourced finance department: adds a weekly cash forecast, budget, bank relationships and a part-time CFO." } },
    { q: { pt: "Como garantem que não falham prazos fiscais?", en: "How do you make sure tax deadlines aren't missed?" },
      a: { pt: "Criamos um calendário fiscal só para a sua empresa, com prazos internos antes dos legais. E, para nós, uma obrigação só está cumprida quando o imposto está pago e o comprovativo arquivado.", en: "We build a tax calendar just for your company, with internal deadlines ahead of the legal ones. And for us, an obligation is only met when the tax is paid and the proof of payment is archived." } },
    { q: { pt: "A minha empresa está preparada para a factura electrónica?", en: "Is my company ready for e-invoicing?" },
      a: { pt: "A partir de 1 de Janeiro de 2027, a factura electrónica passa a ser obrigatória nos regimes geral e simplificado do IVA. Avaliamos os seus sistemas e processos e preparamos a transição.", en: "From 1 January 2027, e-invoicing becomes mandatory under the general and simplified VAT regimes. We assess your systems and processes and prepare the transition." } },
    { q: { pt: "Como é que enviamos os documentos?", en: "How do we send you documents?" },
      a: { pt: "Organizamos pastas digitais por período, com um mapa dos documentos em falta e uma lista objectiva de pendências. Sabe sempre o que falta enviar.", en: "We set up digital folders by period, with a map of missing documents and a clear list of open issues. You always know what's still needed." } },
    { q: { pt: "Quanto custa?", en: "How much does it cost?" },
      a: { pt: "Depende do âmbito e do nível de acompanhamento. Depois do diagnóstico gratuito, apresentamos uma proposta clara, à medida da sua fase.", en: "It depends on the scope and the level of support. After the free diagnosis, we present a clear proposal tailored to your stage." } }
  ];

  /* ---------------------------------------------------------
     3. HELPERS
     --------------------------------------------------------- */
  var lang = store.get("bea-lang") === "en" ? "en" : "pt";
  function t(k) { var d = I18N[lang]; return (d && d[k] != null) ? d[k] : (I18N.pt[k] != null ? I18N.pt[k] : k); }
  function L(o) { return o ? (o[lang] != null ? o[lang] : o.pt) : ""; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function locale() { return lang === "en" ? "en-GB" : "pt-PT"; }
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function allServices() {
    var out = [];
    PILLARS.forEach(function (p) { p.items.forEach(function (s) { out.push(s); }); });
    return out;
  }
  function serviceNumber(id) { return id.replace(/^s/, ""); }

  /* ---------------------------------------------------------
     4. RENDERERS
     --------------------------------------------------------- */
  function renderRouter() {
    $("#routerGrid").innerHTML = ROUTES.map(function (r, i) {
      return '<article class="card route reveal d' + (i % 3) + '">' +
        '<h3 class="route__q">' + esc(L(r.q)) + '</h3>' +
        '<p class="route__a">' + esc(L(r.a)) + '</p>' +
        '<div class="route__go">' +
          '<a href="#contacto" class="btn btn--teal btn--sm" data-service="' + r.svc + '">' + esc(t("router.help")) + '</a>' +
          '<button type="button" class="link" data-open-service="' + r.open + '">' + esc(t("router.see")) + ' ' + ARROW + '</button>' +
        '</div></article>';
    }).join("");
  }

  function renderPillars() {
    $("#pillars").innerHTML = PILLARS.map(function (p, i) {
      return '<article class="card pillar reveal d' + i + '" id="pilar-' + p.id + '">' +
        '<header class="pillar__head"><span class="pillar__range">' + p.range + '</span>' +
          '<h3 class="pillar__title">' + esc(L(p.t)) + '</h3><p class="pillar__tag">' + esc(L(p.tag)) + '</p></header>' +
        '<ul>' + p.items.map(function (s) {
          return '<li class="svc" data-id="' + s.id + '">' +
            '<button class="svc__btn" type="button" aria-expanded="false" aria-controls="svc-' + s.id + '">' +
              '<span class="svc__n">' + serviceNumber(s.id) + '</span><span class="svc__t">' + esc(L(s.t)) + '</span><span class="svc__plus" aria-hidden="true"></span>' +
            '</button>' +
            '<div class="svc__body" id="svc-' + s.id + '"><div class="svc__inner"><div>' +
              '<p class="svc__d">' + esc(L(s.d)) + '</p>' +
              '<a href="#contacto" class="btn btn--amber btn--sm" data-service="' + s.id + '">' + esc(t("svc.ask")) + '</a>' +
            '</div></div></div></li>';
        }).join("") + '</ul></article>';
    }).join("");
    $$("#pillars .svc__btn").forEach(function (btn) {
      btn.addEventListener("click", function () { toggleService(btn.closest(".svc")); });
    });
  }
  function toggleService(li, forceOpen) {
    if (!li) return;
    var open = forceOpen === true ? true : !li.classList.contains("is-open");
    li.classList.toggle("is-open", open);
    $(".svc__btn", li).setAttribute("aria-expanded", open ? "true" : "false");
  }
  function openService(id) {
    var li = $('.svc[data-id="' + id + '"]');
    if (!li) return;
    toggleService(li, true);
    li.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    li.classList.remove("is-flash"); void li.offsetWidth; li.classList.add("is-flash");
  }

  function renderMethod() {
    $("#methodList").innerHTML = METHOD.map(function (m, i) {
      return '<li class="method__item reveal"><span class="method__n">' + String(i + 1).padStart(2, "0") + '</span>' +
        '<div><h3>' + esc(L(m.t)) + '</h3><p>' + esc(L(m.d)) + '</p></div></li>';
    }).join("");
  }

  function renderTiers() {
    $("#tiers").innerHTML = TIERS.map(function (tr, i) {
      return '<article class="card tier reveal d' + i + (tr.top ? " tier--top" : "") + '">' +
        (tr.top ? '<span class="tier__flag">' + esc(t("tier.flag")) + '</span>' : "") +
        '<div class="tier__bar" aria-hidden="true"><i></i></div>' +
        '<h3 class="tier__name"><span class="tier__lvl">' + esc(L(tr.n)) + '</span>' + esc(L(tr.t)) + '</h3>' +
        '<p class="tier__d">' + esc(L(tr.d)) + '</p>' +
        '<a href="#contacto" class="btn ' + (tr.top ? "btn--teal" : "btn--outline") + ' btn--sm" data-service="' + tr.id + '">' + esc(t("tier.cta")) + '</a>' +
        '</article>';
    }).join("");
  }

  function renderInsights() {
    $("#insightsGrid").innerHTML = INSIGHTS.map(function (p, i) {
      return '<article class="card post reveal d' + (i % 3) + '"><div class="post__bar" aria-hidden="true"></div>' +
        '<div class="post__top"><span class="post__cat">' + esc(L(p.cat)) + '</span>' +
          '<h3 class="post__t">' + esc(L(p.t)) + '</h3><p class="post__s">' + esc(L(p.s)) + '</p></div>' +
        '<details class="post__more"><summary>' + esc(t("ins.more")) + ' ' + ARROW + '</summary>' +
          '<ul class="checks">' + p.pts.map(function (x) { return "<li>" + esc(L(x)) + "</li>"; }).join("") + '</ul>' +
          '<p class="post__kicker">' + esc(L(p.k)) + '</p>' +
          '<p style="margin-top:14px"><a href="#contacto" class="link" data-service="' + p.svc + '">' + esc(t("ins.talk")) + ' ' + ARROW + '</a></p>' +
        '</details></article>';
    }).join("");
  }

  function renderFaq() {
    $("#faqList").innerHTML = FAQ.map(function (f, i) {
      return '<div class="faq__item reveal">' +
        '<button class="faq__q" type="button" aria-expanded="false" aria-controls="faq-a' + i + '"><span>' + esc(L(f.q)) + '</span><span class="svc__plus" aria-hidden="true"></span></button>' +
        '<div class="faq__a" id="faq-a' + i + '"><div><p>' + esc(L(f.a)) + '</p></div></div></div>';
    }).join("");
    $$("#faqList .faq__item").forEach(function (item) {
      var btn = $(".faq__q", item);
      btn.addEventListener("click", function () {
        var open = !item.classList.contains("is-open");
        $$("#faqList .faq__item.is-open").forEach(function (o) {
          if (o !== item) { o.classList.remove("is-open"); $(".faq__q", o).setAttribute("aria-expanded", "false"); }
        });
        item.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  function renderSubjects() {
    var sel = $("#fService"); if (!sel) return;
    var keep = sel.value;
    var html = '<optgroup label="' + esc(t("subj.start")) + '">' +
      '<option value="diag">' + esc(t("subj.diag")) + '</option>' +
      '<option value="einv">' + esc(t("subj.einv")) + '</option></optgroup>';
    PILLARS.forEach(function (p) {
      html += '<optgroup label="' + esc(L(p.t)) + '">' + p.items.map(function (s) {
        return '<option value="' + s.id + '">' + serviceNumber(s.id) + " · " + esc(L(s.t)) + "</option>";
      }).join("") + "</optgroup>";
    });
    html += '<optgroup label="' + esc(t("subj.tiers")) + '">' + TIERS.map(function (tr) {
      return '<option value="' + tr.id + '">' + esc(L(tr.n)) + " · " + esc(L(tr.t)) + "</option>";
    }).join("") + "</optgroup>";
    html += '<option value="other">' + esc(t("subj.other")) + "</option>";
    sel.innerHTML = html;
    sel.value = keep || "diag";
    if (!sel.value) sel.value = "diag";
  }

  /* ---------------------------------------------------------
     5. MARKET TICKER (assets/data/market.json, updated daily)
     --------------------------------------------------------- */
  var DEFAULT_MARKET = {
    updatedAt: null,
    items: [
      { label: { pt: "USD/AOA", en: "USD/AOA" }, value: 918.76, dec: 2, chg: 0.16, chgType: "pct", dir: "bad" },
      { label: { pt: "EUR/AOA", en: "EUR/AOA" }, value: 1032.42, dec: 2, chg: 0.56, chgType: "pct", dir: "bad" },
      { label: { pt: "Inflação", en: "Inflation" }, value: 22.3, dec: 1, suf: "%", chg: -1.1, chgType: "pp", dir: "good" },
      { label: { pt: "Taxa Directora BNA", en: "BNA Policy Rate" }, value: 18.0, dec: 2, suf: "%", chg: 0, chgType: "pp", dir: "flat" },
      { label: { pt: "LUIBOR 3M", en: "LUIBOR 3M" }, value: 16.4, dec: 1, suf: "%", chg: -0.2, chgType: "abs", dir: "good" },
      { label: { pt: "Brent", en: "Brent" }, value: 102.56, dec: 2, pre: "USD ", chg: -0.94, chgType: "pct", dir: "down" },
      { label: { pt: "Ouro", en: "Gold" }, value: 4207.1, dec: 0, pre: "USD ", chg: 1.21, chgType: "pct", dir: "up" },
      { label: { pt: "Gás Natural", en: "Natural Gas" }, value: 3.29, dec: 2, pre: "USD ", chg: 2.24, chgType: "pct", dir: "up" }
    ]
  };
  var market = DEFAULT_MARKET;

  function fmtNum(v, dec) {
    return Number(v).toLocaleString(locale(), { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 });
  }
  function chgHtml(it) {
    if (it.chg == null || it.chg === 0) return "";
    var arrow = it.chg > 0 ? "▲" : "▼";
    var cls = (it.dir === "good" || it.dir === "up") ? "up" : (it.dir === "bad" || it.dir === "down") ? "down" : "flat";
    var a = Math.abs(it.chg), s;
    if (it.chgType === "pct") s = fmtNum(a, 1) + "%";
    else if (it.chgType === "pp") s = fmtNum(a, 1) + " p.p.";
    else s = fmtNum(a, a < 10 ? 1 : 0);
    return '<span class="chg ' + cls + '">' + arrow + " " + (it.chg > 0 ? "+" : "-") + s + "</span>";
  }
  function renderTicker() {
    var one = (market.items || []).map(function (it) {
      var label = it.label ? (it.label[lang] || it.label.pt) : "";
      var val = (it.pre || "") + fmtNum(it.value, it.dec || 0) + (it.suf || "");
      return '<span class="tick"><span class="k">' + esc(label) + '</span><span class="v">' + esc(val) + "</span>" + chgHtml(it) + "</span>";
    }).join("");
    $("#ticker").innerHTML = one + '<span aria-hidden="true" style="display:contents">' + one + "</span>";
    var upd = $("#intelUpd");
    if (upd) {
      if (!market.updatedAt) { upd.textContent = ""; }
      else {
        var d = new Date(market.updatedAt);
        upd.textContent = t("ticker.updated") + " " + new Intl.DateTimeFormat(locale(), { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(d);
      }
    }
  }
  function initMarket() {
    if (!window.fetch) return;
    fetch("assets/data/market.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { if (j && Array.isArray(j.items) && j.items.length) { market = j; renderTicker(); } })
      .catch(function () { /* keep fallback */ });
  }

  /* ---------------------------------------------------------
     6. REPORT CHART (illustrative)
     --------------------------------------------------------- */
  var SERIES = {
    growth: [42, 48, 45, 58, 55, 68, 66, 78, 82, 90, 95, 100],
    cash:   [30, 55, 40, 62, 48, 70, 52, 74, 60, 82, 68, 88],
    profit: [20, 26, 24, 32, 30, 38, 42, 40, 52, 58, 62, 70]
  };
  function seriesMeta(s) {
    if (s === "growth") return { v: "AOA 248M", p: "▲ " + fmtNum(18.4, 1) + "%" };
    if (s === "cash") return { v: "AOA 96M", p: "▲ " + fmtNum(12.1, 1) + "%" };
    return { v: fmtNum(17.2, 1) + "%", p: "▲ " + fmtNum(4.1, 1) + " p.p." };
  }
  var currentSeries = "growth";
  var CW = 640, CH = 240, CP = 16;
  function buildPath(vals) {
    var max = Math.max.apply(null, vals) * 1.12, min = Math.min.apply(null, vals) * 0.6;
    var stepX = (CW - CP * 2) / (vals.length - 1);
    var pts = vals.map(function (v, i) { return [CP + i * stepX, CH - CP - ((v - min) / (max - min)) * (CH - CP * 2)]; });
    var line = pts.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ");
    return { line: line, fill: line + " L" + (CW - CP) + "," + CH + " L" + CP + "," + CH + " Z", pts: pts };
  }
  function drawChart(series, animate) {
    currentSeries = series;
    var b = buildPath(SERIES[series]);
    var grid = $("#gridLines");
    if (grid && !grid.childNodes.length) {
      var g = "";
      for (var i = 1; i < 4; i++) { var y = (CH / 4) * i; g += '<line x1="0" x2="' + CW + '" y1="' + y + '" y2="' + y + '" stroke-dasharray="3 6" opacity=".6"/>'; }
      grid.innerHTML = g;
    }
    var lineEl = $("#chartLine"), fillEl = $("#chartFill");
    lineEl.setAttribute("d", b.line); fillEl.setAttribute("d", b.fill);
    var last = b.pts[b.pts.length - 1];
    $("#chartDots").innerHTML = '<circle cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="5.5" fill="#D4943A" stroke="var(--surface)" stroke-width="2.5"/>';
    if (animate && !reduceMotion && lineEl.getTotalLength) {
      var len = lineEl.getTotalLength();
      lineEl.style.transition = "none"; lineEl.style.strokeDasharray = len; lineEl.style.strokeDashoffset = len; fillEl.style.opacity = 0;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          lineEl.style.transition = "stroke-dashoffset 1.3s cubic-bezier(.16,1,.3,1)"; lineEl.style.strokeDashoffset = 0;
          fillEl.style.transition = "opacity .9s ease .3s"; fillEl.style.opacity = 1;
        });
      });
    }
    var m = seriesMeta(series);
    $("#dashValue").textContent = m.v; $("#dashPill").textContent = m.p;
    $("#chartX").innerHTML = t("chart.months").split(",").map(function (x) { return "<span>" + x + "</span>"; }).join("");
  }
  function initChart() {
    $$("#dashTabs .tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        $$("#dashTabs .tab").forEach(function (x) { x.classList.remove("is-active"); x.setAttribute("aria-selected", "false"); });
        tab.classList.add("is-active"); tab.setAttribute("aria-selected", "true");
        drawChart(tab.dataset.series, true);
      });
    });
    drawChart("growth", false);
    if (!("IntersectionObserver" in window)) return;
    var drawn = false;
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting && !drawn) { drawn = true; drawChart(currentSeries, true); obs.disconnect(); } });
    }, { threshold: 0.3 });
    obs.observe($("#relatorio"));
  }

  /* ---------------------------------------------------------
     7. SIMULATORS
     --------------------------------------------------------- */
  var SIM_ICON = {
    npv: '<path d="M4 20V4M4 20h16"/><path d="M7 15l4-5 3 3 5-7"/><path d="M16 6h3v3"/>',
    margin: '<path d="M19 5 5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>',
    breakeven: '<path d="M4 20 20 4"/><path d="M4 12h16"/><circle cx="12" cy="12" r="2.2"/>',
    loan: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6.5 9.5v5M17.5 9.5v5"/>',
    cash: '<path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    tax: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>'
  };
  var SIM_TXT = {
    pt: {
      npv: ["Vale a pena investir?", "Calcule o VAL, a TIR e o período de recuperação de um investimento com fluxos anuais constantes."],
      margin: ["Margem de lucro", "Descubra a margem bruta, a margem líquida e o markup do seu produto ou serviço."],
      breakeven: ["Ponto de equilíbrio", "Saiba quantas unidades precisa de vender para cobrir todos os custos fixos."],
      loan: ["Crédito bancário", "Estime a prestação mensal e o custo total de um financiamento."],
      cash: ["Fluxo de caixa", "Projecte o saldo de caixa a 12 meses a partir das entradas e saídas mensais."],
      tax: ["Imposto Industrial", "Estimativa do imposto sobre o lucro tributável, com a taxa que indicar."],
      f: { inv: "Investimento inicial", flow: "Fluxo de caixa anual", years: "Duração do projecto", rate: "Taxa de desconto",
           revenue: "Preço de venda / receita", cost: "Custo do produto ou serviço", opex: "Despesas operacionais",
           fixed: "Custos fixos mensais", price: "Preço por unidade", varcost: "Custo variável por unidade",
           amount: "Montante do crédito", arate: "Taxa de juro anual", term: "Prazo",
           inflow: "Entradas mensais", outflow: "Saídas mensais", open: "Saldo inicial",
           profit: "Lucro tributável", taxrate: "Taxa de imposto" },
      r: { npv: "VAL", irr: "TIR", payback: "Recuperação", gross: "Margem bruta", net: "Margem líquida", markup: "Markup",
           pr: "Lucro estimado", units: "Unidades a vender", brev: "Receita de equilíbrio", contrib: "Margem de contribuição",
           pay: "Prestação mensal", total: "Custo total", interest: "Juros totais", bal: "Saldo a 12 meses",
           monthly: "Variação mensal", runway: "Autonomia", taxv: "Imposto estimado", netp: "Lucro após imposto", eff: "Taxa efectiva" },
      yes: "Cria valor à taxa escolhida: o VAL é positivo.", no: "Não cria valor a esta taxa: reveja os pressupostos antes de avançar.",
      never: "não recupera", talk: "Falar com a BEA"
    },
    en: {
      npv: ["Is the investment worth it?", "Calculate the NPV, IRR and payback period of an investment with constant annual cash flows."],
      margin: ["Profit margin", "Find the gross margin, net margin and markup of your product or service."],
      breakeven: ["Break-even point", "Find out how many units you need to sell to cover all fixed costs."],
      loan: ["Bank loan", "Estimate the monthly instalment and the total cost of a loan."],
      cash: ["Cash flow", "Project your 12-month cash balance from monthly inflows and outflows."],
      tax: ["Corporate income tax", "Estimate the tax on taxable profit, at the rate you enter."],
      f: { inv: "Initial investment", flow: "Annual cash flow", years: "Project life", rate: "Discount rate",
           revenue: "Selling price / revenue", cost: "Cost of product or service", opex: "Operating expenses",
           fixed: "Monthly fixed costs", price: "Price per unit", varcost: "Variable cost per unit",
           amount: "Loan amount", arate: "Annual interest rate", term: "Term",
           inflow: "Monthly inflows", outflow: "Monthly outflows", open: "Opening balance",
           profit: "Taxable profit", taxrate: "Tax rate" },
      r: { npv: "NPV", irr: "IRR", payback: "Payback", gross: "Gross margin", net: "Net margin", markup: "Markup",
           pr: "Estimated profit", units: "Units to sell", brev: "Break-even revenue", contrib: "Contribution margin",
           pay: "Monthly instalment", total: "Total cost", interest: "Total interest", bal: "Balance in 12 months",
           monthly: "Monthly change", runway: "Runway", taxv: "Estimated tax", netp: "Profit after tax", eff: "Effective rate" },
      yes: "Creates value at the chosen rate: NPV is positive.", no: "Doesn't create value at this rate: review the assumptions before going ahead.",
      never: "not recovered", talk: "Talk to BEA"
    }
  };
  function ST() { return SIM_TXT[lang]; }
  function kz(v) { return fmtNum(Math.round(v), 0) + " Kz"; }
  function pct(v) { return fmtNum(v, 1) + "%"; }

  function npvAt(r, inv, flow, n) { var v = -inv; for (var y = 1; y <= n; y++) v += flow / Math.pow(1 + r, y); return v; }
  function irr(inv, flow, n) {
    var lo = -0.99, hi = 10, flo = npvAt(lo, inv, flow, n), fhi = npvAt(hi, inv, flow, n);
    if (flo * fhi > 0) return null;
    for (var i = 0; i < 200; i++) {
      var mid = (lo + hi) / 2, fm = npvAt(mid, inv, flow, n);
      if (Math.abs(fm) < 1e-6) return mid;
      if (flo * fm < 0) { hi = mid; } else { lo = mid; flo = fm; }
    }
    return (lo + hi) / 2;
  }

  var SIMS = {
    npv: { svc: "s06",
      fields: [["inv", 50000000, "Kz"], ["flow", 18000000, "Kz"], ["years", 5, "yr"], ["rate", 20, "%"]],
      calc: function (v) {
        var inv = v.inv || 0, flow = v.flow || 0, n = Math.max(1, Math.round(v.years || 1)), r = (v.rate || 0) / 100;
        var npv = npvAt(r, inv, flow, n), rr = irr(inv, flow, n);
        var pay = flow > 0 ? inv / flow : Infinity;
        var payTxt = isFinite(pay) && pay <= n ? fmtNum(pay, 1) + " " + t("sim.years") : ST().never;
        return { rows: [["npv", kz(npv), npv >= 0 ? "pos" : "neg"], ["irr", rr == null ? "—" : pct(rr * 100), rr != null && rr >= r ? "pos" : "neg"], ["payback", payTxt, ""]],
                 verdict: npv >= 0 ? ["pos", ST().yes] : ["neg", ST().no] };
      } },
    margin: { svc: "s02",
      fields: [["revenue", 100000, "Kz"], ["cost", 55000, "Kz"], ["opex", 15000, "Kz"]],
      calc: function (v) {
        var rev = v.revenue || 0, cost = v.cost || 0, opex = v.opex || 0;
        var gross = rev ? (rev - cost) / rev * 100 : 0, net = rev ? (rev - cost - opex) / rev * 100 : 0;
        var mk = cost ? (rev - cost) / cost * 100 : 0, pr = rev - cost - opex;
        return { rows: [["gross", pct(gross), gross >= 0 ? "pos" : "neg"], ["net", pct(net), net >= 0 ? "pos" : "neg"], ["markup", pct(mk), ""], ["pr", kz(pr), pr >= 0 ? "pos" : "neg"]] };
      } },
    breakeven: { svc: "s04",
      fields: [["fixed", 500000, "Kz"], ["price", 2500, "Kz"], ["varcost", 1500, "Kz"]],
      calc: function (v) {
        var c = (v.price || 0) - (v.varcost || 0), u = c > 0 ? (v.fixed || 0) / c : 0;
        return { rows: [["units", c > 0 ? fmtNum(Math.ceil(u), 0) : "—", c > 0 ? "pos" : "neg"], ["brev", c > 0 ? kz(Math.ceil(u) * (v.price || 0)) : "—", ""], ["contrib", kz(c) + " " + t("sim.unit"), c > 0 ? "pos" : "neg"]] };
      } },
    loan: { svc: "s08",
      fields: [["amount", 5000000, "Kz"], ["arate", 18, "%"], ["term", 36, "mo"]],
      calc: function (v) {
        var P = v.amount || 0, r = (v.arate || 0) / 1200, n = Math.max(1, Math.round(v.term || 1));
        var pay = r > 0 ? P * r / (1 - Math.pow(1 + r, -n)) : P / n, total = pay * n;
        return { rows: [["pay", kz(pay), ""], ["total", kz(total), ""], ["interest", kz(total - P), "neg"]] };
      } },
    cash: { svc: "s01",
      fields: [["inflow", 3000000, "Kz"], ["outflow", 2600000, "Kz"], ["open", 1500000, "Kz"]],
      calc: function (v) {
        var m = (v.inflow || 0) - (v.outflow || 0), bal = (v.open || 0) + m * 12;
        var run = m < 0 ? (v.open || 0) / -m : Infinity;
        return { rows: [["bal", kz(bal), bal >= 0 ? "pos" : "neg"], ["monthly", kz(m), m >= 0 ? "pos" : "neg"], ["runway", isFinite(run) ? fmtNum(run, 1) + " " + t("sim.months") : "∞", m >= 0 ? "pos" : "neg"]] };
      } },
    tax: { svc: "s09",
      fields: [["profit", 8000000, "Kz"], ["taxrate", 25, "%"]],
      calc: function (v) {
        var p = v.profit || 0, tx = Math.max(0, p) * (v.taxrate || 0) / 100;
        return { rows: [["taxv", kz(tx), "neg"], ["netp", kz(p - tx), p - tx >= 0 ? "pos" : "neg"], ["eff", pct(p > 0 ? tx / p * 100 : 0), ""]] };
      } }
  };
  var simState = {};
  var currentSim = "npv";
  function affix(code) { return code === "yr" ? t("sim.years") : code === "mo" ? t("sim.months") : code; }

  function renderSimMenu() {
    $("#simMenu").innerHTML = Object.keys(SIMS).map(function (k) {
      var on = k === currentSim;
      return '<button type="button" role="tab" aria-selected="' + on + '" data-sim="' + k + '" class="' + (on ? "is-active" : "") + '">' +
        '<span class="sim__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + SIM_ICON[k] + "</svg></span>" +
        "<span>" + esc(ST()[k][0]) + "</span></button>";
    }).join("");
    $$("#simMenu button").forEach(function (b) {
      b.addEventListener("click", function () { currentSim = b.dataset.sim; renderSimMenu(); renderSimPanel(); });
    });
  }
  function renderSimPanel() {
    var sim = SIMS[currentSim], st = simState[currentSim] || (simState[currentSim] = {});
    $("#simPanel").innerHTML = "<h3>" + esc(ST()[currentSim][0]) + '</h3><p class="sim__desc">' + esc(ST()[currentSim][1]) + "</p>" +
      '<div class="sim__form">' + sim.fields.map(function (f) {
        var val = st[f[0]] != null ? st[f[0]] : f[1];
        return '<div class="field"><label for="sim_' + f[0] + '">' + esc(ST().f[f[0]]) + "</label>" +
          '<div class="field__w"><input id="sim_' + f[0] + '" type="number" inputmode="decimal" min="0" step="any" value="' + val + '" data-key="' + f[0] + '">' +
          '<span class="field__aff">' + esc(affix(f[2])) + "</span></div>" +
          (f[2] === "Kz" ? '<span class="field__echo" data-echo="' + f[0] + '" aria-hidden="true"></span>' : "") + "</div>";
      }).join("") + "</div>" +
      '<div class="sim__result" id="simResult" aria-live="polite"></div>';
    var inputs = $$("#simPanel input");
    function run() {
      var v = {};
      inputs.forEach(function (i) {
        v[i.dataset.key] = parseFloat(i.value) || 0; st[i.dataset.key] = i.value;
        var echo = $('[data-echo="' + i.dataset.key + '"]', $("#simPanel"));
        if (echo) echo.textContent = i.value === "" ? "" : kz(v[i.dataset.key]);
      });
      var res = sim.calc(v);
      $("#simResult").innerHTML = res.rows.map(function (r) {
        return '<div class="sim__r"><small>' + esc(ST().r[r[0]]) + '</small><b class="' + r[2] + '">' + esc(r[1]) + "</b></div>";
      }).join("") +
        (res.verdict ? '<p class="sim__verdict ' + res.verdict[0] + '">' + esc(res.verdict[1]) + "</p>" : "") +
        '<p class="sim__note"><span>' + esc(t("sim.calcNote")) + '</span><a href="#contacto" class="btn btn--amber" data-service="' + sim.svc + '">' + esc(ST().talk) + "</a></p>";
    }
    inputs.forEach(function (i) { i.addEventListener("input", run); });
    run();
  }

  /* ---------------------------------------------------------
     8. CONTACT → WhatsApp
     --------------------------------------------------------- */
  function waLink(text) { return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text); }
  function updateWaLinks() { $$("[data-wa]").forEach(function (a) { a.setAttribute("href", waLink(t("wa.default"))); }); }

  function preselect(id) {
    var sel = $("#fService");
    if (!sel || !id) return;
    var ok = Array.prototype.some.call(sel.options, function (o) { return o.value === id; });
    if (ok) sel.value = id;
  }
  function focusName() {
    if (!finePointer) return;
    setTimeout(function () { var n = $("#fName"); if (n) n.focus({ preventScroll: true }); }, reduceMotion ? 0 : 650);
  }

  function initContact() {
    var form = $("#contactForm"), msg = $("#formMsg");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#fName").value.trim();
      if (!name) {
        msg.className = "form__msg is-err"; msg.textContent = t("ct.f.err");
        $("#fName").setAttribute("aria-invalid", "true"); $("#fName").focus();
        return;
      }
      $("#fName").removeAttribute("aria-invalid");
      var company = $("#fCompany").value.trim(), note = $("#fMsg").value.trim();
      var sel = $("#fService"), subject = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : t("subj.diag");
      var lines = [t("wa.hello"), t("wa.me").replace("{n}", name) + (company ? t("wa.co").replace("{c}", company) : "") + ".", t("wa.subj").replace("{s}", subject)];
      if (note) lines.push("", note);
      var url = waLink(lines.join("\n"));
      msg.className = "form__msg is-ok";
      msg.innerHTML = esc(t("ct.f.ok")) + ' <a href="' + url + '" target="_blank" rel="noopener" style="text-decoration:underline">' + esc(t("ct.f.okLink")) + "</a>";
      try { window.open(url, "_blank", "noopener"); } catch (err) { /* link above is the fallback */ }
    });
  }

  /* Any [data-service] CTA preselects the subject; [data-open-service] opens the service row. */
  function initRouting() {
    document.addEventListener("click", function (e) {
      var s = e.target.closest("[data-service]");
      if (s) {
        preselect(s.getAttribute("data-service"));
        if (s.tagName === "BUTTON") { $("#contacto").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); }
        focusName();
      }
      var o = e.target.closest("[data-open-service]");
      if (o) { e.preventDefault(); openService(o.getAttribute("data-open-service")); }
    });
  }

  /* ---------------------------------------------------------
     9. E-INVOICE COUNTDOWN (1 Jan 2027, 00:00 WAT = UTC+1)
     --------------------------------------------------------- */
  function initEinv() {
    var target = Date.UTC(2026, 11, 31, 23, 0, 0);
    var days = Math.ceil((target - Date.now()) / 86400000);
    if (days > 0) {
      $("#einvDays").textContent = days;
      var lbl = $("#einvCount [data-i18n]"); if (lbl) lbl.setAttribute("data-i18n", days === 1 ? "einv.day" : "einv.days");
    } else {
      $("#einvCount").hidden = true;
      $("#einv-date").setAttribute("data-i18n", "einv.dateAfter");
      $("#einvText").setAttribute("data-i18n", "einv.textAfter");
    }
  }

  /* ---------------------------------------------------------
     10. i18n APPLY + RE-RENDER
     --------------------------------------------------------- */
  function applyI18n() {
    document.documentElement.lang = lang === "en" ? "en" : "pt";
    document.title = t("doc.title");
    $$("[data-i18n]").forEach(function (el) { var v = I18N[lang][el.getAttribute("data-i18n")]; if (v != null) el.textContent = v; });
    $$("[data-i18n-ph]").forEach(function (el) { var v = I18N[lang][el.getAttribute("data-i18n-ph")]; if (v != null) el.setAttribute("placeholder", v); });
    $$("[data-i18n-aria]").forEach(function (el) { var v = I18N[lang][el.getAttribute("data-i18n-aria")]; if (v != null) el.setAttribute("aria-label", v); });
    $("#langCode").textContent = lang === "pt" ? "EN" : "PT";
    updateWaLinks();
  }
  function renderAll() {
    renderRouter(); renderPillars(); renderMethod(); renderTiers(); renderInsights(); renderFaq();
    renderSubjects(); renderTicker(); renderSimMenu(); renderSimPanel();
    drawChart(currentSeries, false);
  }

  /* ---------------------------------------------------------
     11. CHROME: header, drawer, theme, reveal, counters
     --------------------------------------------------------- */
  var revealObs = null;
  function initReveal() {
    var els = $$(".reveal:not(.in)");
    if (reduceMotion || !("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    if (!revealObs) {
      revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); revealObs.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    }
    els.forEach(function (e) { revealObs.observe(e); });
  }

  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (reduceMotion) { el.textContent = fmtNum(target, 0); return; }
    var start = performance.now(), dur = 1300;
    (function step(now) {
      var p = Math.min((now - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmtNum(Math.round(target * eased), 0);
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }
  function initCounters() {
    var els = $$("[data-count]");
    if (!("IntersectionObserver" in window)) return;
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { animateCount(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.6 });
    els.forEach(function (el) { obs.observe(el); });
  }

  function initHeader() {
    var hdr = $("#hdr"), top = $("#toTop");
    function onScroll() {
      var y = window.scrollY;
      hdr.classList.toggle("is-solid", y > 24);
      top.classList.toggle("is-on", y > 900);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); });

    if (!("IntersectionObserver" in window)) return;
    var links = $$(".nav a"), map = {};
    links.forEach(function (l) { map[l.getAttribute("href").slice(1)] = l; });
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("is-active"); l.removeAttribute("aria-current"); });
          var l = map[e.target.id]; if (l) { l.classList.add("is-active"); l.setAttribute("aria-current", "true"); }
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) obs.observe(s); });
  }

  function initDrawer() {
    var drawer = $("#drawer"), toggle = $("#navToggle");
    function open() {
      drawer.classList.add("is-open"); toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      var c = $(".drawer__head .ibtn", drawer); if (c) setTimeout(function () { c.focus(); }, 50);
    }
    function close() {
      if (!drawer.classList.contains("is-open")) return;
      drawer.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = ""; toggle.focus({ preventScroll: true });
    }
    toggle.addEventListener("click", open);
    $$("[data-close]", drawer).forEach(function (el) { el.addEventListener("click", close); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  function initTheme() {
    var root = document.documentElement;
    if (!root.getAttribute("data-theme")) {
      root.setAttribute("data-theme", window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
    $("#themeBtn").addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      store.set("bea-theme", next);
    });
  }

  function initLang() {
    $("#langBtn").addEventListener("click", function () {
      lang = lang === "pt" ? "en" : "pt";
      store.set("bea-lang", lang);
      renderAll(); applyI18n(); initReveal();
      $$(".reveal").forEach(function (e) { if (e.getBoundingClientRect().top < window.innerHeight) e.classList.add("in"); });
    });
  }

  function initHeroViz() {
    var viz = $("#heroViz"); if (!viz) return;
    setTimeout(function () { viz.classList.add("is-on"); }, reduceMotion ? 0 : 200);
  }

  /* ---------------------------------------------------------
     12. BOOT
     --------------------------------------------------------- */
  function boot() {
    window.__bea = true;
    $("#year").textContent = new Date().getFullYear();
    initEinv();
    renderAll();
    applyI18n();
    initTheme(); initLang(); initHeader(); initDrawer();
    initContact(); initRouting(); initChart();
    initReveal(); initCounters(); initHeroViz(); initMarket();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

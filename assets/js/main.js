/* =============================================================
   ANEVA — main.js · interactions, i18n, charts, simulators
   Vanilla JS, no dependencies.
   ============================================================= */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Safe storage — alguns contextos (modo privado, iframes sandbox) bloqueiam localStorage.
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignora */ } }
  };

  /* ---------------------------------------------------------
     0. DATA  (bilingual)
     --------------------------------------------------------- */
  const ICON = {
    book: '<path d="M4 5a2 2 0 0 1 2-2h11v16H6a2 2 0 0 0-2 2z"/><path d="M17 3v16"/>',
    chart: '<path d="M4 19V5M4 19h16"/><path d="M8 15l3-4 3 2 4-6"/>',
    tax: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    audit: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4-4"/><path d="M8 11l2 2 4-4"/>',
    build: '<path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/>',
    restruct: '<path d="M3 7h13l-3-3M21 17H8l3 3"/>',
    plan: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4M8 14h3M8 18h6"/>',
    treasury: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    bi: '<path d="M4 20V4M4 20h16"/><rect x="7" y="11" width="3" height="6"/><rect x="12" y="7" width="3" height="10"/><rect x="17" y="13" width="3" height="4"/>',
    control: '<circle cx="12" cy="12" r="9"/><path d="M12 12l4-2M12 7v5"/>',
    payroll: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="12" r="2.5"/><path d="M15 10h3M15 14h3"/>',
    dd: '<path d="M14 3v5h5"/><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M9 13l2 2 4-4"/>',
    valuation: '<path d="M12 2v20M7 5h7a3 3 0 0 1 0 6H7m0 0h8a3 3 0 0 1 0 6H6"/>',
    strategy: '<circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M9 15 15 9"/><path d="M18 3v3M21 6h-3"/>',
    risk: '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17h.01"/>',
    compliance: '<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/><path d="M9 12l2 2 4-4"/>',
    finance: '<path d="M3 12a9 9 0 0 1 9-9M21 12a9 9 0 0 1-9 9"/><path d="M12 7v5l3 3"/>',
    calc: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h2M12 10h2M16 10h.01M8 14h2M12 14h2M16 14h.01M8 18h6"/>',
    cashflow: '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    loan: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5A2.5 2 0 0 1 12 8c1.4 0 2.5.7 2.5 1.6M14.5 14.4A2.5 2 0 0 1 12 16c-1.4 0-2.5-.7-2.5-1.6"/>',
    break: '<path d="M4 20 20 4M4 8l4-4M16 20l4-4"/><circle cx="12" cy="12" r="2"/>',
    margin: '<path d="M4 20V4M4 20h16"/><path d="M7 16l4-6 3 3 5-8"/>',
    ebook: '<path d="M4 5a2 2 0 0 1 2-2h11v16H6a2 2 0 0 0-2 2z"/><path d="M9 7h5M9 11h5"/>',
    guide: '<path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="M3 8v6l9 5 9-5V8"/>',
    check: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    template: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>'
  };

  const I18N = {
    pt: {
      "skip": "Saltar para o conteúdo",
      "nav.services": "Serviços", "nav.about": "Sobre", "nav.process": "Método", "nav.tools": "Ferramentas",
      "nav.results": "Resultados", "nav.cases": "Casos", "nav.blog": "Insights", "nav.resources": "Recursos", "nav.contact": "Contacto",
      "cta.book": "Agendar Consultoria", "cta.services": "Conhecer os Serviços",
      "hero.badge": "Centro de Inteligência Financeira · Angola & África",
      "hero.title1": "Transformamos números em", "hero.title2": "decisões que fazem empresas crescer.",
      "hero.lead": "Na ANEVA ajudamos empresas a organizar as suas finanças, aumentar a rentabilidade, reduzir riscos e construir crescimento sustentável através de soluções inteligentes de consultoria financeira e empresarial.",
      "hero.trust": "A confiança de empresários em toda Angola",
      "hero.panel.title": "Desempenho consolidado", "hero.panel.m1": "Rentabilidade", "hero.panel.m2": "Liquidez", "hero.panel.m3": "Eficiência",
      "stat.companies": "Empresas apoiadas", "stat.satisfaction": "Clientes satisfeitos", "stat.volume": "USD em operações acompanhadas", "stat.years": "Anos de experiência",
      "intel.tag": "Centro de Inteligência", "intel.updated": "Atualizado",
      "dash.eyebrow": "Painel de Inteligência Financeira", "dash.title": "Veja as suas finanças com clareza absoluta",
      "dash.lead": "Transformamos dados dispersos em indicadores vivos que orientam cada decisão. Uma amostra ilustrativa da inteligência que entregamos aos nossos clientes.",
      "dash.live": "Demonstração ilustrativa", "dash.tab1": "Crescimento", "dash.tab2": "Fluxo de Caixa", "dash.tab3": "Rentabilidade",
      "dash.health": "Saúde Financeira", "dash.liquidity": "Liquidez", "dash.solvency": "Solvência", "dash.efficiency": "Eficiência",
      "dash.indicators": "Indicadores-chave", "dash.rentab": "Rentabilidade", "dash.liq2": "Liquidez", "dash.effi": "Eficiência", "dash.growth2": "Crescimento",
      "about.eyebrow": "Sobre a ANEVA", "about.title": "A inteligência financeira que impulsiona empresas africanas.",
      "about.p": "Na ANEVA acreditamos que uma empresa organizada financeiramente toma melhores decisões, cresce mais rapidamente e cria maior valor para a economia. Combinamos rigor técnico, tecnologia e proximidade para transformar a forma como as empresas angolanas gerem o seu futuro.",
      "about.quote": "“Onde a inteligência financeira encontra o crescimento empresarial.”",
      "about.mission": "Missão", "about.mission.d": "Capacitar empresas a tomar decisões financeiras melhores, com dados, estratégia e execução rigorosa.",
      "about.vision": "Visão", "about.vision.d": "Ser a consultora financeira de referência em Angola e uma marca respeitada em toda a África.",
      "about.values": "Valores", "about.values.d": "Rigor, confidencialidade, inovação e compromisso absoluto com o sucesso do cliente.",
      "about.purpose": "Propósito", "about.purpose.d": "Impulsionar o crescimento económico africano, uma empresa bem gerida de cada vez.",
      "about.commit": "Compromisso", "about.commit.d": "Entregamos resultados mensuráveis e uma parceria de longo prazo com cada cliente.",
      "serv.eyebrow": "Serviços", "serv.title": "Soluções completas para cada fase do seu negócio",
      "serv.lead": "Uma equipa multidisciplinar que cobre todo o ciclo financeiro — da contabilidade diária à estratégia de crescimento.",
      "serv.more": "Saber mais",
      "why.eyebrow": "Porquê a ANEVA", "why.title": "Uma parceira à altura das suas ambições",
      "proc.eyebrow": "Como Trabalhamos", "proc.title": "Um método claro, do diagnóstico ao resultado",
      "res.eyebrow": "Resultados", "res.title": "Números que traduzem confiança",
      "res.r1": "Empresas atendidas", "res.r2": "Projetos realizados", "res.r3": "Horas de consultoria", "res.r4": "Valor movimentado", "res.r5": "Clientes fidelizados",
      "case.eyebrow": "Casos de Sucesso", "case.title": "Transformações reais, resultados mensuráveis",
      "case.lead": "Exemplos ilustrativos do impacto que a inteligência financeira gera nas empresas que acompanhamos.",
      "case.problem": "Desafio", "case.solution": "Solução", "case.result": "Resultado", "case.before": "Antes", "case.after": "Depois",
      "sim.eyebrow": "Ferramentas Interativas", "sim.title": "Simuladores financeiros gratuitos",
      "sim.lead": "Experimente as nossas ferramentas e obtenha estimativas instantâneas. Para uma análise completa, fale com a nossa equipa.",
      "blog.eyebrow": "Insights & Análises", "blog.title": "O pulso do mercado, explicado", "blog.all": "Ver todas as análises", "blog.read": "Ler análise",
      "res2.eyebrow": "Centro de Recursos", "res2.title": "Materiais gratuitos para decidir melhor", "res2.free": "Gratuito", "res2.get": "Descarregar",
      "faq.eyebrow": "Perguntas Frequentes", "faq.title": "Tudo o que precisa de saber",
      "ct.eyebrow": "Contacto", "ct.title": "Vamos construir o próximo capítulo do seu crescimento",
      "ct.lead": "Agende uma consultoria inicial sem compromisso. Respondemos em menos de 24 horas úteis.",
      "ct.phone": "Telefone", "ct.email": "Email", "ct.addr": "Escritório",
      "ct.f.name": "Nome", "ct.f.company": "Empresa", "ct.f.email": "Email", "ct.f.phone": "Telefone",
      "ct.f.service": "Serviço de interesse", "ct.f.opt0": "Selecione um serviço", "ct.f.other": "Outro",
      "ct.f.msg": "Como podemos ajudar?", "ct.f.msg.ph": "Descreva brevemente o seu desafio...",
      "ct.f.submit": "Agendar Consultoria", "ct.f.wa": "Falar no WhatsApp", "ct.f.ok": "Pedido enviado! A nossa equipa entrará em contacto em breve.",
      "foot.about": "Consultoria de finanças, contabilidade, fiscalidade e gestão estratégica. Onde a inteligência financeira encontra o crescimento empresarial.",
      "foot.services": "Serviços", "foot.company": "Empresa", "foot.news": "Newsletter",
      "foot.news.d": "Receba insights de finanças e do mercado angolano na sua caixa de entrada.", "foot.news.ok": "Subscrição confirmada. Obrigado!",
      "foot.rights": "Todos os direitos reservados.", "foot.privacy": "Política de Privacidade", "foot.terms": "Termos", "foot.cookies": "Cookies",
      // Services
      "serv.s1.t": "Contabilidade", "serv.s1.d": "Contabilidade organizada, rigorosa e alinhada com o SNC-AO, sempre pronta para decidir.",
      "serv.s2.t": "Consultoria Financeira", "serv.s2.d": "Análise, orçamentação e apoio à decisão para maximizar a rentabilidade.",
      "serv.s3.t": "Fiscalidade", "serv.s3.d": "Otimização e conformidade fiscal, minimizando riscos e cargas desnecessárias.",
      "serv.s4.t": "Auditoria", "serv.s4.d": "Auditoria independente que fortalece a confiança e a transparência.",
      "serv.s5.t": "Constituição de Empresas", "serv.s5.d": "Do registo à operação, criamos a sua empresa com bases sólidas.",
      "serv.s6.t": "Reestruturação Financeira", "serv.s6.d": "Recuperamos o equilíbrio e a saúde financeira de empresas em desafio.",
      "serv.s7.t": "Planeamento Financeiro", "serv.s7.d": "Projeções, cenários e planos que antecipam o futuro do seu negócio.",
      "serv.s8.t": "Tesouraria", "serv.s8.d": "Gestão inteligente de caixa e liquidez para nunca faltar fôlego.",
      "serv.s9.t": "Business Intelligence", "serv.s9.d": "Dashboards e dados que transformam informação em vantagem competitiva.",
      "serv.s10.t": "Controlo de Gestão", "serv.s10.d": "Indicadores e controlo orçamental para manter a rota estratégica.",
      "serv.s11.t": "Payroll", "serv.s11.d": "Processamento salarial rigoroso, pontual e em total conformidade.",
      "serv.s12.t": "Due Diligence", "serv.s12.d": "Análises aprofundadas que protegem investimentos e negociações.",
      "serv.s13.t": "Avaliação de Empresas", "serv.s13.d": "Determinamos o valor real do seu negócio com metodologias reconhecidas.",
      "serv.s14.t": "Consultoria Estratégica", "serv.s14.d": "Estratégia orientada por dados para crescer com consistência.",
      "serv.s15.t": "Gestão de Riscos", "serv.s15.d": "Identificamos, medimos e mitigamos os riscos do seu negócio.",
      "serv.s16.t": "Compliance", "serv.s16.d": "Conformidade regulatória que protege a reputação e o futuro da empresa.",
      // Why
      "why.1.t": "Decisões baseadas em dados", "why.1.d": "Cada recomendação assenta em análise rigorosa, não em intuição.",
      "why.2.t": "Especialistas multidisciplinares", "why.2.d": "Finanças, fiscalidade, auditoria e estratégia numa só equipa.",
      "why.3.t": "Atendimento personalizado", "why.3.d": "Soluções desenhadas à medida da realidade de cada cliente.",
      "why.4.t": "Confidencialidade absoluta", "why.4.d": "Os seus dados tratados com o mais alto padrão de segurança.",
      "why.5.t": "Tecnologia aplicada às finanças", "why.5.d": "Ferramentas modernas que aceleram e clarificam a gestão.",
      "why.6.t": "Adaptação ao mercado angolano", "why.6.d": "Conhecimento profundo da realidade fiscal e económica local.",
      "why.7.t": "Visão internacional", "why.7.d": "Padrões globais aplicados com ambição pan-africana.",
      // Process
      "proc.1.t": "Diagnóstico", "proc.1.d": "Analisamos a fundo a sua realidade financeira e operacional.",
      "proc.2.t": "Planeamento", "proc.2.d": "Definimos objetivos claros e um plano de ação priorizado.",
      "proc.3.t": "Estratégia", "proc.3.d": "Desenhamos a estratégia financeira que maximiza valor.",
      "proc.4.t": "Implementação", "proc.4.d": "Executamos com rigor, ao seu lado, cada iniciativa.",
      "proc.5.t": "Acompanhamento", "proc.5.d": "Monitorizamos indicadores e ajustamos em contínuo.",
      // FAQ
      "faq.1.q": "Que tipo de empresas acompanham?", "faq.1.a": "Trabalhamos com PME, grandes empresas e empreendedores em toda Angola, de vários setores. Adaptamos a nossa abordagem à dimensão e à fase de cada negócio.",
      "faq.2.q": "Como funciona a primeira consultoria?", "faq.2.a": "A primeira sessão é um diagnóstico sem compromisso, onde entendemos os seus desafios e objetivos e apresentamos como podemos ajudar. Basta agendar através do formulário ou WhatsApp.",
      "faq.3.q": "Os meus dados estão seguros?", "faq.3.a": "Sim. A confidencialidade é um pilar da ANEVA. Todos os dados são tratados com protocolos rigorosos de segurança e sigilo profissional.",
      "faq.4.q": "Trabalham com contabilidade e consultoria em simultâneo?", "faq.4.a": "Sim. A nossa força está precisamente em integrar contabilidade, fiscalidade, auditoria e estratégia numa única visão coerente do seu negócio.",
      "faq.5.q": "Atendem clientes fora de Luanda?", "faq.5.a": "Sim. Servimos clientes em todo o território nacional, presencialmente e através de ferramentas digitais, com visão de expansão para outros mercados africanos.",
      "faq.6.q": "Quais são os honorários?", "faq.6.a": "Os honorários dependem do âmbito e da complexidade de cada projeto. Após o diagnóstico inicial apresentamos uma proposta transparente e adaptada às suas necessidades.",
      // Simulators
      "sim.margin.t": "Margem de Lucro", "sim.margin.d": "Descubra a margem bruta, líquida e o markup do seu produto ou serviço.",
      "sim.break.t": "Ponto de Equilíbrio", "sim.break.d": "Saiba quantas unidades precisa de vender para cobrir todos os custos.",
      "sim.loan.t": "Simulador de Empréstimos", "sim.loan.d": "Calcule a prestação mensal e o custo total de um financiamento.",
      "sim.cash.t": "Fluxo de Caixa", "sim.cash.d": "Projete o saldo de caixa a partir das suas entradas e saídas.",
      "sim.tax.t": "Simulador Fiscal", "sim.tax.d": "Estimativa ilustrativa de imposto sobre o lucro (valores indicativos).",
      "sim.f.revenue": "Receita / Preço de venda", "sim.f.cost": "Custo do produto/serviço", "sim.f.opex": "Despesas operacionais",
      "sim.f.fixed": "Custos fixos mensais", "sim.f.price": "Preço por unidade", "sim.f.varcost": "Custo variável por unidade",
      "sim.f.amount": "Valor do financiamento", "sim.f.rate": "Taxa de juro anual", "sim.f.term": "Prazo (meses)",
      "sim.f.in": "Entradas mensais", "sim.f.out": "Saídas mensais", "sim.f.open": "Saldo inicial",
      "sim.f.profit": "Lucro tributável", "sim.f.taxrate": "Taxa de imposto",
      "sim.r.gross": "Margem bruta", "sim.r.net": "Margem líquida", "sim.r.markup": "Markup", "sim.r.profit": "Lucro estimado",
      "sim.r.units": "Unidades no equilíbrio", "sim.r.revenue": "Receita no equilíbrio", "sim.r.contrib": "Margem de contribuição",
      "sim.r.payment": "Prestação mensal", "sim.r.total": "Custo total", "sim.r.interest": "Juros totais",
      "sim.r.balance": "Saldo projetado (12m)", "sim.r.monthly": "Variação mensal", "sim.r.runway": "Autonomia",
      "sim.r.tax": "Imposto estimado", "sim.r.netprofit": "Lucro líquido", "sim.r.effrate": "Taxa efetiva",
      "sim.note": "Resultados ilustrativos. Para uma análise rigorosa e personalizada, contacte a ANEVA.",
      "sim.months": "meses", "sim.calc": "Calcular",
      // Blog
      "blog.1.c": "Mercado Angolano", "blog.1.t": "Kwanza e inflação: como proteger a margem da sua empresa em 2026", "blog.1.d": "Estratégias práticas de cobertura cambial e gestão de custos num contexto de volatilidade.",
      "blog.2.c": "Fiscalidade", "blog.2.t": "IVA em Angola: erros que custam caro às PME (e como evitá-los)", "blog.2.d": "Um guia claro sobre conformidade, prazos e oportunidades de otimização legal.",
      "blog.3.c": "Investimentos", "blog.3.t": "Como avaliar se o seu próximo investimento vale mesmo a pena", "blog.3.d": "VAL, TIR e payback explicados de forma simples, com exemplos aplicáveis ao seu negócio.",
      "blog.4.c": "PME", "blog.4.t": "Fluxo de caixa: o indicador que decide a sobrevivência da sua empresa", "blog.4.d": "Porque empresas lucrativas fecham por falta de liquidez — e como prevenir.",
      "blog.5.c": "Empreendedorismo", "blog.5.t": "Constituir uma empresa em Angola: o guia financeiro completo", "blog.5.d": "Do capital social à estrutura fiscal ideal para começar com bases sólidas.",
      "blog.6.c": "Grandes Empresas", "blog.6.t": "Business Intelligence: transforme dados financeiros em vantagem", "blog.6.d": "Como dashboards em tempo real aceleram decisões nas grandes organizações.",
      "blog.min": "min de leitura",
      // Resources
      "res.1.t": "eBook: Gestão Financeira para PME", "res.1.d": "Guia essencial para organizar as finanças da sua empresa.", "res.1.k": "eBook",
      "res.2.t": "Guia Fiscal Angola 2026", "res.2.d": "Principais impostos, prazos e obrigações num único documento.", "res.2.k": "Guia",
      "res.3.t": "Checklist de Fecho Mensal", "res.3.d": "Nunca mais esqueça um passo no encerramento contabilístico.", "res.3.k": "Checklist",
      "res.4.t": "Modelo de Orçamento Anual", "res.4.d": "Template pronto a usar para planear o próximo exercício.", "res.4.k": "Modelo",
      "res.5.t": "Calculadora de Indicadores", "res.5.d": "Meça liquidez, rentabilidade e solvência em segundos.", "res.5.k": "Ferramenta"
    },
    en: {
      "skip": "Skip to content",
      "nav.services": "Services", "nav.about": "About", "nav.process": "Method", "nav.tools": "Tools",
      "nav.results": "Results", "nav.cases": "Cases", "nav.blog": "Insights", "nav.resources": "Resources", "nav.contact": "Contact",
      "cta.book": "Book a Consultation", "cta.services": "Explore our Services",
      "hero.badge": "Financial Intelligence Center · Angola & Africa",
      "hero.title1": "We turn numbers into", "hero.title2": "decisions that make companies grow.",
      "hero.lead": "At ANEVA we help companies organise their finances, increase profitability, reduce risk and build sustainable growth through intelligent financial and business advisory solutions.",
      "hero.trust": "Trusted by entrepreneurs across Angola",
      "hero.panel.title": "Consolidated performance", "hero.panel.m1": "Profitability", "hero.panel.m2": "Liquidity", "hero.panel.m3": "Efficiency",
      "stat.companies": "Companies supported", "stat.satisfaction": "Satisfied clients", "stat.volume": "USD in operations advised", "stat.years": "Years of experience",
      "intel.tag": "Intelligence Center", "intel.updated": "Updated",
      "dash.eyebrow": "Financial Intelligence Panel", "dash.title": "See your finances with absolute clarity",
      "dash.lead": "We turn scattered data into living indicators that guide every decision. An illustrative sample of the intelligence we deliver to our clients.",
      "dash.live": "Illustrative demo", "dash.tab1": "Growth", "dash.tab2": "Cash Flow", "dash.tab3": "Profitability",
      "dash.health": "Financial Health", "dash.liquidity": "Liquidity", "dash.solvency": "Solvency", "dash.efficiency": "Efficiency",
      "dash.indicators": "Key indicators", "dash.rentab": "Profitability", "dash.liq2": "Liquidity", "dash.effi": "Efficiency", "dash.growth2": "Growth",
      "about.eyebrow": "About ANEVA", "about.title": "The financial intelligence that powers African companies.",
      "about.p": "At ANEVA we believe a financially organised company makes better decisions, grows faster and creates greater value for the economy. We combine technical rigour, technology and closeness to transform how Angolan companies manage their future.",
      "about.quote": "“Where financial intelligence meets business growth.”",
      "about.mission": "Mission", "about.mission.d": "Empower companies to make better financial decisions with data, strategy and rigorous execution.",
      "about.vision": "Vision", "about.vision.d": "To be the reference financial consultancy in Angola and a respected brand across Africa.",
      "about.values": "Values", "about.values.d": "Rigour, confidentiality, innovation and absolute commitment to client success.",
      "about.purpose": "Purpose", "about.purpose.d": "Drive African economic growth, one well-managed company at a time.",
      "about.commit": "Commitment", "about.commit.d": "We deliver measurable results and a long-term partnership with every client.",
      "serv.eyebrow": "Services", "serv.title": "Complete solutions for every stage of your business",
      "serv.lead": "A multidisciplinary team covering the entire financial cycle — from daily accounting to growth strategy.",
      "serv.more": "Learn more",
      "why.eyebrow": "Why ANEVA", "why.title": "A partner worthy of your ambitions",
      "proc.eyebrow": "How We Work", "proc.title": "A clear method, from diagnosis to results",
      "res.eyebrow": "Results", "res.title": "Numbers that translate trust",
      "res.r1": "Companies served", "res.r2": "Projects delivered", "res.r3": "Consulting hours", "res.r4": "Value handled", "res.r5": "Retained clients",
      "case.eyebrow": "Success Stories", "case.title": "Real transformations, measurable results",
      "case.lead": "Illustrative examples of the impact financial intelligence generates for the companies we support.",
      "case.problem": "Challenge", "case.solution": "Solution", "case.result": "Result", "case.before": "Before", "case.after": "After",
      "sim.eyebrow": "Interactive Tools", "sim.title": "Free financial simulators",
      "sim.lead": "Try our tools and get instant estimates. For a complete analysis, talk to our team.",
      "blog.eyebrow": "Insights & Analysis", "blog.title": "The pulse of the market, explained", "blog.all": "See all analyses", "blog.read": "Read analysis",
      "res2.eyebrow": "Resource Center", "res2.title": "Free materials to decide better", "res2.free": "Free", "res2.get": "Download",
      "faq.eyebrow": "Frequently Asked Questions", "faq.title": "Everything you need to know",
      "ct.eyebrow": "Contact", "ct.title": "Let's build the next chapter of your growth",
      "ct.lead": "Book an initial no-commitment consultation. We reply within 24 business hours.",
      "ct.phone": "Phone", "ct.email": "Email", "ct.addr": "Office",
      "ct.f.name": "Name", "ct.f.company": "Company", "ct.f.email": "Email", "ct.f.phone": "Phone",
      "ct.f.service": "Service of interest", "ct.f.opt0": "Select a service", "ct.f.other": "Other",
      "ct.f.msg": "How can we help?", "ct.f.msg.ph": "Briefly describe your challenge...",
      "ct.f.submit": "Book a Consultation", "ct.f.wa": "Chat on WhatsApp", "ct.f.ok": "Request sent! Our team will contact you shortly.",
      "foot.about": "Finance, accounting, tax and strategic management consultancy. Where financial intelligence meets business growth.",
      "foot.services": "Services", "foot.company": "Company", "foot.news": "Newsletter",
      "foot.news.d": "Get finance and Angolan market insights in your inbox.", "foot.news.ok": "Subscription confirmed. Thank you!",
      "foot.rights": "All rights reserved.", "foot.privacy": "Privacy Policy", "foot.terms": "Terms", "foot.cookies": "Cookies",
      "serv.s1.t": "Accounting", "serv.s1.d": "Organised, rigorous accounting aligned with SNC-AO, always ready for decisions.",
      "serv.s2.t": "Financial Advisory", "serv.s2.d": "Analysis, budgeting and decision support to maximise profitability.",
      "serv.s3.t": "Taxation", "serv.s3.d": "Tax optimisation and compliance, minimising risk and unnecessary burden.",
      "serv.s4.t": "Audit", "serv.s4.d": "Independent audit that strengthens trust and transparency.",
      "serv.s5.t": "Company Formation", "serv.s5.d": "From registration to operation, we build your company on solid foundations.",
      "serv.s6.t": "Financial Restructuring", "serv.s6.d": "We restore balance and financial health to companies in difficulty.",
      "serv.s7.t": "Financial Planning", "serv.s7.d": "Projections, scenarios and plans that anticipate your business future.",
      "serv.s8.t": "Treasury", "serv.s8.d": "Smart cash and liquidity management so you never run short.",
      "serv.s9.t": "Business Intelligence", "serv.s9.d": "Dashboards and data that turn information into competitive advantage.",
      "serv.s10.t": "Management Control", "serv.s10.d": "Indicators and budget control to stay on your strategic course.",
      "serv.s11.t": "Payroll", "serv.s11.d": "Accurate, punctual and fully compliant payroll processing.",
      "serv.s12.t": "Due Diligence", "serv.s12.d": "In-depth analysis that protects investments and negotiations.",
      "serv.s13.t": "Business Valuation", "serv.s13.d": "We determine the real value of your business with recognised methodologies.",
      "serv.s14.t": "Strategic Consulting", "serv.s14.d": "Data-driven strategy to grow with consistency.",
      "serv.s15.t": "Risk Management", "serv.s15.d": "We identify, measure and mitigate your business risks.",
      "serv.s16.t": "Compliance", "serv.s16.d": "Regulatory compliance that protects reputation and the company's future.",
      "why.1.t": "Data-driven decisions", "why.1.d": "Every recommendation rests on rigorous analysis, not intuition.",
      "why.2.t": "Multidisciplinary experts", "why.2.d": "Finance, tax, audit and strategy in a single team.",
      "why.3.t": "Personalised service", "why.3.d": "Solutions tailored to each client's reality.",
      "why.4.t": "Absolute confidentiality", "why.4.d": "Your data handled to the highest security standard.",
      "why.5.t": "Technology applied to finance", "why.5.d": "Modern tools that speed up and clarify management.",
      "why.6.t": "Adapted to the Angolan market", "why.6.d": "Deep knowledge of the local tax and economic reality.",
      "why.7.t": "International vision", "why.7.d": "Global standards applied with pan-African ambition.",
      "proc.1.t": "Diagnosis", "proc.1.d": "We deeply analyse your financial and operational reality.",
      "proc.2.t": "Planning", "proc.2.d": "We define clear objectives and a prioritised action plan.",
      "proc.3.t": "Strategy", "proc.3.d": "We design the financial strategy that maximises value.",
      "proc.4.t": "Implementation", "proc.4.d": "We execute every initiative rigorously, by your side.",
      "proc.5.t": "Monitoring", "proc.5.d": "We track indicators and adjust continuously.",
      "faq.1.q": "What kind of companies do you support?", "faq.1.a": "We work with SMEs, large companies and entrepreneurs across Angola in various sectors. We adapt our approach to the size and stage of each business.",
      "faq.2.q": "How does the first consultation work?", "faq.2.a": "The first session is a no-commitment diagnosis where we understand your challenges and goals and show how we can help. Simply book via the form or WhatsApp.",
      "faq.3.q": "Is my data safe?", "faq.3.a": "Yes. Confidentiality is a pillar of ANEVA. All data is handled with strict security protocols and professional secrecy.",
      "faq.4.q": "Do you handle accounting and consulting together?", "faq.4.a": "Yes. Our strength lies precisely in integrating accounting, tax, audit and strategy into a single coherent view of your business.",
      "faq.5.q": "Do you serve clients outside Luanda?", "faq.5.a": "Yes. We serve clients nationwide, in person and through digital tools, with a vision to expand into other African markets.",
      "faq.6.q": "What are your fees?", "faq.6.a": "Fees depend on the scope and complexity of each project. After the initial diagnosis we present a transparent proposal tailored to your needs.",
      "sim.margin.t": "Profit Margin", "sim.margin.d": "Find the gross, net margin and markup of your product or service.",
      "sim.break.t": "Break-even Point", "sim.break.d": "Know how many units you must sell to cover all costs.",
      "sim.loan.t": "Loan Simulator", "sim.loan.d": "Calculate the monthly payment and total cost of a loan.",
      "sim.cash.t": "Cash Flow", "sim.cash.d": "Project your cash balance from inflows and outflows.",
      "sim.tax.t": "Tax Simulator", "sim.tax.d": "Illustrative estimate of profit tax (indicative values).",
      "sim.f.revenue": "Revenue / Selling price", "sim.f.cost": "Product/service cost", "sim.f.opex": "Operating expenses",
      "sim.f.fixed": "Monthly fixed costs", "sim.f.price": "Price per unit", "sim.f.varcost": "Variable cost per unit",
      "sim.f.amount": "Loan amount", "sim.f.rate": "Annual interest rate", "sim.f.term": "Term (months)",
      "sim.f.in": "Monthly inflows", "sim.f.out": "Monthly outflows", "sim.f.open": "Opening balance",
      "sim.f.profit": "Taxable profit", "sim.f.taxrate": "Tax rate",
      "sim.r.gross": "Gross margin", "sim.r.net": "Net margin", "sim.r.markup": "Markup", "sim.r.profit": "Estimated profit",
      "sim.r.units": "Break-even units", "sim.r.revenue": "Break-even revenue", "sim.r.contrib": "Contribution margin",
      "sim.r.payment": "Monthly payment", "sim.r.total": "Total cost", "sim.r.interest": "Total interest",
      "sim.r.balance": "Projected balance (12m)", "sim.r.monthly": "Monthly change", "sim.r.runway": "Runway",
      "sim.r.tax": "Estimated tax", "sim.r.netprofit": "Net profit", "sim.r.effrate": "Effective rate",
      "sim.note": "Illustrative results. For a rigorous, tailored analysis, contact ANEVA.",
      "sim.months": "months", "sim.calc": "Calculate",
      "blog.1.c": "Angolan Market", "blog.1.t": "Kwanza and inflation: how to protect your company's margin in 2026", "blog.1.d": "Practical hedging and cost-management strategies in a volatile context.",
      "blog.2.c": "Taxation", "blog.2.t": "VAT in Angola: costly mistakes for SMEs (and how to avoid them)", "blog.2.d": "A clear guide to compliance, deadlines and legal optimisation opportunities.",
      "blog.3.c": "Investments", "blog.3.t": "How to assess whether your next investment is really worth it", "blog.3.d": "NPV, IRR and payback explained simply, with examples for your business.",
      "blog.4.c": "SME", "blog.4.t": "Cash flow: the indicator that decides your company's survival", "blog.4.d": "Why profitable companies close for lack of liquidity — and how to prevent it.",
      "blog.5.c": "Entrepreneurship", "blog.5.t": "Starting a company in Angola: the complete financial guide", "blog.5.d": "From share capital to the ideal tax structure to start on solid ground.",
      "blog.6.c": "Large Enterprises", "blog.6.t": "Business Intelligence: turn financial data into advantage", "blog.6.d": "How real-time dashboards accelerate decisions in large organisations.",
      "blog.min": "min read",
      "res.1.t": "eBook: Financial Management for SMEs", "res.1.d": "Essential guide to organise your company's finances.", "res.1.k": "eBook",
      "res.2.t": "Angola Tax Guide 2026", "res.2.d": "Main taxes, deadlines and obligations in a single document.", "res.2.k": "Guide",
      "res.3.t": "Monthly Close Checklist", "res.3.d": "Never miss a step in your accounting close again.", "res.3.k": "Checklist",
      "res.4.t": "Annual Budget Template", "res.4.d": "Ready-to-use template to plan the next fiscal year.", "res.4.k": "Template",
      "res.5.t": "Indicators Calculator", "res.5.d": "Measure liquidity, profitability and solvency in seconds.", "res.5.k": "Tool"
    }
  };

  let lang = store.get("aneva-lang") || "pt";
  const t = (k) => (I18N[lang] && I18N[lang][k]) || (I18N.pt[k]) || k;

  /* ---------------------------------------------------------
     1. RENDER dynamic content
     --------------------------------------------------------- */
  const svg = (paths) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

  const services = [
    ["s1", "book"], ["s2", "chart"], ["s3", "tax"], ["s4", "audit"],
    ["s5", "build"], ["s6", "restruct"], ["s7", "plan"], ["s8", "treasury"],
    ["s9", "bi"], ["s10", "control"], ["s11", "payroll"], ["s12", "dd"],
    ["s13", "valuation"], ["s14", "strategy"], ["s15", "risk"], ["s16", "compliance"]
  ];
  function renderServices() {
    $("#servicesGrid").innerHTML = services.map(([k, ic], i) => `
      <article class="service card reveal d${(i % 4) + 1}">
        <div class="ic">${svg(ICON[ic])}</div>
        <h3 data-i18n="serv.${k}.t">${t("serv." + k + ".t")}</h3>
        <p data-i18n="serv.${k}.d">${t("serv." + k + ".d")}</p>
        <a href="#contacto" class="link-arrow"><span data-i18n="serv.more">${t("serv.more")}</span> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      </article>`).join("");
  }

  function renderWhy() {
    const items = [1, 2, 3, 4, 5, 6, 7];
    $("#whyGrid").innerHTML = items.map((n, i) => `
      <div class="why-item card reveal d${(i % 4) + 1}">
        <span class="n">${String(n).padStart(2, "0")}</span>
        <div><h3 data-i18n="why.${n}.t">${t("why." + n + ".t")}</h3><p data-i18n="why.${n}.d">${t("why." + n + ".d")}</p></div>
      </div>`).join("");
  }

  function renderTimeline() {
    const steps = [1, 2, 3, 4, 5];
    $("#timeline").innerHTML = steps.map((n, i) => `
      <div class="step reveal d${i + 1}">
        <div class="node">${n}</div>
        <h3 data-i18n="proc.${n}.t">${t("proc." + n + ".t")}</h3>
        <p data-i18n="proc.${n}.d">${t("proc." + n + ".d")}</p>
      </div>`).join("");
  }

  const cases = [
    { sector: "Retalho · Luanda", name: "Rede de Distribuição", bk: "Margem", bv: "6%", av: "17%", pr: "case.problem", so: "case.solution", re: "case.result",
      p: { pt: "Margens erodidas e ausência de controlo de custos.", en: "Eroded margins and no cost control." },
      s: { pt: "Reestruturação de custos e painel de indicadores.", en: "Cost restructuring and an indicators dashboard." },
      r: { pt: "Margem líquida triplicou em 9 meses.", en: "Net margin tripled in 9 months." } },
    { sector: "Indústria · Benguela", name: "Unidade Fabril", bk: "Liquidez", bv: "0,8x", av: "1,9x", pr: "case.problem", so: "case.solution", re: "case.result",
      p: { pt: "Tesouraria em rutura e dívida crescente.", en: "Cash crunch and rising debt." },
      s: { pt: "Plano de tesouraria e renegociação de crédito.", en: "Treasury plan and credit renegotiation." },
      r: { pt: "Liquidez recuperada e caixa positivo.", en: "Liquidity restored and positive cash." } },
    { sector: "Serviços · Nacional", name: "Grupo de Serviços", bk: "Eficiência", bv: "61%", av: "92%", pr: "case.problem", so: "case.solution", re: "case.result",
      p: { pt: "Decisões sem dados fiáveis e reporte lento.", en: "Decisions without reliable data and slow reporting." },
      s: { pt: "Implementação de BI e controlo de gestão.", en: "BI implementation and management control." },
      r: { pt: "Reporte em tempo real e +31% de eficiência.", en: "Real-time reporting and +31% efficiency." } }
  ];
  function renderCases() {
    $("#casesGrid").innerHTML = cases.map((c, i) => `
      <article class="case card reveal d${(i % 3) + 1}">
        <div class="case__top">
          <span class="case__sector">${c.sector}</span>
          <h3>${c.name}</h3>
          <div class="case__ba">
            <div class="cell"><small data-i18n="case.before">${t("case.before")}</small><b>${c.bv}</b></div>
            <span class="arw">→</span>
            <div class="cell after"><small data-i18n="case.after">${t("case.after")}</small><b>${c.av}</b></div>
          </div>
        </div>
        <div class="case__body">
          <div class="row"><span class="k" data-i18n="case.problem">${t("case.problem")}</span><span class="v">${c.p[lang] || c.p.pt}</span></div>
          <div class="row"><span class="k" data-i18n="case.solution">${t("case.solution")}</span><span class="v">${c.s[lang] || c.s.pt}</span></div>
          <div class="row"><span class="k" data-i18n="case.result">${t("case.result")}</span><span class="v">${c.r[lang] || c.r.pt}</span></div>
        </div>
      </article>`).join("");
  }

  const blog = [
    { n: 1, ic: "chart", min: 6 }, { n: 2, ic: "tax", min: 5 }, { n: 3, ic: "valuation", min: 7 },
    { n: 4, ic: "cashflow", min: 4 }, { n: 5, ic: "build", min: 8 }, { n: 6, ic: "bi", min: 6 }
  ];
  const gradients = [
    ["#0b1f3a", "#274a80"], ["#12294a", "#a9863f"], ["#1b3660", "#0b1f3a"],
    ["#274a80", "#12294a"], ["#0b1f3a", "#a9863f"], ["#12294a", "#1b3660"]
  ];
  function renderBlog() {
    $("#blogGrid").innerHTML = blog.map((b, i) => {
      const [g1, g2] = gradients[i % gradients.length];
      return `
      <article class="post card reveal d${(i % 3) + 1}">
        <div class="post__media">
          <span class="post__cat" data-i18n="blog.${b.n}.c">${t("blog." + b.n + ".c")}</span>
          <div class="g" style="background:linear-gradient(135deg,${g1},${g2})">
            <svg viewBox="0 0 320 180" preserveAspectRatio="none" style="width:100%;height:100%;opacity:.35">
              <path d="M0 140 L40 120 L80 128 L120 96 L160 104 L200 70 L240 84 L280 50 L320 40" fill="none" stroke="#d8bd82" stroke-width="2.5"/>
              <path d="M0 140 L40 120 L80 128 L120 96 L160 104 L200 70 L240 84 L280 50 L320 40 L320 180 L0 180Z" fill="#ffffff" opacity=".08"/>
            </svg>
          </div>
        </div>
        <div class="post__body">
          <span class="post__meta">${b.min} <span data-i18n="blog.min">${t("blog.min")}</span> · ANEVA</span>
          <h3 data-i18n="blog.${b.n}.t">${t("blog." + b.n + ".t")}</h3>
          <p data-i18n="blog.${b.n}.d">${t("blog." + b.n + ".d")}</p>
          <a href="#blog" class="link-arrow"><span data-i18n="blog.read">${t("blog.read")}</span> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
        </div>
      </article>`;
    }).join("");
  }

  const resources = [
    { n: 1, ic: "ebook" }, { n: 2, ic: "guide" }, { n: 3, ic: "check" }, { n: 4, ic: "template" }, { n: 5, ic: "calc" }
  ];
  function renderResources() {
    $("#resourcesGrid").innerHTML = resources.map((r, i) => `
      <article class="res card reveal d${(i % 4) + 1}">
        <div class="ic">${svg(ICON[r.ic])}</div>
        <span class="tag" data-i18n="res.${r.n}.k">${t("res." + r.n + ".k")}</span>
        <h3 data-i18n="res.${r.n}.t">${t("res." + r.n + ".t")}</h3>
        <p data-i18n="res.${r.n}.d">${t("res." + r.n + ".d")}</p>
        <a href="#contacto" class="link-arrow"><span data-i18n="res2.get">${t("res2.get")}</span> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg></a>
      </article>`).join("");
  }

  function renderFaq() {
    const items = [1, 2, 3, 4, 5, 6];
    $("#faqWrap").innerHTML = items.map((n, i) => `
      <div class="faq reveal d${(i % 3) + 1}">
        <button class="faq__q" aria-expanded="false"><span data-i18n="faq.${n}.q">${t("faq." + n + ".q")}</span><span class="plus" aria-hidden="true"></span></button>
        <div class="faq__a"><p data-i18n="faq.${n}.a">${t("faq." + n + ".a")}</p></div>
      </div>`).join("");
    $$("#faqWrap .faq").forEach((f) => {
      const btn = $(".faq__q", f), ans = $(".faq__a", f);
      btn.addEventListener("click", () => {
        const open = f.classList.toggle("open");
        btn.setAttribute("aria-expanded", open);
        ans.style.maxHeight = open ? ans.scrollHeight + "px" : 0;
        $$("#faqWrap .faq").forEach((o) => {
          if (o !== f && o.classList.contains("open")) { o.classList.remove("open"); $(".faq__q", o).setAttribute("aria-expanded", false); $(".faq__a", o).style.maxHeight = 0; }
        });
      });
    });
  }

  /* ---------------------------------------------------------
     2. TICKER (Financial Intelligence Center — illustrative)
     --------------------------------------------------------- */
  // Fallback usado se assets/data/market.json não carregar (valores ilustrativos).
  const DEFAULT_MARKET = {
    updatedAt: null,
    items: [
      { label: { pt: "USD/AOA", en: "USD/AOA" }, value: 925.02, dec: 2, chg: 0.4, chgType: "pct", dir: "bad" },
      { label: { pt: "EUR/AOA", en: "EUR/AOA" }, value: 1058.07, dec: 2, chg: 0.2, chgType: "pct", dir: "bad" },
      { label: { pt: "Inflação", en: "Inflation" }, value: 22.3, dec: 1, suf: "%", chg: -1.1, chgType: "pp", dir: "good" },
      { label: { pt: "Taxa Diretora BNA", en: "BNA Policy Rate" }, value: 18.0, dec: 2, suf: "%", chg: 0, chgType: "pp", dir: "flat" },
      { label: { pt: "LUIBOR 3M", en: "LUIBOR 3M" }, value: 16.4, dec: 1, suf: "%", chg: -0.2, chgType: "abs", dir: "good" },
      { label: { pt: "Brent", en: "Brent" }, value: 72.13, dec: 2, pre: "USD ", chg: -1.4, chgType: "pct", dir: "down" },
      { label: { pt: "WTI", en: "WTI" }, value: 68.78, dec: 2, pre: "USD ", chg: -2.8, chgType: "pct", dir: "down" },
      { label: { pt: "Ouro", en: "Gold" }, value: 4187, dec: 0, pre: "USD ", chg: 4.1, chgType: "pct", dir: "up" },
      { label: { pt: "Gás Natural", en: "Natural Gas" }, value: 3.25, dec: 2, pre: "USD ", chg: 2.0, chgType: "pct", dir: "up" },
      { label: { pt: "BODIVA · Dívida Pública", en: "BODIVA · Public Debt" }, value: 1284, dec: 0, chg: 0.9, chgType: "pct", dir: "up" }
    ]
  };
  let market = DEFAULT_MARKET;

  function fmtNum(v, dec) {
    return Number(v).toLocaleString(lang === "en" ? "en-US" : "pt-PT", { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 });
  }
  function chgHtml(it) {
    if (it.chg == null || it.chg === 0) return "";
    const arrow = it.chg > 0 ? "▲" : it.chg < 0 ? "▼" : "•";
    const cls = (it.dir === "good" || it.dir === "up") ? "up" : (it.dir === "bad" || it.dir === "down") ? "down" : "flat";
    const a = Math.abs(it.chg);
    let s;
    if (it.chgType === "pct") s = fmtNum(a, 1) + "%";
    else if (it.chgType === "pp") s = fmtNum(a, 1) + " p.p.";
    else s = fmtNum(a, a < 10 ? 1 : 0);
    const sign = it.chg > 0 ? "+" : it.chg < 0 ? "-" : "";
    return `<span class="chg ${cls}">${arrow} ${sign}${s}</span>`;
  }
  function updateIntelStamp() {
    const el = $("#intelUpd"); if (!el) return;
    if (!market.updatedAt) { el.textContent = ""; return; }
    const d = new Date(market.updatedAt);
    const df = new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "pt-PT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(d);
    el.innerHTML = `<span class="dotb"></span>${t("intel.updated")} ${df}`;
  }
  function renderTicker() {
    const items = market.items || [];
    const one = items.map((it) => {
      const label = (it.label && (it.label[lang] || it.label.pt)) || "";
      const val = (it.pre || "") + fmtNum(it.value, it.dec || 0) + (it.suf || "");
      return `<span class="tick"><span class="k">${label}</span><span class="v">${val}</span>${chgHtml(it)}</span>`;
    }).join("");
    $("#ticker").innerHTML = one + one;
    updateIntelStamp();
  }
  async function initMarket() {
    try {
      const res = await fetch("assets/data/market.json", { cache: "no-cache" });
      if (!res.ok) return;
      const j = await res.json();
      if (j && Array.isArray(j.items) && j.items.length) { market = j; renderTicker(); }
    } catch (e) { /* mantém o fallback ilustrativo */ }
  }

  /* ---------------------------------------------------------
     3. CHART (dashboard)
     --------------------------------------------------------- */
  const SERIES = {
    growth: [42, 48, 45, 58, 55, 68, 66, 78, 82, 90, 95, 100],
    cash:   [30, 55, 40, 62, 48, 70, 52, 74, 60, 82, 68, 88],
    profit: [20, 26, 24, 32, 30, 38, 42, 40, 52, 58, 62, 70]
  };
  const SERIES_META = {
    growth: { v: "AOA 248M", p: "▲ 18,4%" },
    cash:   { v: "AOA 96M", p: "▲ 12,1%" },
    profit: { v: "27%", p: "▲ 4,1 p.p." }
  };
  const W = 640, H = 240, PAD = 16;
  function buildPath(vals) {
    const max = Math.max(...vals) * 1.12, min = Math.min(...vals) * 0.6;
    const stepX = (W - PAD * 2) / (vals.length - 1);
    const pts = vals.map((v, i) => {
      const x = PAD + i * stepX;
      const y = H - PAD - ((v - min) / (max - min)) * (H - PAD * 2);
      return [x, y];
    });
    const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
    const fill = line + ` L${W - PAD},${H} L${PAD},${H} Z`;
    return { line, fill, pts };
  }
  function drawChart(series, animate) {
    const { line, fill, pts } = buildPath(SERIES[series]);
    const grid = $("#gridLines");
    if (grid && !grid.hasChildNodes()) {
      let g = "";
      for (let i = 1; i < 4; i++) { const y = (H / 4) * i; g += `<line x1="0" x2="${W}" y1="${y}" y2="${y}" stroke-dasharray="3 5" opacity=".5"/>`; }
      grid.innerHTML = g;
    }
    const lineEl = $("#chartLine"), fillEl = $("#chartFill"), dots = $("#chartDots");
    lineEl.setAttribute("d", line);
    fillEl.setAttribute("d", fill);
    dots.innerHTML = pts.map((p, i) => i === pts.length - 1 ? `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="5" fill="#c0a265" stroke="var(--surface)" stroke-width="2.5"/>` : "").join("");
    if (animate && !reduceMotion) {
      const len = lineEl.getTotalLength();
      lineEl.style.transition = "none";
      lineEl.style.strokeDasharray = len; lineEl.style.strokeDashoffset = len;
      fillEl.style.opacity = 0;
      requestAnimationFrame(() => {
        lineEl.style.transition = "stroke-dashoffset 1.4s cubic-bezier(.16,1,.3,1)";
        lineEl.style.strokeDashoffset = 0;
        fillEl.style.transition = "opacity 1s ease .3s"; fillEl.style.opacity = 1;
      });
    }
    $("#dashValue").textContent = SERIES_META[series].v;
    $("#dashPill").textContent = SERIES_META[series].p;
  }
  function initDash() {
    let drawn = false;
    $$("#dashTabs .dash__tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$("#dashTabs .dash__tab").forEach((x) => x.classList.remove("active"));
        tab.classList.add("active");
        drawChart(tab.dataset.series, true);
      });
    });
    const obs = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting && !drawn) { drawn = true; drawChart("growth", true); animateGauge(); animateBars(); } });
    }, { threshold: 0.25 });
    obs.observe($("#painel"));
  }
  function animateGauge() {
    const arc = $("#gaugeArc"); if (!arc) return;
    const val = 86, circ = 314, off = circ - (val / 100) * circ;
    arc.style.transition = reduceMotion ? "none" : "stroke-dashoffset 1.6s cubic-bezier(.16,1,.3,1)";
    requestAnimationFrame(() => { arc.style.strokeDashoffset = off; });
  }
  function animateBars() {
    $$(".bar__fill").forEach((b) => { b.style.width = (b.dataset.w || 0) + "%"; });
  }

  /* ---------------------------------------------------------
     4. SIMULATORS
     --------------------------------------------------------- */
  const nf = () => new Intl.NumberFormat(lang === "en" ? "en-US" : "pt-PT", { maximumFractionDigits: 0 });
  const nf2 = () => new Intl.NumberFormat(lang === "en" ? "en-US" : "pt-PT", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const money = (v) => nf().format(Math.round(v));

  const SIMS = {
    margin: {
      icon: "margin",
      fields: [
        ["revenue", "sim.f.revenue", 100000, "AOA"],
        ["cost", "sim.f.cost", 55000, "AOA"],
        ["opex", "sim.f.opex", 15000, "AOA"]
      ],
      calc(v) {
        const rev = v.revenue || 0, cost = v.cost || 0, opex = v.opex || 0;
        const gross = rev ? ((rev - cost) / rev) * 100 : 0;
        const net = rev ? ((rev - cost - opex) / rev) * 100 : 0;
        const markup = cost ? ((rev - cost) / cost) * 100 : 0;
        const profit = rev - cost - opex;
        return [
          ["sim.r.gross", nf2().format(gross) + "%", gross >= 0 ? "pos" : "neg"],
          ["sim.r.net", nf2().format(net) + "%", net >= 0 ? "pos" : "neg"],
          ["sim.r.markup", nf2().format(markup) + "%", ""],
          ["sim.r.profit", "AOA " + money(profit), profit >= 0 ? "pos" : "neg"]
        ];
      }
    },
    break: {
      icon: "break",
      fields: [
        ["fixed", "sim.f.fixed", 500000, "AOA"],
        ["price", "sim.f.price", 2500, "AOA"],
        ["varcost", "sim.f.varcost", 1500, "AOA"]
      ],
      calc(v) {
        const fixed = v.fixed || 0, price = v.price || 0, vc = v.varcost || 0;
        const contrib = price - vc;
        const units = contrib > 0 ? fixed / contrib : 0;
        const revenue = units * price;
        return [
          ["sim.r.units", nf().format(Math.ceil(units)), contrib > 0 ? "pos" : "neg"],
          ["sim.r.revenue", "AOA " + money(revenue), ""],
          ["sim.r.contrib", "AOA " + money(contrib) + " / un.", contrib > 0 ? "pos" : "neg"]
        ];
      }
    },
    loan: {
      icon: "loan",
      fields: [
        ["amount", "sim.f.amount", 5000000, "AOA"],
        ["rate", "sim.f.rate", 18, "%"],
        ["term", "sim.f.term", 36, "m"]
      ],
      calc(v) {
        const P = v.amount || 0, r = (v.rate || 0) / 100 / 12, n = v.term || 1;
        const pay = r > 0 ? (P * r) / (1 - Math.pow(1 + r, -n)) : P / n;
        const total = pay * n, interest = total - P;
        return [
          ["sim.r.payment", "AOA " + money(pay), ""],
          ["sim.r.total", "AOA " + money(total), ""],
          ["sim.r.interest", "AOA " + money(interest), "neg"]
        ];
      }
    },
    cash: {
      icon: "cashflow",
      fields: [
        ["inflow", "sim.f.in", 3000000, "AOA"],
        ["outflow", "sim.f.out", 2600000, "AOA"],
        ["open", "sim.f.open", 1500000, "AOA"]
      ],
      calc(v) {
        const inf = v.inflow || 0, out = v.outflow || 0, open = v.open || 0;
        const monthly = inf - out;
        const bal = open + monthly * 12;
        const runway = monthly < 0 ? open / -monthly : Infinity;
        return [
          ["sim.r.balance", "AOA " + money(bal), bal >= 0 ? "pos" : "neg"],
          ["sim.r.monthly", "AOA " + money(monthly), monthly >= 0 ? "pos" : "neg"],
          ["sim.r.runway", runway === Infinity ? "∞" : nf2().format(runway) + " " + t("sim.months"), monthly >= 0 ? "pos" : "neg"]
        ];
      }
    },
    tax: {
      icon: "tax",
      fields: [
        ["profit", "sim.f.profit", 8000000, "AOA"],
        ["taxrate", "sim.f.taxrate", 25, "%"]
      ],
      calc(v) {
        const profit = v.profit || 0, rate = (v.taxrate || 0) / 100;
        const tax = Math.max(0, profit) * rate;
        const net = profit - tax;
        const eff = profit ? (tax / profit) * 100 : 0;
        return [
          ["sim.r.tax", "AOA " + money(tax), "neg"],
          ["sim.r.netprofit", "AOA " + money(net), net >= 0 ? "pos" : "neg"],
          ["sim.r.effrate", nf2().format(eff) + "%", ""]
        ];
      }
    }
  };
  let currentSim = "margin";
  function renderSimMenu() {
    $("#simMenu").innerHTML = Object.keys(SIMS).map((k) => `
      <button data-sim="${k}" class="${k === currentSim ? "active" : ""}">
        <span class="ic">${svg(ICON[SIMS[k].icon])}</span>
        <span data-i18n="sim.${k}.t">${t("sim." + k + ".t")}</span>
      </button>`).join("");
    $$("#simMenu button").forEach((b) => b.addEventListener("click", () => { currentSim = b.dataset.sim; renderSimMenu(); renderSimPanel(); }));
  }
  function renderSimPanel() {
    const sim = SIMS[currentSim];
    $("#simPanel").innerHTML = `
      <h3 data-i18n="sim.${currentSim}.t">${t("sim." + currentSim + ".t")}</h3>
      <p class="desc" data-i18n="sim.${currentSim}.d">${t("sim." + currentSim + ".d")}</p>
      <div class="sim__form">
        ${sim.fields.map(([id, label, def, aff]) => `
          <div class="field">
            <label for="sim_${id}" data-i18n="${label}">${t(label)}</label>
            <div class="inputw"><input id="sim_${id}" type="number" min="0" step="any" value="${def}" data-key="${id}"><span class="aff">${aff}</span></div>
          </div>`).join("")}
      </div>
      <div class="sim__result" id="simResult"></div>`;
    const inputs = $$("#simPanel input");
    const run = () => {
      const v = {}; inputs.forEach((i) => v[i.dataset.key] = parseFloat(i.value) || 0);
      const res = sim.calc(v);
      $("#simResult").innerHTML = res.map(([lk, val, cls]) => `<div class="r"><small data-i18n="${lk}">${t(lk)}</small><b class="${cls}">${val}</b></div>`).join("") +
        `<div class="sim__note" data-i18n="sim.note">${t("sim.note")}</div>`;
    };
    inputs.forEach((i) => i.addEventListener("input", run));
    run();
  }

  /* ---------------------------------------------------------
     5. i18n apply
     --------------------------------------------------------- */
  function applyI18n() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach((el) => { const k = el.getAttribute("data-i18n"); if (I18N[lang][k] != null) el.textContent = I18N[lang][k]; });
    $$("[data-i18n-ph]").forEach((el) => { const k = el.getAttribute("data-i18n-ph"); if (I18N[lang][k] != null) el.setAttribute("placeholder", I18N[lang][k]); });
    $("#langCode").textContent = lang.toUpperCase();
    $("#langFlag").textContent = lang === "pt" ? "🇦🇴" : "🇬🇧";
  }
  function rerenderDynamic() {
    renderServices(); renderWhy(); renderTimeline(); renderCases();
    renderBlog(); renderResources(); renderFaq(); renderTicker();
    renderSimMenu(); renderSimPanel();
    applyI18n();
    initReveal(); // observe newly injected .reveal nodes
  }

  /* ---------------------------------------------------------
     6. Reveal on scroll
     --------------------------------------------------------- */
  let revealObs;
  function initReveal() {
    if (reduceMotion) { $$(".reveal").forEach((e) => e.classList.add("in")); return; }
    if (!revealObs) {
      revealObs = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); revealObs.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    }
    $$(".reveal:not(.in)").forEach((e) => revealObs.observe(e));
  }

  /* ---------------------------------------------------------
     7. Count-up numbers
     --------------------------------------------------------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = target.toFixed(dec) + suffix; return; }
    const dur = 1600, start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = (dec ? val.toFixed(dec) : Math.round(val).toLocaleString(lang === "en" ? "en-US" : "pt-PT")) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function initCounters() {
    const obs = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { animateCount(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.5 });
    $$("[data-count]").forEach((el) => obs.observe(el));
  }

  /* ---------------------------------------------------------
     8. Header / nav / theme / misc
     --------------------------------------------------------- */
  function initHeader() {
    const header = $("#header");
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 20);
      $("#backTop").classList.toggle("show", window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Active nav via IntersectionObserver
    const links = $$(".nav a");
    const map = {};
    links.forEach((l) => { const id = l.getAttribute("href").slice(1); map[id] = l; });
    const secObs = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.remove("active"));
          const id = e.target.id; if (map[id]) map[id].classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["servicos", "sobre", "processo", "simuladores", "casos", "blog", "contacto"].forEach((id) => { const s = document.getElementById(id); if (s) secObs.observe(s); });

    $("#backTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
  }

  function initDrawer() {
    const drawer = $("#drawer"), toggle = $("#navToggle");
    const open = () => { drawer.classList.add("open"); toggle.setAttribute("aria-expanded", true); document.body.style.overflow = "hidden"; };
    const close = () => { drawer.classList.remove("open"); toggle.setAttribute("aria-expanded", false); document.body.style.overflow = ""; };
    toggle.addEventListener("click", open);
    $$("[data-close]", drawer).forEach((el) => el.addEventListener("click", close));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  function initTheme() {
    const saved = store.get("aneva-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    $("#themeBtn").addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme");
      const next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      store.set("aneva-theme", next);
      $('meta[name="theme-color"]').setAttribute("content", next === "dark" ? "#060f20" : "#0b1f3a");
    });
  }

  function initLang() {
    applyI18n();
    $("#langBtn").addEventListener("click", () => {
      lang = lang === "pt" ? "en" : "pt";
      store.set("aneva-lang", lang);
      rerenderDynamic();
    });
  }

  function initForms() {
    const form = $("#contactForm"), msg = $("#formMsg");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      msg.textContent = t("ct.f.ok"); msg.className = "form-msg ok";
      form.reset();
      setTimeout(() => { msg.className = "form-msg"; }, 6000);
    });
    const news = $("#newsForm"), newsMsg = $("#newsMsg");
    news.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!news.checkValidity()) { news.reportValidity(); return; }
      newsMsg.style.display = "block"; news.reset();
      setTimeout(() => { newsMsg.style.display = "none"; }, 6000);
    });
  }

  /* ---------------------------------------------------------
     9. Boot
     --------------------------------------------------------- */
  function boot() {
    $("#year").textContent = new Date().getFullYear();
    renderServices(); renderWhy(); renderTimeline(); renderCases();
    renderBlog(); renderResources(); renderFaq(); renderTicker();
    renderSimMenu(); renderSimPanel();
    initTheme(); initLang(); initHeader(); initDrawer(); initForms();
    initReveal(); initCounters(); initDash(); initMarket();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

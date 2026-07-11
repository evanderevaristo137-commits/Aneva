/**
 * Sistema multilíngue leve (PT padrão · EN · FR).
 * As páginas públicas usam `t(locale, chave)`; o locale ativo vive num
 * cookie/contexto e cai para 'pt'. Expandir dicionários conforme necessário.
 */

export type Locale = 'pt' | 'en' | 'fr';

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: 'pt', label: 'Português', flag: '🇦🇴' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

const dict = {
  pt: {
    'nav.search': 'Pesquisar',
    'nav.host': 'Anunciar imóvel',
    'nav.help': 'Ajuda',
    'nav.login': 'Entrar',
    'nav.signup': 'Criar conta',
    'hero.title': 'Encontre a sua estadia em Angola',
    'hero.subtitle': 'Casas, apartamentos e guest houses verificados — pague com Multicaixa Express, Unitel Money ou cartão.',
    'search.where': 'Onde? Luanda, Benguela…',
    'search.checkin': 'Check-in',
    'search.checkout': 'Check-out',
    'search.guests': 'Hóspedes',
    'search.cta': 'Pesquisar',
    'home.popular': 'Destinos populares',
    'home.featured': 'Em destaque',
    'home.how': 'Como funciona',
    'home.becomeHost': 'Tem um imóvel? Torne-se anfitrião',
    'home.becomeHostText': 'Anuncie grátis, receba com segurança e gira tudo num só painel.',
    'common.perNight': '/noite',
    'common.verified': 'Verificado',
    'common.reserve': 'Reservar',
    'footer.rights': 'Todos os direitos reservados.',
  },
  en: {
    'nav.search': 'Search',
    'nav.host': 'List your place',
    'nav.help': 'Help',
    'nav.login': 'Sign in',
    'nav.signup': 'Sign up',
    'hero.title': 'Find your stay in Angola',
    'hero.subtitle': 'Verified homes, apartments and guest houses — pay with Multicaixa Express, Unitel Money or card.',
    'search.where': 'Where? Luanda, Benguela…',
    'search.checkin': 'Check-in',
    'search.checkout': 'Check-out',
    'search.guests': 'Guests',
    'search.cta': 'Search',
    'home.popular': 'Popular destinations',
    'home.featured': 'Featured stays',
    'home.how': 'How it works',
    'home.becomeHost': 'Own a property? Become a host',
    'home.becomeHostText': 'List for free, get paid securely and manage everything in one dashboard.',
    'common.perNight': '/night',
    'common.verified': 'Verified',
    'common.reserve': 'Reserve',
    'footer.rights': 'All rights reserved.',
  },
  fr: {
    'nav.search': 'Rechercher',
    'nav.host': 'Publier un logement',
    'nav.help': 'Aide',
    'nav.login': 'Connexion',
    'nav.signup': 'Créer un compte',
    'hero.title': 'Trouvez votre séjour en Angola',
    'hero.subtitle': 'Logements vérifiés — payez avec Multicaixa Express, Unitel Money ou carte bancaire.',
    'search.where': 'Où ? Luanda, Benguela…',
    'search.checkin': 'Arrivée',
    'search.checkout': 'Départ',
    'search.guests': 'Voyageurs',
    'search.cta': 'Rechercher',
    'home.popular': 'Destinations populaires',
    'home.featured': 'À la une',
    'home.how': 'Comment ça marche',
    'home.becomeHost': 'Propriétaire ? Devenez hôte',
    'home.becomeHostText': 'Publiez gratuitement, soyez payé en toute sécurité, gérez tout au même endroit.',
    'common.perNight': '/nuit',
    'common.verified': 'Vérifié',
    'common.reserve': 'Réserver',
    'footer.rights': 'Tous droits réservés.',
  },
} satisfies Record<Locale, Record<string, string>>;

export type MessageKey = keyof (typeof dict)['pt'];

export function t(locale: Locale, key: MessageKey): string {
  return dict[locale][key] ?? dict.pt[key] ?? key;
}

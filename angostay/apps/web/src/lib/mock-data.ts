/** Dados de demonstração do protótipo — espelham o schema Prisma. */

export interface DemoProperty {
  id: string;
  slug: string;
  title: string;
  type: string;
  city: string;
  province: string;
  priceKz: number; // centavos/noite
  rating: number;
  reviews: number;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  verified: boolean;
  amenities: string[];
  description: string;
  gradient: string; // placeholder visual do protótipo (substituído por fotos reais)
  lat: number;
  lng: number;
}

export const PROPERTIES: DemoProperty[] = [
  {
    id: 'p1',
    slug: 't2-moderno-talatona-luanda',
    title: 'T2 moderno em Talatona com gerador',
    type: 'Apartamento',
    city: 'Talatona',
    province: 'Luanda',
    priceKz: 4_500_000,
    rating: 4.9,
    reviews: 37,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    verified: true,
    amenities: ['Wi-Fi', 'Gerador', 'Tanque de água', 'Ar condicionado', 'Estacionamento', 'Segurança 24h'],
    description:
      'Apartamento T2 totalmente mobilado em condomínio fechado, com gerador, tanque de água e segurança 24 horas. A 10 minutos do Belas Shopping — ideal para estadias de trabalho.',
    gradient: 'from-brand-700 to-brand-500',
    lat: -8.918,
    lng: 13.185,
  },
  {
    id: 'p2',
    slug: 'casa-de-praia-baia-azul-benguela',
    title: 'Casa de praia na Baía Azul',
    type: 'Moradia',
    city: 'Benguela',
    province: 'Benguela',
    priceKz: 8_000_000,
    rating: 4.8,
    reviews: 21,
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    verified: true,
    amenities: ['Wi-Fi', 'Vista para o mar', 'Cozinha equipada', 'Estacionamento', 'Máquina de lavar'],
    description:
      'Moradia espaçosa com vista para o mar, a 5 minutos a pé da Baía Azul. Perfeita para férias em família, com quintal amplo e churrasqueira.',
    gradient: 'from-sky-600 to-cyan-400',
    lat: -12.6,
    lng: 13.39,
  },
  {
    id: 'p3',
    slug: 'guest-house-serra-da-chela-lubango',
    title: 'Guest House Serra da Chela',
    type: 'Guest House',
    city: 'Lubango',
    province: 'Huíla',
    priceKz: 2_200_000,
    rating: 4.7,
    reviews: 54,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    verified: true,
    amenities: ['Wi-Fi', 'TV por cabo', 'Segurança 24h', 'Pequeno-almoço'],
    description:
      'Quartos acolhedores junto ao Cristo Rei do Lubango, com pequeno-almoço incluído e vista para a Serra da Chela.',
    gradient: 'from-emerald-600 to-teal-400',
    lat: -14.92,
    lng: 13.49,
  },
  {
    id: 'p4',
    slug: 'apart-hotel-marginal-luanda',
    title: 'Apart-hotel na Marginal de Luanda',
    type: 'Apart-hotel',
    city: 'Luanda',
    province: 'Luanda',
    priceKz: 12_000_000,
    rating: 4.6,
    reviews: 88,
    guests: 3,
    bedrooms: 1,
    bathrooms: 1,
    verified: true,
    amenities: ['Wi-Fi', 'Gerador', 'Piscina', 'Ginásio', 'Espaço de trabalho'],
    description:
      'Estúdio premium com vista para a Baía de Luanda, limpeza diária e business center. Fatura para empresas.',
    gradient: 'from-indigo-700 to-violet-500',
    lat: -8.813,
    lng: 13.23,
  },
  {
    id: 'p5',
    slug: 'quarto-universitario-huambo',
    title: 'Quarto acolhedor perto da universidade',
    type: 'Quarto',
    city: 'Huambo',
    province: 'Huambo',
    priceKz: 900_000,
    rating: 4.5,
    reviews: 12,
    verified: false,
    guests: 1,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['Wi-Fi', 'Secretária de estudo'],
    description:
      'Quarto individual em casa partilhada, a 10 minutos da UJES. Preço especial para estadias mensais de estudantes.',
    gradient: 'from-amber-600 to-orange-400',
    lat: -12.776,
    lng: 15.739,
  },
  {
    id: 'p6',
    slug: 'bungalow-deserto-namibe',
    title: 'Bungalow à porta do deserto do Namibe',
    type: 'Moradia',
    city: 'Moçâmedes',
    province: 'Namibe',
    priceKz: 5_500_000,
    rating: 4.9,
    reviews: 9,
    verified: true,
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ['Estacionamento', 'Cozinha equipada', 'Vista para o mar'],
    description:
      'Bungalow rústico entre o mar e o deserto — base perfeita para explorar a Arco Lagoon e as dunas do Namibe.',
    gradient: 'from-rose-600 to-orange-500',
    lat: -15.196,
    lng: 12.152,
  },
];

export const CITIES = [
  { name: 'Luanda', slug: 'luanda', count: 128, gradient: 'from-brand-900 to-brand-500' },
  { name: 'Benguela', slug: 'benguela', count: 54, gradient: 'from-sky-700 to-cyan-500' },
  { name: 'Lubango', slug: 'lubango', count: 33, gradient: 'from-emerald-700 to-teal-500' },
  { name: 'Namibe', slug: 'namibe', count: 18, gradient: 'from-rose-700 to-orange-500' },
];

export const DEMO_RESERVATIONS = [
  { code: 'AS-3F7K2M', property: PROPERTIES[0], checkIn: '2026-08-01', checkOut: '2026-08-05', totalKz: 20_900_000, status: 'CONFIRMED' as const },
  { code: 'AS-9QW1ZX', property: PROPERTIES[2], checkIn: '2026-06-10', checkOut: '2026-06-12', totalKz: 4_840_000, status: 'COMPLETED' as const },
];

export const findProperty = (slug: string) => PROPERTIES.find((p) => p.slug === slug);

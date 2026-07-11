/**
 * Seed inicial: RBAC, geografia de Angola, comodidades, utilizadores demo e imóveis.
 * Executar: npx prisma db seed
 */
import { PrismaClient, PropertyType, PropertyStatus } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const PROVINCES = [
  'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango', 'Cuanza Norte',
  'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla', 'Luanda', 'Lunda Norte',
  'Lunda Sul', 'Malanje', 'Moxico', 'Namibe', 'Uíge', 'Zaire',
];

const CITIES: Record<string, Array<{ name: string; lat: number; lng: number }>> = {
  Luanda: [
    { name: 'Luanda', lat: -8.839, lng: 13.2894 },
    { name: 'Talatona', lat: -8.9167, lng: 13.1833 },
    { name: 'Viana', lat: -8.9035, lng: 13.3714 },
  ],
  Benguela: [
    { name: 'Benguela', lat: -12.5763, lng: 13.4055 },
    { name: 'Lobito', lat: -12.3644, lng: 13.5361 },
  ],
  'Huíla': [{ name: 'Lubango', lat: -14.9172, lng: 13.4925 }],
  Namibe: [{ name: 'Moçâmedes', lat: -15.1961, lng: 12.1522 }],
  Huambo: [{ name: 'Huambo', lat: -12.7761, lng: 15.7392 }],
  Cabinda: [{ name: 'Cabinda', lat: -5.55, lng: 12.2 }],
};

const AMENITIES = [
  { code: 'wifi', pt: 'Wi-Fi', en: 'Wi-Fi', fr: 'Wi-Fi' },
  { code: 'generator', pt: 'Gerador', en: 'Generator', fr: 'Groupe électrogène' },
  { code: 'water_tank', pt: 'Tanque de água', en: 'Water tank', fr: "Réservoir d'eau" },
  { code: 'ac', pt: 'Ar condicionado', en: 'Air conditioning', fr: 'Climatisation' },
  { code: 'kitchen', pt: 'Cozinha equipada', en: 'Kitchen', fr: 'Cuisine équipée' },
  { code: 'parking', pt: 'Estacionamento', en: 'Parking', fr: 'Parking' },
  { code: 'pool', pt: 'Piscina', en: 'Pool', fr: 'Piscine' },
  { code: 'security', pt: 'Segurança 24h', en: '24h security', fr: 'Sécurité 24h' },
  { code: 'tv', pt: 'TV por cabo', en: 'Cable TV', fr: 'TV câblée' },
  { code: 'washer', pt: 'Máquina de lavar', en: 'Washer', fr: 'Lave-linge' },
  { code: 'sea_view', pt: 'Vista para o mar', en: 'Sea view', fr: 'Vue sur mer' },
  { code: 'workspace', pt: 'Espaço de trabalho', en: 'Workspace', fr: 'Espace de travail' },
];

const PERMISSIONS = [
  'property.create', 'property.moderate', 'reservation.manage',
  'payment.refund', 'user.suspend', 'report.resolve', 'cms.edit', 'metrics.view',
];

const slugify = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function main() {
  // RBAC
  const perms = await Promise.all(
    PERMISSIONS.map((code) =>
      prisma.permission.upsert({ where: { code }, update: {}, create: { code } }),
    ),
  );
  const roleDefs: Record<string, string[]> = {
    GUEST: [],
    HOST: ['property.create'],
    MODERATOR: ['property.moderate', 'report.resolve'],
    ADMIN: PERMISSIONS,
  };
  const roles: Record<string, string> = {};
  for (const [name, permCodes] of Object.entries(roleDefs)) {
    const role = await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
    roles[name] = role.id;
    for (const code of permCodes) {
      const perm = perms.find((p) => p.code === code)!;
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
        update: {},
        create: { roleId: role.id, permissionId: perm.id },
      });
    }
  }

  // Geografia
  const angola = await prisma.country.upsert({
    where: { code: 'AO' },
    update: {},
    create: { code: 'AO', name: 'Angola', currency: 'AOA' },
  });
  for (const name of PROVINCES) {
    const province = await prisma.province.upsert({
      where: { countryId_name: { countryId: angola.id, name } },
      update: {},
      create: { name, countryId: angola.id },
    });
    for (const city of CITIES[name] ?? []) {
      await prisma.city.upsert({
        where: { slug: slugify(city.name) },
        update: {},
        create: { name: city.name, slug: slugify(city.name), provinceId: province.id, lat: city.lat, lng: city.lng },
      });
    }
  }

  // Comodidades
  for (const a of AMENITIES) {
    await prisma.amenity.upsert({
      where: { code: a.code },
      update: {},
      create: { code: a.code, namePt: a.pt, nameEn: a.en, nameFr: a.fr },
    });
  }

  // Utilizadores demo
  const password = await argon2.hash('AngoStay!2026');
  const mkUser = async (name: string, email: string, roleNames: string[]) => {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { name, email, passwordHash: password, emailVerifiedAt: new Date() },
    });
    for (const rn of roleNames) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId: roles[rn] } },
        update: {},
        create: { userId: user.id, roleId: roles[rn] },
      });
    }
    return user;
  };

  const admin = await mkUser('Admin AngoStay', 'admin@angostay.ao', ['ADMIN']);
  const host = await mkUser('Domingos Cassoma', 'host@angostay.ao', ['HOST', 'GUEST']);
  await mkUser('Marta Silva', 'guest@angostay.ao', ['GUEST']);
  void admin;

  // Imóveis demo
  const talatona = await prisma.city.findUnique({ where: { slug: 'talatona' } });
  const benguela = await prisma.city.findUnique({ where: { slug: 'benguela' } });
  const lubango = await prisma.city.findUnique({ where: { slug: 'lubango' } });
  const amen = await prisma.amenity.findMany();
  const pick = (...codes: string[]) => amen.filter((a) => codes.includes(a.code));

  const demos = [
    {
      city: talatona!, type: PropertyType.APARTMENT,
      title: 'T2 moderno em Talatona com gerador',
      description: 'Apartamento T2 totalmente mobilado em condomínio fechado, com gerador, tanque de água e segurança 24h. Ideal para estadias de trabalho.',
      lat: -8.918, lng: 13.185, maxGuests: 4, bedrooms: 2, beds: 2, bathrooms: 2,
      basePriceKz: 4_500_000, cleaningFeeKz: 1_000_000,
      amenities: pick('wifi', 'generator', 'water_tank', 'ac', 'parking', 'security', 'workspace'),
    },
    {
      city: benguela!, type: PropertyType.HOUSE,
      title: 'Casa de praia na Baía Azul',
      description: 'Moradia com vista para o mar a 5 minutos da Baía Azul. Perfeita para férias em família.',
      lat: -12.6, lng: 13.39, maxGuests: 8, bedrooms: 4, beds: 5, bathrooms: 3,
      basePriceKz: 8_000_000, cleaningFeeKz: 1_500_000,
      amenities: pick('wifi', 'sea_view', 'kitchen', 'parking', 'washer'),
    },
    {
      city: lubango!, type: PropertyType.GUEST_HOUSE,
      title: 'Guest House Serra da Chela',
      description: 'Quartos acolhedores junto ao Cristo Rei do Lubango, com pequeno-almoço incluído.',
      lat: -14.92, lng: 13.49, maxGuests: 2, bedrooms: 1, beds: 1, bathrooms: 1,
      basePriceKz: 2_200_000, cleaningFeeKz: 0,
      amenities: pick('wifi', 'tv', 'security'),
    },
  ];

  for (const d of demos) {
    const slug = `${slugify(d.title)}-${d.city.slug}`;
    await prisma.property.upsert({
      where: { slug },
      update: {},
      create: {
        hostId: host.id,
        cityId: d.city.id,
        slug,
        type: d.type,
        title: d.title,
        description: d.description,
        address: `${d.city.name}, Angola`,
        lat: d.lat,
        lng: d.lng,
        maxGuests: d.maxGuests,
        bedrooms: d.bedrooms,
        beds: d.beds,
        bathrooms: d.bathrooms,
        basePriceKz: d.basePriceKz,
        cleaningFeeKz: d.cleaningFeeKz,
        status: PropertyStatus.ACTIVE,
        verifiedAt: new Date(),
        amenities: { create: d.amenities.map((a) => ({ amenityId: a.id })) },
        photos: {
          create: [
            { url: `https://res.cloudinary.com/demo/image/upload/angostay/${slug}-1.jpg`, isCover: true, position: 0 },
            { url: `https://res.cloudinary.com/demo/image/upload/angostay/${slug}-2.jpg`, position: 1 },
          ],
        },
      },
    });
  }

  console.log('Seed concluído ✔');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

-- Anti-overbooking: impede reservas ativas sobrepostas no mesmo imóvel.
-- Executar após a primeira migração (ou incluir numa migração manual):
--   npx prisma migrate dev --create-only --name add_reservation_exclusion
--   (colar este SQL no ficheiro gerado) e depois: npx prisma migrate dev

CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "reservations"
  ADD CONSTRAINT no_overlapping_reservations
  EXCLUDE USING gist (
    "propertyId" WITH =,
    daterange("checkIn"::date, "checkOut"::date) WITH &&
  )
  WHERE (status IN ('PENDING', 'CONFIRMED', 'CHECKED_IN'));

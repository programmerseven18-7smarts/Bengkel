ALTER TABLE "roles" ADD COLUMN "kode" VARCHAR(40);

UPDATE "roles"
SET "kode" = CASE
  WHEN "nama" = 'Owner' THEN 'SUPER_ADMIN'
  WHEN "nama" = 'Admin' THEN 'ADMIN'
  WHEN "nama" = 'Mekanik' THEN 'MEKANIK'
  WHEN "nama" = 'Kasir' THEN 'KASIR'
  ELSE UPPER(REGEXP_REPLACE("nama", '[^a-zA-Z0-9]+', '_', 'g'))
END
WHERE "kode" IS NULL;

ALTER TABLE "roles" ALTER COLUMN "kode" SET NOT NULL;

CREATE UNIQUE INDEX "roles_kode_key" ON "roles"("kode");

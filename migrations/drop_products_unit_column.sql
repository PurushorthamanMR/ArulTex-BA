-- Remove product "unit" column (e.g. pcs/kg). Run once against your DB after deploying model changes.
-- MySQL / MariaDB

ALTER TABLE products DROP COLUMN unit;

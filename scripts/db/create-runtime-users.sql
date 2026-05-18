-- StreamButed production database roles.
-- Run as a PostgreSQL admin user on the Droplet. Replace every CHANGE_ME_*
-- placeholder before execution. Do not commit real passwords.
--
-- Existing databases expected:
--   streambuted_identity
--   streambuted_catalog

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'streambuted_identity_app') THEN
    CREATE ROLE streambuted_identity_app LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'streambuted_identity_migrator') THEN
    CREATE ROLE streambuted_identity_migrator LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'streambuted_catalog_app') THEN
    CREATE ROLE streambuted_catalog_app LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'streambuted_catalog_migrator') THEN
    CREATE ROLE streambuted_catalog_migrator LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE;
  END IF;
END $$;

ALTER ROLE streambuted_identity_app PASSWORD 'CHANGE_ME_IDENTITY_RUNTIME_PASSWORD';
ALTER ROLE streambuted_identity_migrator PASSWORD 'CHANGE_ME_IDENTITY_MIGRATOR_PASSWORD';
ALTER ROLE streambuted_catalog_app PASSWORD 'CHANGE_ME_CATALOG_RUNTIME_PASSWORD';
ALTER ROLE streambuted_catalog_migrator PASSWORD 'CHANGE_ME_CATALOG_MIGRATOR_PASSWORD';

\connect streambuted_identity

GRANT CONNECT ON DATABASE streambuted_identity TO streambuted_identity_app;
GRANT CONNECT ON DATABASE streambuted_identity TO streambuted_identity_migrator;

GRANT USAGE ON SCHEMA public TO streambuted_identity_app;
GRANT USAGE, CREATE ON SCHEMA public TO streambuted_identity_migrator;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO streambuted_identity_app;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO streambuted_identity_app;

GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public TO streambuted_identity_migrator;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO streambuted_identity_migrator;

ALTER DEFAULT PRIVILEGES FOR ROLE streambuted_identity_migrator IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO streambuted_identity_app;
ALTER DEFAULT PRIVILEGES FOR ROLE streambuted_identity_migrator IN SCHEMA public
  GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO streambuted_identity_app;

\connect streambuted_catalog

GRANT CONNECT ON DATABASE streambuted_catalog TO streambuted_catalog_app;
GRANT CONNECT ON DATABASE streambuted_catalog TO streambuted_catalog_migrator;

GRANT USAGE ON SCHEMA public TO streambuted_catalog_app;
GRANT USAGE, CREATE ON SCHEMA public TO streambuted_catalog_migrator;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO streambuted_catalog_app;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO streambuted_catalog_app;

GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public TO streambuted_catalog_migrator;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO streambuted_catalog_migrator;

ALTER DEFAULT PRIVILEGES FOR ROLE streambuted_catalog_migrator IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO streambuted_catalog_app;
ALTER DEFAULT PRIVILEGES FOR ROLE streambuted_catalog_migrator IN SCHEMA public
  GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO streambuted_catalog_app;

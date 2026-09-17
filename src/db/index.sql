CREATE TABLE users(
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    reset_code_hash TEXT,
    reset_code_expires_at TIMESTAMPTZ,
    reset_code_verified_at TIMESTAMPTZ
);

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS reset_code_hash TEXT,
    ADD COLUMN IF NOT EXISTS reset_code_expires_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS reset_code_verified_at TIMESTAMPTZ;
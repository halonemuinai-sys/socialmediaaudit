-- Setup Database untuk Aplikasi Audit Sosial Media MRA Group (Schema: social_audit dengan Autentikasi & Otorisasi Sektor)

-- 1. Buat schema baru jika belum ada
CREATE SCHEMA IF NOT EXISTS social_audit;

-- 2. Hapus tabel jika sudah ada di schema social_audit (untuk reset/clean)
DROP TABLE IF EXISTS social_audit.social_media_audit_logs CASCADE;
DROP TABLE IF EXISTS social_audit.social_media_pic_delegations CASCADE;
DROP TABLE IF EXISTS social_audit.social_media_accounts CASCADE;
DROP TABLE IF EXISTS social_audit.business_units CASCADE;
DROP TABLE IF EXISTS social_audit.users CASCADE;

-- 3. Buat tabel users (PIC & Admin) di schema social_audit
CREATE TABLE social_audit.users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL DEFAULT 'Password123!',
    department VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'PIC', -- 'ADMIN' (Head of Marketing), 'PIC'
    sector VARCHAR(50) NOT NULL -- 'RETAIL', 'FB', 'MEDIA', 'RADIO', 'ALL'
);

-- 4. Buat tabel business_units
CREATE TABLE social_audit.business_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Publisher', 'Broadcast', 'Food & Beverage', 'Retail & Lifestyle', etc
    sector VARCHAR(50) NOT NULL, -- 'RETAIL', 'FB', 'MEDIA', 'RADIO'
    website_url VARCHAR(255)
);

-- 5. Buat tabel social_media_accounts yang merujuk ke business_units
CREATE TABLE social_audit.social_media_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_unit_id UUID NOT NULL REFERENCES social_audit.business_units(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- 'instagram', 'facebook', 'twitter', 'youtube', 'tiktok'
    handle VARCHAR(255) NOT NULL,
    url VARCHAR(555) NOT NULL
);

-- 6. Buat tabel social_media_pic_delegations yang merujuk ke business_units
CREATE TABLE social_audit.social_media_pic_delegations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_unit_id UUID NOT NULL REFERENCES social_audit.business_units(id) ON DELETE CASCADE,
    pic_name VARCHAR(255) NOT NULL,
    delegated_by VARCHAR(255) DEFAULT 'Head of Marketing',
    delegated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- 7. Buat tabel social_media_audit_logs
CREATE TABLE social_audit.social_media_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES social_audit.social_media_accounts(id) ON DELETE CASCADE,
    last_password_changed_at DATE NOT NULL,
    has_two_factor_auth BOOLEAN DEFAULT FALSE,
    password_strength VARCHAR(50) NOT NULL, -- 'Weak', 'Medium', 'Strong'
    vulnerabilities_notes TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Safe', -- 'Safe', 'Warning', 'Critical'
    audited_at TIMESTAMPTZ DEFAULT NOW(),
    audited_by_user_id VARCHAR(255) NOT NULL REFERENCES social_audit.users(id) ON DELETE CASCADE
);

-- 8. Seed Data Awal - Akun PIC & Admin dengan Sektor Khusus
INSERT INTO social_audit.users (id, name, username, password, department, role, sector) VALUES
('ADMIN-01', 'Alfonso (Head of Marketing)', 'head', 'Password123!', 'Marketing Head Office', 'ADMIN', 'ALL'),
('USR-RETAIL', 'Budi Retail', 'retail', 'Password123!', 'Retail & Lifestyle', 'PIC', 'RETAIL'),
('USR-FB', 'Siti F&B', 'fb', 'Password123!', 'Food & Beverage', 'PIC', 'FB'),
('USR-MEDIA', 'Andi Media', 'media', 'Password123!', 'Publishing & Media', 'PIC', 'MEDIA'),
('USR-RADIO', 'Rian Radio', 'radio', 'Password123!', 'MRA Broadcast', 'PIC', 'RADIO')
ON CONFLICT (id) DO NOTHING;

-- 9. Seed Data Awal - 18 Unit Bisnis MRA terbagi dalam 4 Sektor Utama
WITH inserted_units AS (
    INSERT INTO social_audit.business_units (name, category, sector, website_url) VALUES
    ('Harper''s Bazaar Indonesia', 'Publisher', 'MEDIA', 'https://mra.co.id/bazaar.html'),
    ('Her World Indonesia', 'Publisher', 'MEDIA', 'https://mra.co.id/hw.html'),
    ('Cosmopolitan Indonesia', 'Publisher', 'MEDIA', 'https://mra.co.id/cosmopolitan.html'),
    ('Mother & Beyond', 'Publisher', 'MEDIA', 'https://mra.co.id/mb.html'),
    ('CASA Indonesia / Alacasa', 'Publisher', 'MEDIA', 'https://mra.co.id/alacasa.html'),
    ('Parentalk.id', 'Publisher', 'MEDIA', 'https://mra.co.id/parentalk.html'),
    ('The Rockin Life (Hard Rock FM)', 'Broadcast', 'RADIO', 'https://mra.co.id/therockinlife.html'),
    ('Iswara (IRadio)', 'Broadcast', 'RADIO', 'https://mra.co.id/iswara.html'),
    ('Hard Rock Cafe Bali', 'Food & Beverage', 'FB', 'https://mra.co.id/hardrock-cafe.html'),
    ('Häagen-Dazs Indonesia', 'Food & Beverage', 'FB', 'https://mra.co.id/haagen-dazs.html'),
    ('Bulgari', 'Retail & Lifestyle', 'RETAIL', 'https://mra.co.id/bvlgari.html'),
    ('Omega', 'Retail & Lifestyle', 'RETAIL', 'https://mra.co.id/omega.html'),
    ('Atmos Indonesia', 'Retail & Lifestyle', 'RETAIL', 'https://mra.co.id/atmos.html'),
    ('Lancôme Indonesia', 'Retail & Lifestyle', 'RETAIL', 'https://mra.co.id/lancome.html'),
    ('Kiehl''s Indonesia', 'Retail & Lifestyle', 'RETAIL', 'https://mra.co.id/kiehls.html'),
    ('Wiggle Wiggle', 'Retail & Lifestyle', 'RETAIL', 'https://mra.co.id/wiggle-wiggle.html'),
    ('Bulgari Resort Bali', 'Hotel & Property', 'RETAIL', 'https://mra.co.id/bvlgari-hotel.html'),
    ('Art Jakarta', 'Arts & Culture', 'MEDIA', 'https://mra.co.id/art-jakarta.html')
    ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, sector = EXCLUDED.sector, website_url = EXCLUDED.website_url
    RETURNING id, name
)
-- 10. Seed Data Awal - Akun Sosial Media
INSERT INTO social_audit.social_media_accounts (business_unit_id, platform, handle, url)
SELECT id, 'facebook', 'HarpersBazaarIndonesia', 'https://www.facebook.com/HarpersBazaarIndonesia' FROM inserted_units WHERE name = 'Harper''s Bazaar Indonesia'
UNION ALL
SELECT id, 'twitter', 'bazaarindonesia', 'https://twitter.com/bazaarindonesia' FROM inserted_units WHERE name = 'Harper''s Bazaar Indonesia'
UNION ALL
SELECT id, 'instagram', 'bazaarindonesia', 'https://www.instagram.com/bazaarindonesia/' FROM inserted_units WHERE name = 'Harper''s Bazaar Indonesia'
UNION ALL
SELECT id, 'youtube', 'bazaarindonesia', 'https://www.youtube.com/bazaarindonesia' FROM inserted_units WHERE name = 'Harper''s Bazaar Indonesia'

UNION ALL
SELECT id, 'facebook', 'HerworldIndonesia', 'https://www.facebook.com/HerworldIndonesia' FROM inserted_units WHERE name = 'Her World Indonesia'
UNION ALL
SELECT id, 'twitter', 'herworldID', 'https://twitter.com/herworldID' FROM inserted_units WHERE name = 'Her World Indonesia'
UNION ALL
SELECT id, 'instagram', 'herworldindonesia', 'https://www.instagram.com/herworldindonesia/' FROM inserted_units WHERE name = 'Her World Indonesia'
UNION ALL
SELECT id, 'youtube', 'HerWorldIndonesia', 'https://www.youtube.com/user/HerWorldIndonesia' FROM inserted_units WHERE name = 'Her World Indonesia'

UNION ALL
SELECT id, 'facebook', 'CosmopolitanIndonesia.Magazine', 'https://www.facebook.com/CosmopolitanIndonesia.Magazine' FROM inserted_units WHERE name = 'Cosmopolitan Indonesia'
UNION ALL
SELECT id, 'twitter', 'CosmoIndonesia', 'https://twitter.com/CosmoIndonesia' FROM inserted_units WHERE name = 'Cosmopolitan Indonesia'
UNION ALL
SELECT id, 'instagram', 'cosmoindonesia', 'https://instagram.com/cosmoindonesia' FROM inserted_units WHERE name = 'Cosmopolitan Indonesia'
UNION ALL
SELECT id, 'youtube', 'CosmoIndonesia', 'https://www.youtube.com/user/CosmoIndonesia?feature=watch' FROM inserted_units WHERE name = 'Cosmopolitan Indonesia'

UNION ALL
SELECT id, 'facebook', 'motherandbeyond.id', 'https://www.facebook.com/motherandbeyond.id' FROM inserted_units WHERE name = 'Mother & Beyond'
UNION ALL
SELECT id, 'twitter', 'motherandbeyond', 'https://twitter.com/motherandbeyond' FROM inserted_units WHERE name = 'Mother & Beyond'
UNION ALL
SELECT id, 'instagram', 'motherandbeyond_id', 'https://www.instagram.com/motherandbeyond_id/' FROM inserted_units WHERE name = 'Mother & Beyond'
UNION ALL
SELECT id, 'youtube', 'MotherandBeyond', 'https://www.youtube.com/c/MotherandBeyond' FROM inserted_units WHERE name = 'Mother & Beyond'

UNION ALL
SELECT id, 'facebook', 'CASA-Indonesia-1122515707802485', 'https://www.facebook.com/CASA-Indonesia-1122515707802485' FROM inserted_units WHERE name = 'CASA Indonesia / Alacasa'
UNION ALL
SELECT id, 'twitter', 'casaindonesia', 'https://twitter.com/casaindonesia/' FROM inserted_units WHERE name = 'CASA Indonesia / Alacasa'
UNION ALL
SELECT id, 'instagram', 'alacasa_id', 'https://www.instagram.com/alacasa_id/' FROM inserted_units WHERE name = 'CASA Indonesia / Alacasa'
UNION ALL
SELECT id, 'youtube', 'CASA Indonesia', 'https://www.youtube.com/channel/UCZ6yENQjxT_vGX8Wz2yeQpQ' FROM inserted_units WHERE name = 'CASA Indonesia / Alacasa'

UNION ALL
SELECT id, 'facebook', 'parentalk.id', 'https://www.facebook.com/parentalk.id' FROM inserted_units WHERE name = 'Parentalk.id'
UNION ALL
SELECT id, 'instagram', 'parentalk.id', 'https://www.instagram.com/parentalk.id/' FROM inserted_units WHERE name = 'Parentalk.id'
UNION ALL
SELECT id, 'youtube', 'Parentalk ID', 'https://www.youtube.com/channel/UCEmKMeMPxHYaVtLByUD_G4A' FROM inserted_units WHERE name = 'Parentalk.id'

UNION ALL
SELECT id, 'instagram', 'therockinlife.bali', 'https://www.instagram.com/therockinlife.bali' FROM inserted_units WHERE name = 'The Rockin Life (Hard Rock FM)'
UNION ALL
SELECT id, 'tiktok', 'therockinlife', 'https://www.tiktok.com/@therockinlife' FROM inserted_units WHERE name = 'The Rockin Life (Hard Rock FM)'
UNION ALL
SELECT id, 'youtube', 'therockinlife', 'https://www.youtube.com/@therockinlife' FROM inserted_units WHERE name = 'The Rockin Life (Hard Rock FM)'

UNION ALL
SELECT id, 'tiktok', 'iswara.official', 'https://www.tiktok.com/@iswara.ofiicial' FROM inserted_units WHERE name = 'Iswara (IRadio)'
UNION ALL
SELECT id, 'instagram', 'iswara.jkt', 'https://www.instagram.com/iswara.jkt/' FROM inserted_units WHERE name = 'Iswara (IRadio)'
UNION ALL
SELECT id, 'youtube', 'IRADIOOFFICIAL', 'https://www.youtube.com/@IRADIOOFFICIAL' FROM inserted_units WHERE name = 'Iswara (IRadio)'

UNION ALL
SELECT id, 'facebook', 'hardrockcafebali', 'https://www.facebook.com/hardrockcafebali' FROM inserted_units WHERE name = 'Hard Rock Cafe Bali'
UNION ALL
SELECT id, 'instagram', 'hardrockcafebali', 'https://www.instagram.com/hardrockcafebali/' FROM inserted_units WHERE name = 'Hard Rock Cafe Bali'

UNION ALL
SELECT id, 'facebook', 'haagendazsindonesia', 'https://www.facebook.com/haagendazsindonesia/' FROM inserted_units WHERE name = 'Häagen-Dazs Indonesia'
UNION ALL
SELECT id, 'instagram', 'haagendazs.id', 'https://www.instagram.com/haagendazs.id/' FROM inserted_units WHERE name = 'Häagen-Dazs Indonesia'

UNION ALL
SELECT id, 'instagram', 'bulgari', 'https://www.instagram.com/bulgari/' FROM inserted_units WHERE name = 'Bulgari'

UNION ALL
SELECT id, 'instagram', 'omega', 'https://www.instagram.com/omega/' FROM inserted_units WHERE name = 'Omega'

UNION ALL
SELECT id, 'facebook', 'atmosid', 'https://www.facebook.com/atmosid' FROM inserted_units WHERE name = 'Atmos Indonesia'
UNION ALL
SELECT id, 'instagram', 'atmos_id', 'https://www.instagram.com/atmos_id/' FROM inserted_units WHERE name = 'Atmos Indonesia'

UNION ALL
SELECT id, 'instagram', 'kiehlsid', 'https://www.instagram.com/kiehlsid' FROM inserted_units WHERE name = 'Kiehl''s Indonesia'
UNION ALL
SELECT id, 'tiktok', 'kiehlsindonesia', 'https://www.tiktok.com/@kiehlsindonesia' FROM inserted_units WHERE name = 'Kiehl''s Indonesia'

UNION ALL
SELECT id, 'instagram', 'wigglewiggle.id', 'https://www.instagram.com/wigglewiggle.id' FROM inserted_units WHERE name = 'Wiggle Wiggle'

UNION ALL
SELECT id, 'facebook', 'bulgariresortbali', 'https://www.facebook.com/bulgariresortbali' FROM inserted_units WHERE name = 'Bulgari Resort Bali'
UNION ALL
SELECT id, 'instagram', 'bulgariresortbali', 'https://www.instagram.com/bulgariresortbali/' FROM inserted_units WHERE name = 'Bulgari Resort Bali'

UNION ALL
SELECT id, 'facebook', 'Artjakarta.ID', 'https://www.facebook.com/Artjakarta.ID/' FROM inserted_units WHERE name = 'Art Jakarta'
UNION ALL
SELECT id, 'instagram', 'artjakarta', 'https://www.instagram.com/artjakarta/' FROM inserted_units WHERE name = 'Art Jakarta'
UNION ALL
SELECT id, 'youtube', 'Art Jakarta', 'https://www.youtube.com/channel/UC6ENb2AwjHl1sv8Y94jNYtA' FROM inserted_units WHERE name = 'Art Jakarta';

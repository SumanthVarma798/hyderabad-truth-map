-- Aware India — initial schema (Issue #31, M1)
-- Spatial support
create extension if not exists postgis;

-- ── Admin hierarchy ─────────────────────────────────────────────
-- L1=state, L2=district, L3=mandal/zone, L4=ward, L5=locality (see #30)
create table admin_units (
  id            uuid primary key default gen_random_uuid(),
  level         smallint not null check (level between 1 and 5),
  name          text not null,
  parent_id     uuid references admin_units(id) on delete set null,
  state_code    text not null,
  lgd_code      text,                       -- Local Government Directory code
  centroid_lat  double precision,
  centroid_lng  double precision,
  created_at    timestamptz not null default now()
);
create index idx_admin_units_parent on admin_units(parent_id);
create index idx_admin_units_level on admin_units(level, state_code);

create table admin_level_labels (
  state_code text not null,
  level      smallint not null check (level between 1 and 5),
  label      text not null,
  primary key (state_code, level)
);

-- ── Contributors ────────────────────────────────────────────────
create table contributors (
  id                 uuid primary key default gen_random_uuid(),
  auth_user_id       uuid references auth.users(id) on delete set null,
  tier               text not null default 'anonymous'
                       check (tier in ('anonymous','verified','trusted','steward')),
  phone_hash         text,
  accuracy_score     double precision not null default 0,
  reputation_score   double precision not null default 0,
  quiz_last_passed_at timestamptz,
  created_at         timestamptz not null default now()
);

-- ── Area stories ────────────────────────────────────────────────
create table area_stories (
  id                uuid primary key default gen_random_uuid(),
  geo_id            text,                    -- stable external geo identifier
  admin_unit_id     uuid references admin_units(id) on delete set null,
  domain            text not null
                      check (domain in ('infrastructure','land_property','environment')),
  status            text not null default 'draft'
                      check (status in ('draft','published','resolved','archived')),
  narrative_summary text,
  confidence_score  double precision not null default 0,
  opened_at         timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  resolved_at       timestamptz
);
create index idx_area_stories_admin_status on area_stories(admin_unit_id, status);

-- ── Evidence items ──────────────────────────────────────────────
create table evidence_items (
  id             uuid primary key default gen_random_uuid(),
  story_id       uuid not null references area_stories(id) on delete cascade,
  type           text not null
                   check (type in ('citizen_report','satellite','official_record','document')),
  source_id      text,                       -- e.g. Sentinel-2 scene id, report id
  contributor_id uuid references contributors(id) on delete set null,
  trust_weight   double precision not null default 1.0,
  captured_at    timestamptz,
  payload_url    text,
  metadata       jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now()
);
create index idx_evidence_items_story on evidence_items(story_id);

-- ── Domain metadata (flexible per-domain fields) ────────────────
create table domain_metadata (
  story_id uuid not null references area_stories(id) on delete cascade,
  domain   text not null
             check (domain in ('infrastructure','land_property','environment')),
  metadata jsonb not null default '{}'::jsonb,
  primary key (story_id, domain)
);

-- ── Citizen reports ─────────────────────────────────────────────
create table reports (
  id             uuid primary key default gen_random_uuid(),
  contributor_id uuid references contributors(id) on delete set null,
  lat            double precision not null,
  lng            double precision not null,
  geom           geometry(Point, 4326)
                   generated always as (st_setsrid(st_makepoint(lng, lat), 4326)) stored,
  photo_url      text,
  description    text,
  admin_unit_id  uuid references admin_units(id) on delete set null,
  status         text not null default 'pending'
                   check (status in ('pending','reviewing','verified','disputed','rejected')),
  created_at     timestamptz not null default now()
);
create index idx_reports_status on reports(status);
create index idx_reports_geom on reports using gist(geom);

-- ── Row Level Security ──────────────────────────────────────────
alter table admin_units        enable row level security;
alter table admin_level_labels enable row level security;
alter table area_stories       enable row level security;
alter table evidence_items     enable row level security;
alter table domain_metadata    enable row level security;
alter table contributors       enable row level security;
alter table reports            enable row level security;

-- Public reference data: read-only to everyone
create policy "public read admin_units" on admin_units for select using (true);
create policy "public read admin_level_labels" on admin_level_labels for select using (true);

-- Stories & their evidence: public can read only published/resolved
create policy "public read published stories" on area_stories
  for select using (status in ('published','resolved'));
create policy "public read evidence of published stories" on evidence_items
  for select using (exists (
    select 1 from area_stories s
    where s.id = evidence_items.story_id and s.status in ('published','resolved')));
create policy "public read metadata of published stories" on domain_metadata
  for select using (exists (
    select 1 from area_stories s
    where s.id = domain_metadata.story_id and s.status in ('published','resolved')));

-- Reports: authenticated users can submit; can read own + verified
create policy "authenticated insert reports" on reports
  for insert to authenticated with check (true);
create policy "public read verified reports" on reports
  for select using (status = 'verified');
create policy "authenticated read own reports" on reports
  for select to authenticated
  using (contributor_id in (
    select id from contributors where auth_user_id = auth.uid()));

-- Contributors can read/update their own profile row
create policy "read own contributor" on contributors
  for select to authenticated using (auth_user_id = auth.uid());
create policy "update own contributor" on contributors
  for update to authenticated using (auth_user_id = auth.uid());

-- SiteFlow Housing v0.11.3
-- Adds an optional nightly room rate used by Costuri și facturare.
alter table public.accommodation_units
  add column if not exists nightly_cost numeric(12,2) not null default 0;

comment on column public.accommodation_units.nightly_cost is
  'Cost per room/night in EUR, used by SiteFlow Housing reports.';

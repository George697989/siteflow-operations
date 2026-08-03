-- SiteFlow v0.11.4 - arhivare fără ștergere
alter table public.accommodation_stays
  add column if not exists archived_at timestamptz;

create index if not exists accommodation_stays_archived_at_idx
  on public.accommodation_stays (archived_at);

comment on column public.accommodation_stays.archived_at is
  'Data la care cazarea a fost scoasă din evidența curentă și păstrată în istoric.';

-- SiteFlow v0.11.13
-- 1) permite alocarea unei locații la un șantier
-- 2) permite tarif specific pentru fiecare persoană/cazare

begin;

alter table public.locations
  add column if not exists site_id uuid null;

-- Creează FK doar dacă nu există deja și tabela sites este prezentă.
do $$
begin
  if to_regclass('public.sites') is not null
     and not exists (
       select 1 from pg_constraint
       where conname = 'locations_site_id_fkey'
         and conrelid = 'public.locations'::regclass
     ) then
    alter table public.locations
      add constraint locations_site_id_fkey
      foreign key (site_id) references public.sites(id)
      on update cascade on delete set null;
  end if;
end $$;

create index if not exists idx_locations_site_id
  on public.locations(site_id);

alter table public.accommodation_stays
  add column if not exists billing_rate_type text null,
  add column if not exists billing_rate_amount numeric(12,2) null,
  add column if not exists billing_share_percent numeric(6,2) not null default 100;

alter table public.accommodation_stays
  drop constraint if exists accommodation_stays_billing_rate_type_check;

alter table public.accommodation_stays
  add constraint accommodation_stays_billing_rate_type_check
  check (
    billing_rate_type is null or billing_rate_type in (
      'per_person_per_night',
      'per_bed_per_night',
      'per_room_per_night',
      'per_room_per_month'
    )
  );

alter table public.accommodation_stays
  drop constraint if exists accommodation_stays_billing_share_percent_check;

alter table public.accommodation_stays
  add constraint accommodation_stays_billing_share_percent_check
  check (billing_share_percent >= 0 and billing_share_percent <= 100);

-- Completează automat locația cu șantierul când toate cazările ei indică același șantier.
with inferred as (
  select au.location_id, (min(ast.site_id::text))::uuid as site_id
  from public.accommodation_stays ast
  join public.accommodation_units au on au.id = ast.unit_id
  where ast.site_id is not null
  group by au.location_id
  having count(distinct ast.site_id) = 1
)
update public.locations l
set site_id = i.site_id
from inferred i
where l.id = i.location_id
  and l.site_id is null;

comment on column public.locations.site_id is 'Șantierul comun căruia îi este alocată locația de cazare.';
comment on column public.accommodation_stays.billing_rate_type is 'Tip tarif: persoană/noapte, pat/noapte, cameră/noapte sau cameră/lună.';
comment on column public.accommodation_stays.billing_rate_amount is 'Tarif specific acestei persoane/cazări; dacă este null se folosește unit_rates.';
comment on column public.accommodation_stays.billing_share_percent is 'Procentul din tariful de cameră alocat persoanei, 0-100.';

commit;

select
  exists(select 1 from information_schema.columns where table_schema='public' and table_name='locations' and column_name='site_id') as locations_site_id_ok,
  exists(select 1 from information_schema.columns where table_schema='public' and table_name='accommodation_stays' and column_name='billing_rate_amount') as stay_rate_ok;

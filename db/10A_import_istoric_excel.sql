-- SPRINT 10A — import istoric corect din CAZARI_GERMANIA_APP_v2(1).xlsx
-- Interval Excel: 2026-06-28 — 2026-08-02
-- Generat automat; rulează în Supabase SQL Editor.

begin;
create temporary table tmp_hist_locations(city text,address text,name text) on commit drop;
insert into tmp_hist_locations values
('Brochterbeck','Rotdornweg 11; 48477 Hörstel','Brochterbeck — Rotdornweg 11; 48477 Hörstel'),
('Brochterbeck','Lengericher Str. 10 , 49545 Tecklenburg','Brochterbeck — Lengericher Str. 10 , 49545 Tecklenburg'),
('BRONHOF','Gartenstraße 15,97490 Poppenhausen','BRONHOF — Gartenstraße 15,97490 Poppenhausen'),
('BRONHOF','Albertshausener Str. 23, 97688 Bad Kissingen OT Albertshausen','BRONHOF — Albertshausener Str. 23, 97688 Bad Kissingen OT Albertshausen'),
('Deggendorf','INDUSTRIE STR.18,94459 DEGGENDORF','Deggendorf — INDUSTRIE STR.18,94459 DEGGENDORF'),
('Deggendorf','GOIDERTWEG 10,94469 DEGGENDORF','Deggendorf — GOIDERTWEG 10,94469 DEGGENDORF'),
('Deggendorf','Passauer Straße 18, 94491 Hengersberg, Deutschland','Deggendorf — Passauer Straße 18, 94491 Hengersberg, Deutschland'),
('Schwandorf','238 Schwandorf 92421 Rothlindestr 27','Schwandorf — 238 Schwandorf 92421 Rothlindestr 27'),
('Schwandorf','236 Schwandorf 92421 Rothlindestr 7 b','Schwandorf — 236 Schwandorf 92421 Rothlindestr 7 b');
insert into public.locations(name,address,city,country,location_type,structure_known,estimated_capacity,status,active,notes)
select name,address,nullif(city,''),'Germany','apartment',true,null,'active',true,'Import istoric Excel Sprint 10A' from tmp_hist_locations t
where not exists(select 1 from public.locations l where lower(trim(l.address))=lower(trim(t.address)));
create temporary table tmp_hist_units(city text,address text,room_name text,floor_label text,capacity int,rate numeric) on commit drop;
insert into tmp_hist_units values
('Brochterbeck','Rotdornweg 11; 48477 Hörstel','Camera 1','',2,23.5),
('Brochterbeck','Rotdornweg 11; 48477 Hörstel','Camera 2','',2,23.5),
('Brochterbeck','Lengericher Str. 10 , 49545 Tecklenburg','Camera 1','',2,23.5),
('Brochterbeck','Lengericher Str. 10 , 49545 Tecklenburg','Camera 2','',2,23.5),
('Brochterbeck','Lengericher Str. 10 , 49545 Tecklenburg','Camera 3','',2,23.5),
('BRONHOF','Gartenstraße 15,97490 Poppenhausen','Camera 1','1',2,25.0),
('BRONHOF','Gartenstraße 15,97490 Poppenhausen','Camera 2','1',2,25.0),
('BRONHOF','Gartenstraße 15,97490 Poppenhausen','Camera 3','1',2,25.0),
('BRONHOF','Albertshausener Str. 23, 97688 Bad Kissingen OT Albertshausen','Camera 1','1',2,25.0),
('BRONHOF','Albertshausener Str. 23, 97688 Bad Kissingen OT Albertshausen','Camera 2','1',2,25.0),
('BRONHOF','Albertshausener Str. 23, 97688 Bad Kissingen OT Albertshausen','Camera 3','1',2,25.0),
('Deggendorf','INDUSTRIE STR.18,94459 DEGGENDORF','Camera 9','1',1,21.5),
('Deggendorf','INDUSTRIE STR.18,94459 DEGGENDORF','Camera 1','1',2,21.5),
('Deggendorf','INDUSTRIE STR.18,94459 DEGGENDORF','Camera 2','1',2,21.5),
('Deggendorf','INDUSTRIE STR.18,94459 DEGGENDORF','Camera 3','1',3,21.5),
('Deggendorf','GOIDERTWEG 10,94469 DEGGENDORF','Camera 4','1',2,21.5),
('Deggendorf','GOIDERTWEG 10,94469 DEGGENDORF','Camera 5','1',2,21.5),
('Deggendorf','GOIDERTWEG 10,94469 DEGGENDORF','Camera 6','1',2,21.5),
('Deggendorf','Passauer Straße 18, 94491 Hengersberg, Deutschland','Camera 7','1',2,21.5),
('Deggendorf','Passauer Straße 18, 94491 Hengersberg, Deutschland','Camera 8','1',1,21.5),
('Schwandorf','238 Schwandorf 92421 Rothlindestr 27','Camera 1','1',2,26.0),
('Schwandorf','238 Schwandorf 92421 Rothlindestr 27','Camera 2','1',2,26.0),
('Schwandorf','238 Schwandorf 92421 Rothlindestr 27','Camera 3','1',2,26.0),
('Schwandorf','236 Schwandorf 92421 Rothlindestr 7 b','Camera 1','1',2,26.0);
insert into public.accommodation_units(location_id,name,unit_type,floor_label,capacity,beds_count,gender_policy,status,sort_order,active,capacity_confirmed,extra_beds_allowed,max_extra_beds,notes)
select l.id,u.room_name,'room',nullif(u.floor_label,''),greatest(u.capacity,1),greatest(u.capacity,1),'mixed','available',0,true,true,false,0,'Import istoric Excel Sprint 10A'
from tmp_hist_units u join public.locations l on lower(trim(l.address))=lower(trim(u.address))
where not exists(select 1 from public.accommodation_units au where au.location_id=l.id and lower(trim(au.name))=lower(trim(u.room_name)));
insert into public.unit_rates(unit_id,valid_from,valid_to,rate_type,amount,currency,includes_utilities,includes_cleaning,includes_tax,notes,active)
select au.id,date '2026-06-28',null,'per_person_per_night',u.rate,'EUR',true,false,false,'Tarif din Excel istoric',true
from tmp_hist_units u join public.locations l on lower(trim(l.address))=lower(trim(u.address)) join public.accommodation_units au on au.location_id=l.id and lower(trim(au.name))=lower(trim(u.room_name))
where u.rate>0 and not exists(select 1 from public.unit_rates ur where ur.unit_id=au.id and ur.valid_from=date '2026-06-28' and ur.rate_type='per_person_per_night');
create temporary table tmp_hist_people(full_name text) on commit drop;
insert into tmp_hist_people values
('Andrei Alina Elena'),
('Banulici Ioan Dorel'),
('Copanoi Constantin'),
('Coprean Silvestru Titus'),
('Cristian Daniel'),
('Darida Dorin Mark'),
('Darida Gheorghe Lucian'),
('Daszkal Istvan Sandor'),
('Daszkal Norbert'),
('Dominco Daniel'),
('Feher Balazs'),
('Florea Csaba'),
('Gal Csaba'),
('Gavrila Adrian Nicolae'),
('Gavrila Daniel Mihael'),
('Ghurka Daniel Alexandru'),
('Hainal Csaba'),
('Hietsoi Vadym'),
('Horvath Monica'),
('Horvath Vasile'),
('Huszti Karoly'),
('Kiss Szabolcs'),
('Koretskyi Ivan'),
('Lepadatu Romeo Ionut'),
('Lisnic Marius Calin'),
('Micu Mariana Angelica'),
('Mocanu Alexandru Stefan'),
('Mocanu Aurel'),
('Mocanu Doru'),
('Mona Levente Zsolt'),
('Mona Robert Ioan'),
('Olah Gheorghe'),
('Oprea Aron'),
('PROVIZORIU Traian'),
('Panea Ioan Kristisztian'),
('Poiana Constantin'),
('Probli Janos Joseph'),
('Rostas Ambroziu Adrian'),
('Rostas Ambroziu Valeriu'),
('Tanase Ștefan'),
('Trifan Olimpiu'),
('Ungurianu Ionel'),
('Vasiliu Marius Gabriel');
insert into public.people(full_name,company_name,person_type,status,active,accommodation_notes)
select full_name,'Alpin Sun','worker','active',true,'Import istoric Excel Sprint 10A' from tmp_hist_people p
where not exists(select 1 from public.people x where lower(regexp_replace(trim(x.full_name),'\s+',' ','g'))=lower(regexp_replace(trim(p.full_name),'\s+',' ','g')));
create temporary table tmp_hist_stays(person_name text,address text,room_name text,check_in date,check_out date,rate numeric) on commit drop;
insert into tmp_hist_stays values
('Andrei Alina Elena','Passauer Straße 18, 94491 Hengersberg, Deutschland','Camera 8',date '2026-07-05',date '2026-08-02',21.5),
('Banulici Ioan Dorel','Albertshausener Str. 23, 97688 Bad Kissingen OT Albertshausen','Camera 2',date '2026-07-22',date '2026-07-22',25.0),
('Banulici Ioan Dorel','Gartenstraße 15,97490 Poppenhausen','Camera 2',date '2026-07-23',date '2026-07-25',25.0),
('Banulici Ioan Dorel','INDUSTRIE STR.18,94459 DEGGENDORF','Camera 3',date '2026-07-05',date '2026-07-21',21.5),
('Copanoi Constantin','Lengericher Str. 10 , 49545 Tecklenburg','Camera 2',date '2026-07-07',date '2026-07-26',23.5),
('Coprean Silvestru Titus','INDUSTRIE STR.18,94459 DEGGENDORF','Camera 9',date '2026-07-05',date '2026-07-14',21.5),
('Coprean Silvestru Titus','Lengericher Str. 10 , 49545 Tecklenburg','Camera 3',date '2026-06-29',date '2026-07-04',23.5),
('Coprean Silvestru Titus','Lengericher Str. 10 , 49545 Tecklenburg','Camera 3',date '2026-07-19',date '2026-07-20',23.5),
('Cristian Daniel','Albertshausener Str. 23, 97688 Bad Kissingen OT Albertshausen','Camera 1',date '2026-07-22',date '2026-07-22',25.0),
('Darida Dorin Mark','Gartenstraße 15,97490 Poppenhausen','Camera 3',date '2026-06-29',date '2026-07-31',25.0),
('Darida Gheorghe Lucian','238 Schwandorf 92421 Rothlindestr 27','Camera 3',date '2026-07-05',date '2026-07-22',26.0),
('Daszkal Istvan Sandor','Albertshausener Str. 23, 97688 Bad Kissingen OT Albertshausen','Camera 2',date '2026-07-22',date '2026-07-22',25.0),
('Daszkal Istvan Sandor','Gartenstraße 15,97490 Poppenhausen','Camera 2',date '2026-07-23',date '2026-07-25',25.0),
('Daszkal Istvan Sandor','GOIDERTWEG 10,94469 DEGGENDORF','Camera 4',date '2026-07-05',date '2026-07-21',21.5),
('Daszkal Norbert','GOIDERTWEG 10,94469 DEGGENDORF','Camera 4',date '2026-07-12',date '2026-07-21',21.5),
('Dominco Daniel','INDUSTRIE STR.18,94459 DEGGENDORF','Camera 1',date '2026-07-05',date '2026-08-02',21.5),
('Feher Balazs','238 Schwandorf 92421 Rothlindestr 27','Camera 1',date '2026-07-23',date '2026-07-25',26.0),
('Feher Balazs','Gartenstraße 15,97490 Poppenhausen','Camera 2',date '2026-07-22',date '2026-07-22',25.0),
('Feher Balazs','Gartenstraße 15,97490 Poppenhausen','Camera 3',date '2026-06-29',date '2026-07-21',25.0),
('Florea Csaba','238 Schwandorf 92421 Rothlindestr 27','Camera 1',date '2026-07-05',date '2026-07-21',26.0),
('Florea Csaba','238 Schwandorf 92421 Rothlindestr 27','Camera 3',date '2026-07-22',date '2026-07-22',26.0),
('Gal Csaba','Lengericher Str. 10 , 49545 Tecklenburg','Camera 1',date '2026-06-29',date '2026-07-26',23.5),
('Gavrila Adrian Nicolae','Albertshausener Str. 23, 97688 Bad Kissingen OT Albertshausen','Camera 1',date '2026-07-22',date '2026-07-22',25.0),
('Gavrila Adrian Nicolae','Gartenstraße 15,97490 Poppenhausen','Camera 1',date '2026-07-05',date '2026-07-21',25.0),
('Gavrila Daniel Mihael','Gartenstraße 15,97490 Poppenhausen','Camera 1',date '2026-06-29',date '2026-07-21',25.0),
('Ghurka Daniel Alexandru','Lengericher Str. 10 , 49545 Tecklenburg','Camera 2',date '2026-06-29',date '2026-07-18',23.5),
('Hainal Csaba','238 Schwandorf 92421 Rothlindestr 27','Camera 2',date '2026-07-05',date '2026-07-22',26.0),
('Hietsoi Vadym','INDUSTRIE STR.18,94459 DEGGENDORF','Camera 3',date '2026-07-05',date '2026-08-02',21.5),
('Horvath Monica','Passauer Straße 18, 94491 Hengersberg, Deutschland','Camera 7',date '2026-07-05',date '2026-08-02',21.5),
('Horvath Vasile','Passauer Straße 18, 94491 Hengersberg, Deutschland','Camera 7',date '2026-07-05',date '2026-08-02',21.5),
('Huszti Karoly','238 Schwandorf 92421 Rothlindestr 27','Camera 2',date '2026-07-05',date '2026-07-22',26.0),
('Kiss Szabolcs','GOIDERTWEG 10,94469 DEGGENDORF','Camera 6',date '2026-07-12',date '2026-08-02',21.5),
('Koretskyi Ivan','INDUSTRIE STR.18,94459 DEGGENDORF','Camera 3',date '2026-07-05',date '2026-08-02',21.5),
('Lepadatu Romeo Ionut','Gartenstraße 15,97490 Poppenhausen','Camera 2',date '2026-06-29',date '2026-07-21',25.0),
('Lisnic Marius Calin','Lengericher Str. 10 , 49545 Tecklenburg','Camera 1',date '2026-06-29',date '2026-07-26',23.5),
('Micu Mariana Angelica','Lengericher Str. 10 , 49545 Tecklenburg','Camera 3',date '2026-06-29',date '2026-07-04',23.5),
('Micu Mariana Angelica','Lengericher Str. 10 , 49545 Tecklenburg','Camera 3',date '2026-07-19',date '2026-07-20',23.5),
('Mocanu Alexandru Stefan','INDUSTRIE STR.18,94459 DEGGENDORF','Camera 2',date '2026-07-05',date '2026-08-02',21.5),
('Mocanu Aurel','Albertshausener Str. 23, 97688 Bad Kissingen OT Albertshausen','Camera 1',date '2026-06-29',date '2026-07-21',25.0),
('Mocanu Aurel','Gartenstraße 15,97490 Poppenhausen','Camera 1',date '2026-07-22',date '2026-08-02',25.0),
('Mocanu Doru','Albertshausener Str. 23, 97688 Bad Kissingen OT Albertshausen','Camera 3',date '2026-06-29',date '2026-07-21',25.0),
('Mocanu Doru','Gartenstraße 15,97490 Poppenhausen','Camera 3',date '2026-07-22',date '2026-07-31',25.0),
('Mona Levente Zsolt','Albertshausener Str. 23, 97688 Bad Kissingen OT Albertshausen','Camera 2',date '2026-07-23',date '2026-07-24',25.0),
('Mona Levente Zsolt','GOIDERTWEG 10,94469 DEGGENDORF','Camera 6',date '2026-07-05',date '2026-07-22',21.5),
('Mona Robert Ioan','Rotdornweg 11; 48477 Hörstel','Camera 2',date '2026-06-29',date '2026-07-26',23.5),
('Olah Gheorghe','238 Schwandorf 92421 Rothlindestr 27','Camera 1',date '2026-07-05',date '2026-07-22',26.0),
('Oprea Aron','Gartenstraße 15,97490 Poppenhausen','Camera 1',date '2026-07-22',date '2026-07-31',25.0),
('Panea Ioan Kristisztian','236 Schwandorf 92421 Rothlindestr 7 b','Camera 1',date '2026-07-22',date '2026-07-25',26.0),
('Panea Ioan Kristisztian','238 Schwandorf 92421 Rothlindestr 27','Camera 3',date '2026-07-05',date '2026-07-21',26.0),
('Poiana Constantin','INDUSTRIE STR.18,94459 DEGGENDORF','Camera 1',date '2026-07-05',date '2026-08-02',21.5),
('Probli Janos Joseph','Rotdornweg 11; 48477 Hörstel','Camera 2',date '2026-06-29',date '2026-07-18',23.5),
('PROVIZORIU Traian','Albertshausener Str. 23, 97688 Bad Kissingen OT Albertshausen','Camera 3',date '2026-07-22',date '2026-07-25',25.0),
('Rostas Ambroziu Adrian','GOIDERTWEG 10,94469 DEGGENDORF','Camera 5',date '2026-07-05',date '2026-08-02',21.5),
('Rostas Ambroziu Valeriu','GOIDERTWEG 10,94469 DEGGENDORF','Camera 5',date '2026-07-05',date '2026-08-02',21.5),
('Tanase Ștefan','Rotdornweg 11; 48477 Hörstel','Camera 1',date '2026-07-05',date '2026-07-18',23.5),
('Trifan Olimpiu','236 Schwandorf 92421 Rothlindestr 7 b','Camera 1',date '2026-07-05',date '2026-07-25',26.0),
('Ungurianu Ionel','INDUSTRIE STR.18,94459 DEGGENDORF','Camera 2',date '2026-07-05',date '2026-08-02',21.5),
('Vasiliu Marius Gabriel','238 Schwandorf 92421 Rothlindestr 27','Camera 1',date '2026-07-23',date '2026-07-25',26.0),
('Vasiliu Marius Gabriel','Gartenstraße 15,97490 Poppenhausen','Camera 2',date '2026-06-29',date '2026-07-22',25.0);
insert into public.accommodation_stays(person_id,unit_id,site_id,check_in_date,check_out_date,status,stay_type,reason,notes)
select p.id,au.id,null,s.check_in,s.check_out,case when s.check_out < current_date then 'completed' when s.check_in > current_date then 'planned' else 'active' end,'historical','Import Excel corectat','CAZARI_GERMANIA_APP_v2(1).xlsx — Sprint 10A'
from tmp_hist_stays s
join public.people p on lower(regexp_replace(trim(p.full_name),'\s+',' ','g'))=lower(regexp_replace(trim(s.person_name),'\s+',' ','g'))
join public.locations l on lower(trim(l.address))=lower(trim(s.address))
join public.accommodation_units au on au.location_id=l.id and lower(trim(au.name))=lower(trim(s.room_name))
where not exists(select 1 from public.accommodation_stays st where st.person_id=p.id and st.unit_id=au.id and st.check_in_date=s.check_in and st.check_out_date is not distinct from s.check_out);
select public.sync_accommodation_statuses();
commit;

-- CONTROL
select count(*) as imported_people from tmp_hist_people; -- rulează înainte de COMMIT dacă dorești control intermediar

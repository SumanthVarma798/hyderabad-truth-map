-- Seed: Telangana → Hyderabad district → GHMC zones → sample wards
-- Level labels for Telangana (TG)
insert into admin_level_labels (state_code, level, label) values
  ('TG', 1, 'State'),
  ('TG', 2, 'District'),
  ('TG', 3, 'Zone'),
  ('TG', 4, 'Ward'),
  ('TG', 5, 'Locality');

-- L1 State
with state as (
  insert into admin_units (level, name, state_code, lgd_code, centroid_lat, centroid_lng)
  values (1, 'Telangana', 'TG', '36', 17.8495, 79.1151)
  returning id
),
-- L2 District
district as (
  insert into admin_units (level, name, parent_id, state_code, lgd_code, centroid_lat, centroid_lng)
  select 2, 'Hyderabad', id, 'TG', '536', 17.3850, 78.4867 from state
  returning id
),
-- L3 GHMC Zones (6 zones)
zones as (
  insert into admin_units (level, name, parent_id, state_code, centroid_lat, centroid_lng)
  select 3, z.name, district.id, 'TG', z.lat, z.lng
  from district, (values
    ('Charminar Zone', 17.3616, 78.4747),
    ('Khairatabad Zone', 17.4239, 78.4483),
    ('Secunderabad Zone', 17.4399, 78.4983),
    ('Serilingampally Zone', 17.4647, 78.3470),
    ('LB Nagar Zone', 17.3457, 78.5522),
    ('Kukatpally Zone', 17.4948, 78.4138)
  ) as z(name, lat, lng)
  returning id, name
)
-- L4 Sample wards under Khairatabad & Serilingampally (near key lakes)
insert into admin_units (level, name, parent_id, state_code, centroid_lat, centroid_lng)
select 4, w.name, zones.id, 'TG', w.lat, w.lng
from zones, (values
  ('Khairatabad Zone', 'Banjara Hills', 17.4156, 78.4347),
  ('Khairatabad Zone', 'Jubilee Hills', 17.4239, 78.4072),
  ('Serilingampally Zone', 'Gachibowli', 17.4401, 78.3489),
  ('Serilingampally Zone', 'Kondapur', 17.4615, 78.3677)
) as w(zone_name, name, lat, lng)
where zones.name = w.zone_name;

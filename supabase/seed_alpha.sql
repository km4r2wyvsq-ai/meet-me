-- Minimal alpha seed for Meet me
insert into interests (name) values
  ('Photography'),
  ('Travel'),
  ('Startups'),
  ('Food'),
  ('Books'),
  ('Design'),
  ('Fitness'),
  ('Careers')
on conflict (name) do nothing;

-- Optional starter groups after you create at least one profile:
-- replace <PROFILE_UUID> before running
-- insert into groups (name, slug, description, category, created_by)
-- values
--   ('Build in Public', 'build-in-public', 'Founders and makers sharing progress and lessons.', 'Startups', '<PROFILE_UUID>'),
--   ('City Walkers', 'city-walkers', 'Urban routes, local tips, and photography meetups.', 'Photography', '<PROFILE_UUID>');

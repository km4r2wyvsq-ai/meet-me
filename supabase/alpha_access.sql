create table if not exists alpha_access (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  email text not null,
  access_state text not null default 'pending' check (access_state in ('pending','approved','revoked')),
  invite_code text,
  note text default '',
  created_at timestamptz default now(),
  unique (profile_id),
  unique (email)
);

create table if not exists waitlist_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text default '',
  context text default '',
  status text not null default 'new' check (status in ('new','reviewed','invited','closed')),
  created_at timestamptz default now()
);

alter table alpha_access enable row level security;
alter table waitlist_requests enable row level security;

create policy "users can view own alpha access"
on alpha_access for select
to authenticated
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
      and (profiles.id = alpha_access.profile_id or profiles.role in ('admin','moderator'))
  )
);

create policy "admins can manage alpha access"
on alpha_access for all
to authenticated
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin','moderator')
  )
)
with check (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin','moderator')
  )
);

create policy "anyone can insert waitlist requests"
on waitlist_requests for insert
to anon, authenticated
with check (true);

create policy "admins can view waitlist requests"
on waitlist_requests for select
to authenticated
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin','moderator')
  )
);

create policy "admins can update waitlist requests"
on waitlist_requests for update
to authenticated
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin','moderator')
  )
);

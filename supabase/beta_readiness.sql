create table if not exists beta_invites (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'waitlist',
  state text not null default 'draft' check (state in ('draft','sent','accepted','expired')),
  invite_token text not null unique,
  notes text default '',
  created_at timestamptz default now()
);

create table if not exists onboarding_events (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  event_name text not null,
  event_detail text default '',
  created_at timestamptz default now()
);

alter table beta_invites enable row level security;
alter table onboarding_events enable row level security;

create policy "admins can manage beta invites"
on beta_invites for all
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

create policy "admins can view onboarding events"
on onboarding_events for select
to authenticated
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin','moderator')
  )
);

create policy "anyone can insert onboarding events"
on onboarding_events for insert
to anon, authenticated
with check (true);

create table if not exists referral_events (
  id uuid primary key default gen_random_uuid(),
  invite_id uuid references invites(id) on delete cascade,
  inviter_id uuid references profiles(id) on delete set null,
  accepted_by uuid references profiles(id) on delete set null,
  group_id uuid references groups(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists creator_daily_metrics (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  group_id uuid references groups(id) on delete cascade,
  metric_date date not null default current_date,
  invites_created integer not null default 0,
  invites_accepted integer not null default 0,
  posts_created integer not null default 0,
  comments_received integer not null default 0,
  unique (profile_id, group_id, metric_date)
);

alter table referral_events enable row level security;
alter table creator_daily_metrics enable row level security;

create policy "referral events viewable by moderators and creators"
on referral_events for select
to authenticated
using (
  inviter_id = auth.uid()
  or exists (
    select 1 from profiles
    where profiles.id = auth.uid() and profiles.role in ('moderator','admin')
  )
);

create policy "creator metrics viewable by owner and moderators"
on creator_daily_metrics for select
to authenticated
using (
  profile_id = auth.uid()
  or exists (
    select 1 from profiles
    where profiles.id = auth.uid() and profiles.role in ('moderator','admin')
  )
);

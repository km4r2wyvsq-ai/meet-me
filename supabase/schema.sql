create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key,
  username text unique not null,
  display_name text not null,
  bio text default '',
  avatar_url text,
  role text default 'member' check (role in ('member','moderator','admin')),
  created_at timestamptz default now()
);

create table if not exists interests (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

create table if not exists user_interests (
  user_id uuid references profiles(id) on delete cascade,
  interest_id uuid references interests(id) on delete cascade,
  primary key (user_id, interest_id)
);

create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text not null,
  category text,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

create table if not exists group_members (
  group_id uuid references groups(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  role text default 'member' check (role in ('member','moderator','admin')),
  created_at timestamptz default now(),
  primary key (group_id, profile_id)
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id) on delete cascade,
  group_id uuid references groups(id) on delete cascade,
  content text default '',
  image_url text,
  created_at timestamptz default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  author_id uuid references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

create table if not exists likes (
  post_id uuid references posts(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (post_id, profile_id)
);

create table if not exists follows (
  follower_id uuid references profiles(id) on delete cascade,
  following_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

create table if not exists invites (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references groups(id) on delete cascade,
  created_by uuid references profiles(id) on delete cascade,
  code text unique not null,
  created_at timestamptz default now()
);

create table if not exists invite_acceptances (
  id uuid primary key default gen_random_uuid(),
  invite_id uuid references invites(id) on delete cascade,
  accepted_by uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique (invite_id, accepted_by)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references groups(id) on delete cascade,
  author_id uuid references profiles(id) on delete cascade,
  content text default '',
  image_url text,
  created_at timestamptz default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  type text not null default 'system',
  title text not null,
  body text not null default '',
  read boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references profiles(id) on delete cascade,
  target_type text not null check (target_type in ('post','message','group','user')),
  target_id text not null,
  reason text not null,
  status text not null default 'open' check (status in ('open','reviewed','resolved')),
  created_at timestamptz default now()
);

create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete set null,
  event_name text not null,
  detail text not null default '',
  created_at timestamptz default now()
);

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

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

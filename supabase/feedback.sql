create table if not exists feedback_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete set null,
  email text,
  category text not null check (category in ('bug','idea','ux','performance','other')),
  message text not null,
  page text default '',
  status text not null default 'new' check (status in ('new','reviewed','planned','closed')),
  created_at timestamptz default now()
);

alter table feedback_items enable row level security;

create policy "users can create feedback"
on feedback_items for insert
to authenticated
with check (auth.uid() = profile_id);

create policy "users can view own feedback"
on feedback_items for select
to authenticated
using (
  profile_id = auth.uid()
  or exists (
    select 1 from profiles
    where profiles.id = auth.uid()
      and profiles.role in ('moderator','admin')
  )
);

create policy "moderators can update feedback"
on feedback_items for update
to authenticated
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
      and profiles.role in ('moderator','admin')
  )
);

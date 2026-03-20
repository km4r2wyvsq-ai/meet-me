alter table profiles enable row level security;
alter table interests enable row level security;
alter table user_interests enable row level security;
alter table groups enable row level security;
alter table group_members enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;
alter table likes enable row level security;
alter table follows enable row level security;
alter table invites enable row level security;
alter table invite_acceptances enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;
alter table reports enable row level security;
alter table audit_events enable row level security;

create policy "profiles are viewable by everyone"
on profiles for select
using (true);

create policy "users can update their own profile"
on profiles for update
using (auth.uid() = id);

create policy "interests are viewable by everyone"
on interests for select
using (true);

create policy "user interests are viewable by everyone"
on user_interests for select
using (true);

create policy "users can manage their own interests"
on user_interests for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "public groups are viewable by everyone"
on groups for select
using (true);

create policy "authenticated users can create groups"
on groups for insert
to authenticated
with check (auth.uid() = created_by);

create policy "memberships are viewable by everyone"
on group_members for select
using (true);

create policy "users can join themselves to groups"
on group_members for insert
to authenticated
with check (auth.uid() = profile_id);

create policy "users can leave their own memberships"
on group_members for delete
to authenticated
using (auth.uid() = profile_id);

create policy "posts are viewable by everyone"
on posts for select
using (true);

create policy "authenticated users can create posts"
on posts for insert
to authenticated
with check (auth.uid() = author_id);

create policy "users can edit their own posts"
on posts for update
to authenticated
using (auth.uid() = author_id);

create policy "comments are viewable by everyone"
on comments for select
using (true);

create policy "authenticated users can create comments"
on comments for insert
to authenticated
with check (auth.uid() = author_id);

create policy "likes are viewable by everyone"
on likes for select
using (true);

create policy "authenticated users can like posts"
on likes for insert
to authenticated
with check (auth.uid() = profile_id);

create policy "users can remove their own likes"
on likes for delete
to authenticated
using (auth.uid() = profile_id);

create policy "follows are viewable by everyone"
on follows for select
using (true);

create policy "users can create their own follows"
on follows for insert
to authenticated
with check (auth.uid() = follower_id);

create policy "users can remove their own follows"
on follows for delete
to authenticated
using (auth.uid() = follower_id);

create policy "invites are viewable by everyone"
on invites for select
using (true);

create policy "authenticated users can create invites"
on invites for insert
to authenticated
with check (auth.uid() = created_by);

create policy "invite acceptances are viewable by everyone"
on invite_acceptances for select
using (true);

create policy "authenticated users can accept invites for themselves"
on invite_acceptances for insert
to authenticated
with check (auth.uid() = accepted_by);

create policy "messages are viewable by everyone"
on messages for select
using (true);

create policy "authenticated users can create messages"
on messages for insert
to authenticated
with check (auth.uid() = author_id);

create policy "users can view their own notifications"
on notifications for select
to authenticated
using (auth.uid() = profile_id);

create policy "users can update their own notifications"
on notifications for update
to authenticated
using (auth.uid() = profile_id);

create policy "users can create reports"
on reports for insert
to authenticated
with check (auth.uid() = created_by);

create policy "report creators and moderators can view reports"
on reports for select
to authenticated
using (
  auth.uid() = created_by
  or exists (
    select 1 from profiles
    where profiles.id = auth.uid()
      and profiles.role in ('moderator', 'admin')
  )
);

create policy "moderators can update reports"
on reports for update
to authenticated
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
      and profiles.role in ('moderator', 'admin')
  )
);

create policy "users can view their own audit events"
on audit_events for select
to authenticated
using (
  profile_id = auth.uid()
  or exists (
    select 1 from profiles
    where profiles.id = auth.uid()
      and profiles.role in ('moderator', 'admin')
  )
);

create policy "authenticated users can create audit events"
on audit_events for insert
to authenticated
with check (profile_id = auth.uid());

create policy "Public can view media"
on storage.objects for select
using (bucket_id = 'media');

create policy "Authenticated can upload media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'media');

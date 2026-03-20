create or replace function increment_creator_metric(
  p_profile_id uuid,
  p_group_id uuid,
  p_invites_created integer default 0,
  p_invites_accepted integer default 0,
  p_posts_created integer default 0,
  p_comments_received integer default 0
) returns void
language plpgsql
as $$
begin
  insert into creator_daily_metrics (
    profile_id,
    group_id,
    metric_date,
    invites_created,
    invites_accepted,
    posts_created,
    comments_received
  )
  values (
    p_profile_id,
    p_group_id,
    current_date,
    p_invites_created,
    p_invites_accepted,
    p_posts_created,
    p_comments_received
  )
  on conflict (profile_id, group_id, metric_date)
  do update set
    invites_created = creator_daily_metrics.invites_created + excluded.invites_created,
    invites_accepted = creator_daily_metrics.invites_accepted + excluded.invites_accepted,
    posts_created = creator_daily_metrics.posts_created + excluded.posts_created,
    comments_received = creator_daily_metrics.comments_received + excluded.comments_received;
end;
$$;

create or replace function handle_invite_created_rollup()
returns trigger
language plpgsql
as $$
begin
  perform increment_creator_metric(new.created_by, new.group_id, 1, 0, 0, 0);
  return new;
end;
$$;

drop trigger if exists invites_rollup_trigger on invites;
create trigger invites_rollup_trigger
after insert on invites
for each row execute function handle_invite_created_rollup();

create or replace function handle_invite_accepted_rollup()
returns trigger
language plpgsql
as $$
declare
  v_inviter uuid;
  v_group uuid;
begin
  select created_by, group_id into v_inviter, v_group
  from invites
  where id = new.invite_id;

  if v_inviter is not null and v_group is not null then
    perform increment_creator_metric(v_inviter, v_group, 0, 1, 0, 0);
  end if;

  return new;
end;
$$;

drop trigger if exists invite_acceptances_rollup_trigger on invite_acceptances;
create trigger invite_acceptances_rollup_trigger
after insert on invite_acceptances
for each row execute function handle_invite_accepted_rollup();

create or replace function handle_posts_created_rollup()
returns trigger
language plpgsql
as $$
begin
  perform increment_creator_metric(new.author_id, new.group_id, 0, 0, 1, 0);
  return new;
end;
$$;

drop trigger if exists posts_rollup_trigger on posts;
create trigger posts_rollup_trigger
after insert on posts
for each row execute function handle_posts_created_rollup();

create or replace function handle_comment_received_rollup()
returns trigger
language plpgsql
as $$
declare
  v_post_author uuid;
  v_group uuid;
begin
  select author_id, group_id into v_post_author, v_group
  from posts
  where id = new.post_id;

  if v_post_author is not null and v_group is not null then
    perform increment_creator_metric(v_post_author, v_group, 0, 0, 0, 1);
  end if;

  return new;
end;
$$;

drop trigger if exists comments_rollup_trigger on comments;
create trigger comments_rollup_trigger
after insert on comments
for each row execute function handle_comment_received_rollup();

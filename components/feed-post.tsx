'use client';

import { useMemo, useState } from 'react';
import { Heart, MessageCircle, TrendingUp } from 'lucide-react';
import { Card, Pill } from '@/components/ui';
import { Comment, Post } from '@/lib/types';
import { useStore } from '@/lib/store';

export function FeedPost({ post }: { post: Post }) {
  const { state, toggleLikeOnPost, createCommentOnPost } = useStore();
  const comments = useMemo(() => state.comments.filter((comment) => comment.postId === post.id), [state.comments, post.id]);
  const [comment, setComment] = useState('');
  const [open, setOpen] = useState(false);

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-ink">{post.author}</div>
          <div className="text-sm text-slate-500">@{post.authorUsername} · {post.groupName} · {post.createdAt}</div>
        </div>
        <Pill>{post.groupName}</Pill>
      </div>
      {post.content ? <p className="text-sm leading-6 text-slate-700">{post.content}</p> : null}
      {post.image ? (
        <div className="overflow-hidden rounded-3xl border bg-slate-50">
          {post.image === 'gradient-card' ? (
            <div className="p-6 gradient-bg">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Photo drop</div>
              <div className="text-xl font-semibold text-ink">A polished visual card placeholder</div>
              <p className="mt-2 max-w-lg text-sm text-slate-600">This uses a safe local placeholder so the project works without remote image config.</p>
            </div>
          ) : (
            <img src={post.image} alt="Post attachment" className="max-h-[480px] w-full object-cover" />
          )}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-5 text-sm text-slate-500">
        <button className="flex items-center gap-2 hover:text-slate-800" onClick={() => toggleLikeOnPost(post.id, Boolean(post.likedByMe))}>
          <Heart size={16} fill={post.likedByMe ? 'currentColor' : 'none'} /> {post.likes}
        </button>
        <button className="flex items-center gap-2 hover:text-slate-800" onClick={() => setOpen((value) => !value)}>
          <MessageCircle size={16} /> {post.comments}
        </button>
        {post.trend ? <div className="flex items-center gap-2"><TrendingUp size={16} /> {post.trend}</div> : null}
      </div>

      {open ? (
        <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
          <div className="text-sm font-semibold text-ink">Comments</div>
          <div className="space-y-3">
            {comments.length ? comments.map((item: Comment) => (
              <div key={item.id} className="rounded-2xl bg-white p-3">
                <div className="text-sm font-semibold text-ink">{item.author}</div>
                <div className="text-sm text-slate-600">@{item.authorUsername} · {item.createdAt}</div>
                <div className="mt-2 text-sm text-slate-700">{item.content}</div>
              </div>
            )) : <div className="text-sm text-slate-500">No comments yet.</div>}
          </div>
          <div className="flex gap-3">
            <input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Write a comment..." />
            <button
              className="rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
              disabled={!comment.trim()}
              onClick={async () => {
                await createCommentOnPost(post.id, comment);
                setComment('');
              }}
            >
              Comment
            </button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

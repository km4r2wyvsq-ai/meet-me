import { supabase, supabaseEnabled } from '@/lib/supabase/client';

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '-');
}

export async function uploadImage(file: File, folder: 'avatars' | 'posts' | 'chat') {
  if (!supabaseEnabled || !supabase) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Could not read image'));
      reader.readAsDataURL(file);
    });
  }

  const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'media';
  const path = `${folder}/${Date.now()}-${sanitizeFileName(file.name)}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false
  });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

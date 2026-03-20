const checks = [
  'Dependencies installed',
  '.env.local created',
  'Supabase enabled',
  'SQL migrations executed',
  'Storage bucket created',
  'Realtime enabled',
  'App started',
  'Core routes verified'
];

console.log('Meet me first functional version checklist');
for (const item of checks) {
  console.log(`- ${item}`);
}

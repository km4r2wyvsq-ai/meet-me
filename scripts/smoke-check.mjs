const checks = [
  'package installed',
  'typecheck configured',
  'smoke command running'
];

console.log('Meet me smoke check');
for (const check of checks) {
  console.log(`- ${check}`);
}

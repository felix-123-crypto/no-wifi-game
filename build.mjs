import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const client = join(dist, 'client');
const files = [
  'index.html','styles.css','theme.css','app.js','economy.js','shop.html','shop.js','game.html','games.js',
  'voxel.html','voxel.js','football.html','football.js',
  'classics.html','classics.js','manifest.webmanifest','sw.js','og.png'
];

await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(join(dist, 'server'), { recursive: true });
await mkdir(join(dist, '.openai'), { recursive: true });
await mkdir(join(dist, '.openai', 'drizzle'), { recursive: true });
for (const file of files) {
  if (!existsSync(join(root, file))) throw new Error(`Missing required site file: ${file}`);
  await cp(join(root, file), join(client, file));
}
await cp(join(root, 'worker.js'), join(dist, 'server', 'index.js'));
if (existsSync(join(root, 'db', '0001_sync_profiles.sql'))) {
  await cp(join(root, 'db', '0001_sync_profiles.sql'), join(dist, '.openai', 'drizzle', '0001_sync_profiles.sql'));
}
if (existsSync(join(root, '.openai', 'hosting.json'))) {
  await cp(join(root, '.openai', 'hosting.json'), join(dist, '.openai', 'hosting.json'));
} else {
  await writeFile(join(dist, '.openai', 'hosting.json'), '{}\n');
}
for (const file of files.filter(file => file.endsWith('.html'))) {
  const html = await readFile(join(client, file), 'utf8');
  if (!html.includes('<!doctype html>')) throw new Error(`${file} is not a complete HTML document`);
}
console.log(`Built ${files.length} offline-ready assets.`);

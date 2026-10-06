import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const client = join(dist, 'client');
const files = [
  'index.html','styles.css','theme.css','app.js','economy.js','shop.html','shop.js','game.html','games.js','parkour.html','parkour.js',
  'voxel.html','voxel.js','football.html','football.js',
  'classics.html','classics.js','leaderboard.js','manifest.webmanifest','sw.js','og.png','audiowide.ttf','logo-arcade.png','sitemap.xml','robots.txt'
];

await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(join(dist, 'server'), { recursive: true });
await mkdir(join(dist, '.openai'), { recursive: true });
for (const file of files) {
  if (!existsSync(join(root, file))) throw new Error(`Missing required site file: ${file}`);
  await cp(join(root, file), join(client, file));
}
const gameHtmlPath = join(client, 'game.html');
const gameHtml = await readFile(gameHtmlPath, 'utf8');
const currentGameHtml = gameHtml.replace('src="games.js"', 'src="games.js?v=76"');
if (!currentGameHtml.includes('src="leaderboard.js"')) await writeFile(gameHtmlPath, currentGameHtml.replace('</body>', '<script src="leaderboard.js?v=76"></script></body>'));
await cp(join(root, 'worker.js'), join(dist, 'server', 'index.js'));
if (existsSync(join(root, '.openai', 'hosting.json'))) {
  await cp(join(root, '.openai', 'hosting.json'), join(dist, '.openai', 'hosting.json'));
} else {
  await writeFile(join(dist, '.openai', 'hosting.json'), '{}\n');
}
if (existsSync(join(root, 'drizzle'))) {
  await mkdir(join(dist, '.openai', 'drizzle'), { recursive: true });
  await cp(join(root, 'drizzle'), join(dist, '.openai', 'drizzle'), { recursive: true });
}
for (const file of files.filter(file => file.endsWith('.html'))) {
  const html = await readFile(join(client, file), 'utf8');
  if (!html.includes('<!doctype html>')) throw new Error(`${file} is not a complete HTML document`);
}
console.log(`Built ${files.length} offline-ready assets.`);

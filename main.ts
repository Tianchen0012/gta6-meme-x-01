// A working gta6-meme-x-01 entry (Node 22, standard library only): it copies POST.json from the
// repository root to /output/POST.json, where the gate reads it. That is all the program has to do.
// The entry is the post itself: the agent made a GTA 6 meme with make.fun's ghost mascot in the
// picture, it was posted on X from the public account @tianchen996 with make.fun (a link to the
// bounty page) and the play code makefun-fishbowl-helium-urchin in its text, POST.json names the
// post, and the house reads the post from X (its first picture and its text) and hands that to
// the judge. Nothing this program writes about the post is judged.
//
// The POST.json this repo ships holds the real post address, not the starter placeholder.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const postPath = join(BOT_DIR, 'POST.json');
const post = JSON.parse(readFileSync(postPath, 'utf8')) as { url?: unknown };
if (typeof post.url !== 'string' || !/^https:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/\d+$/.test(post.url)) {
  console.error(`POST.json does not hold a valid X post URL: ${JSON.stringify(post)}`);
  process.exit(1);
}
const handle = post.url.split('/')[3];
if (handle !== 'tianchen996') {
  console.error(`POST.json names @${handle}, expected @tianchen996`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(postPath, join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
console.log(`Copied POST.json for ${post.url}`);

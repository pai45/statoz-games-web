import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {buildOpenGolf} from '../scripts/build-open-golf.mjs';
test('Open Golf preserves the exact upstream engine and embeds all runtime resources',async()=>{
 const provenance=JSON.parse(await fs.readFile('vendor/open-golf/provenance.json','utf8'));
 for(const [file,sha] of Object.entries(provenance.files))assert.equal(createHash('sha256').update(await fs.readFile('vendor/open-golf/'+file)).digest('hex'),sha,file);
 const html=await buildOpenGolf({prelude:'<script>/*__STATOZ_BOOT__*/</script>'});
 assert.ok(html.includes('data-game="open-golf"'));assert.ok(html.includes('/*__STATOZ_BOOT__*/'));
 assert.ok(html.includes('Uint8Array.from(atob('));assert.ok(!/<script[^>]+src=/.test(html));
 assert.ok(html.includes('Michael Gerdes'));assert.ok(html.includes('open-golf.storage'));
 const manifest=JSON.parse(await fs.readFile('public/embedded-games/manifest.json','utf8'));
 const entry=manifest.games.find(g=>g.id==='open-golf');assert.equal(entry.sport,'golf');
 const bytes=await fs.readFile('public/embedded-games/'+entry.path);assert.equal(bytes.length,entry.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.sha256);
});

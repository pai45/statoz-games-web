import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
/** These files are local build inputs, never fetched implicitly from Downloads or a remote source. */
export async function verifyCricketerCharacters(root=process.cwd()) {
 const directory=path.join(root,'public/games/cricketer');
 const manifest=JSON.parse(await fs.readFile(path.join(directory,'characters-manifest.json'),'utf8'));
 if(manifest.schemaVersion!==1||manifest.localOnlyNativeMotion!==true)throw Error('Invalid Cricketer character manifest');
 for(const entry of manifest.files){if(!['player-shared.glb','source-motion.local.glb','PLAYER-LICENSE.txt'].includes(entry.path))throw Error('Unexpected Cricketer character input');let bytes;try{bytes=await fs.readFile(path.join(directory,entry.path));}catch{throw Error('Missing local Cricketer character input: '+entry.path+'. Restore the reviewed local files; no remote fallback is used.');}if(bytes.length!==entry.bytes||createHash('sha256').update(bytes).digest('hex')!==entry.sha256)throw Error('Cricketer character input hash mismatch: '+entry.path);if(entry.path.endsWith('.glb')&&(bytes.toString('ascii',0,4)!=='glTF'||bytes.readUInt32LE(4)!==2))throw Error('Invalid Cricketer GLB: '+entry.path);}
}

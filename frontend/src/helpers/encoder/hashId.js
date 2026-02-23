// helpers/hashId.js
// Simple hashids wrapper for obfuscating IDs in URLs
import Hashids from 'hashids';

const hashids = new Hashids('bloomfund-secret', 150); // salt + min length

export function encodeId(id) {
  return hashids.encode(id);
}

export function decodeId(hash) {
  return hashids.decode(hash)[0];
}

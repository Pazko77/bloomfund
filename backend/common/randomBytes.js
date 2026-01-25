import crypto from 'crypto';

function randomBytes(size = 64) {
	return crypto.randomBytes(size);
}
const secret = randomBytes().toString('hex');
console.log(secret);

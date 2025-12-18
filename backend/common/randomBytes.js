const randomBytes = require('crypto').randomBytes;
const secret = randomBytes(64).toString('hex');
console.log(secret);

const crypto = require('crypto');
const config = require('../../config.json');
const secretKey = config.crypto.secretKey;
const secretIV = config.crypto.secretIV;
const encMethod = 'aes-256-cbc';
const key = crypto.createHash('sha512').update(secretKey).digest('hex').substring(0,32)
const encIv = crypto.createHash('sha512').update(secretIV).digest('hex').substring(0,16)

export function encrypt(text) {
    const cipher = crypto.createCipheriv(encMethod, key, encIv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function decrypt(text) {
    const decipher = crypto.createDecipheriv(encMethod, key, encIv);
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
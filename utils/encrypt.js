require('dotenv').config()
const crypto = require('crypto')

// the env variable ENCRYPTION_KEY contains 32 random bytes as hex
// this is converted to a buffer to use as the secret key
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex')

// we are using the aes encryption algorithm
const algo = 'aes-256-cbc'

function encrypt(plainText) {
  // the Intialization Vector is random data which is mixed into the plainText before encryption
  // it ensures that encrypting the same plainText twice does not result in the same
  // encryptedText, which prevents attacks
  const iv = crypto.randomBytes(16)

  // cipher implements the aes algo with the key and IV
  const cipher = crypto.createCipheriv(algo, key, iv)

  // encrypt the text
  let encryptedText = cipher.update(plainText, 'utf8', 'hex')
  encryptedText += cipher.final('hex')

  // we prefix the encryption with the IV because we need to use the same IV to decrypt
  // it later on - it is ok for the IV to be public (but never the key)
  return iv.toString('hex') + ':' + encryptedText
}

function decrypt(input) {
  // split it into the IV which we prefixed
  // and the text we want to decrypt
  const parts = input.split(':')

  // turn the IV into a buffer (it is currently hex)
  const iv = Buffer.from(parts[0], 'hex')

  // this is the encrypted text we want to decrypt again
  const encryptedText = parts[1]

  // decipher the text and format as utf-8 so we can read it!
  const decipher = crypto.createDecipheriv(algo, key, iv)
  let decryptedText = decipher.update(encryptedText, 'hex', 'utf-8')
  decryptedText += decipher.final('utf8')

  return decryptedText
}

module.exports = { encrypt, decrypt }
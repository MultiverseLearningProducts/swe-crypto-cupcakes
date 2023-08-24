const jwt = require('jsonwebtoken')

/**
 * Parse and verify the token. If authentic, attach the payload to req.user
 * and pass to the next middleware.
 */
async function authorize(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const accessToken = authHeader.split(' ')[1]

  try {
    req.user = jwt.verify(accessToken, process.env['TOKEN_SECRET'])
    next()
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' })
  }
}

module.exports = authorize
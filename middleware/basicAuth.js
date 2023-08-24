/**
 * This middleware parses the email and password from the Authorization
 * header in the request, and attaches them to req.user
 */
function basicAuth(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const encodedCredentials = authHeader.split(' ')[1]
  const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString(
    'utf-8'
  )
  const [email, password] = decodedCredentials.split(':')

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  req.user = { email, password }
  next()
}

module.exports = basicAuth
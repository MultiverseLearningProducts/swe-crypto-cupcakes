require('dotenv').config()
const express = require('express')
const routes = require('./routes');
const { auth } = require('express-openid-connect');

const app = express()
const PORT = 4000

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:4000',
  clientID: 'r6k6Qugzo6DmFAuSjjmwtkiE9WlexKzr',
  issuerBaseURL: 'https://dev-kqcvt5qlx045drmf.us.auth0.com'
};


app.use(express.json())

app.use(auth(config))

app.use('/user', routes.user)
app.use('/cupcakes', routes.cupcake);

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
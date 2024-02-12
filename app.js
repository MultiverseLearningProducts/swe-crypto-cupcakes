require('dotenv').config()
const express = require('express')
const routes = require('./routes');
const { auth } = require('express-openid-connect');

const app = express()

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:4000',
  clientID: 'Fo2HohriMWn6bsc3FQKH0y5cB3H0uxZI',
  issuerBaseURL: 'https://dev-kqcvt5qlx045drmf.us.auth0.com'
};

app.use(express.json())

app.use(auth(config))

app.use('/user', routes.user)
app.use('/cupcakes', routes.cupcake);

module.exports = app;
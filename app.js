require('dotenv').config()
const express = require('express')
const app = express()
const PORT = 4000
const routes = require('./routes');
app.use(express.json())

app.use('/users', routes.user)
app.use('/cupcakes', routes.cupcake);

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
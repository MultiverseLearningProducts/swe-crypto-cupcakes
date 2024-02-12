const app = require('./app');
const PORT = 4000

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

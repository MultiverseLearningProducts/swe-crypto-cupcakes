const express = require('express')
const app = express()
const PORT = 4000

app.use(express.json())

// array to store cupcakes
const cupcakes = require('./seedData.json')

// generate a unique ID for each cupcake
let id = cupcakes.length

// create a new cupcake
app.post('/cupcakes', (req, res) => {
  const { flavor, instructions } = req.body

  // basic validation
  if (!flavor || !instructions) {
    return res
      .status(400)
      .json({ error: 'Flavor and instructions are required fields' })
  }

  const cupcake = {
    id: ++id,
    flavor,
    instructions
  }

  cupcakes.push(cupcake)
  res.status(201).json(cupcake)
})

// get all cupcakes
app.get('/cupcakes', (req, res) => {
  const { flavor } = req.query

  if (flavor) {
    const filteredCupcakes = cupcakes.filter(
      cupcake => cupcake.flavor.toLowerCase() === flavor.toLowerCase()
    )
    return res.json(filteredCupcakes)
  }

  res.json(cupcakes)
})

// get a snippet by ID
app.get('/cupcakes/:id', (req, res) => {
  const cupcakeId = parseInt(req.params.id)
  const cupcake = cupcakes.find(cupcake => cupcake.id === cupcakeId)

  if (!cupcake) {
    return res.status(404).json({ error: 'Cupcake not found' })
  }

  res.json(cupcake)
})

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
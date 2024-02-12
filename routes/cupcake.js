const router = require('express').Router();
const {encrypt, decrypt} = require('../utils/encrypt');
const { requiresAuth } = require('express-openid-connect')

// array to store cupcakes
const cupcakes = require('./seedData.json')

// generate a unique ID for each cupcake
let id = cupcakes.length

// create a new cupcake
router.post('/', requiresAuth(), (req, res) => {
  const { flavor, instructions } = req.body

  // basic validation
  if (!flavor || !instructions) {
    return res
      .status(400)
      .json({ error: 'Flavor and instructions are required fields' })
  }

  const cupcake = {
    id: ++id,
    ownerId: req.oidc.user.email,
    flavor,
    instructions
  }

  cupcakes.push({...cupcake, instructions: encrypt(instructions)});
  res.status(201).json(cupcake)
})

// get all cupcakes
router.get('/', requiresAuth(), (req, res) => {
  const { flavor } = req.query

  const decryptedCupcakes = cupcakes.map(cupcake => ({
    ...cupcake,
    instructions: decrypt(cupcake.instructions)
  }))
  if (flavor) {
    const filteredCupcakes = decryptedCupcakes.filter(
      cupcake => cupcake.flavor.toLowerCase() === flavor.toLowerCase()
    )
    return res.json(filteredCupcakes)
  }

  res.json(decryptedCupcakes)
})

// get a cupcake by ID
router.get('/:id', requiresAuth(), (req, res) => {
  const cupcakeId = parseInt(req.params.id)
  let cupcake = cupcakes.find(cupcake => cupcake.id === cupcakeId)

  if (!cupcake) {
    return res.status(404).json({ error: "Cupcake not found" });
  }

  cupcake = { ...cupcake, instructions: decrypt(cupcake.instructions) };
  res.json(cupcake);
});

// delete a cupcake by ID
// only the cupcake's owner is allowed to do this
router.delete("/:id", requiresAuth(), (req, res) => {
  for (let i = 0; i < cupcakes.length; i++) {
    if (cupcakes[i].id == req.params.id) {
      const cupcake = cupcakes[i];

      if (cupcake.ownerId != req.oidc.user.email) {
        return res.status(403).json({ error: "Forbidden" });
      }

      cupcakes.splice(i, 1);
      return res.status(200).json({ message: "Successfully deleted cupcake" });
    }
  }
  return res.status(404).json({ error: "Cupcake not found" });
});

module.exports = router;

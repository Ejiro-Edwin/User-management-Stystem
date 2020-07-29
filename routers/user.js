const router = require("express").Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/user');


router.post('/', [
  check("firstname", "Please Enter your firstname")
    .not()
    .isEmpty(),
  check("lastname", "Please Enter your lastname")
    .not()
    .isEmpty(),
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Password must have minimum of 7 characters").isLength({
    min: 7
  })
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    // Create a new user
    try {
      const user = new User(req.body)
      await user.save()
      const token = await user.generateAuthToken()
      res.status(201).send({ user, token })
    } catch (error) {
      res.status(400).send(error.message)
    }
  })

router.post('/login',
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password must have minimum of 7 characters").isLength({
      min: 7
    })
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    //Login a registered user
    try {
      const { email, password } = req.body
      const user = await User.findByCredentials(email, password)
      if (!user) {
        return res.status(401).send({ error: 'Login failed! Check authentication credentials' })
      }
      const token = await user.generateAuthToken()
      res.send({ user, token })
    } catch (error) {
      res.status(400).send(error.message)
    }

  })

router.get('/', async (req, res) => {

  //get all users
  let users;
  try {
    users = await User.find()
    if (!users) {
      return res.status(401).send({ error: 'Login failed! Check authentication credentials' })
    }
    res.send(users)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.get('/:id', async (req, res) => {
  //get a user
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(401).send({ error: 'Login failed! Check authentication credentials' })
    }
    res.send(user)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.get('/:name', async (req, res) => {
  //get a user
  try {
    const user = await User.findOne(req.body.firstname)
    if (!user) {
      return res.status(401).send({ error: 'Login failed! Check authentication credentials' })
    }
    res.send(user)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.put('/:id', async (req, res) => {
  //get a user
  try {
    const user = await User.findByIdAndUpdate(req.params.id)
    if (!user) {
      return res.status(401).send({ error: 'Login failed! Check authentication credentials' })
    }
    res.send(user)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(400).json('User does not exist');
    }
    res.status(200).json('User successfully deleted');
  } catch (error) {
    res.status(400).send(error.message)
  }
});

module.exports = router
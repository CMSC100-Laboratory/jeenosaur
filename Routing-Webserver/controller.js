const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/FARM-TO-TABLE', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
  .then(async () => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error: ', err));

// User Model
const User = mongoose.model('users', {
    firstName: { type: String, required: true },
    middleName: { type: String, required: false },
    lastName: { type: String, required: true },
    userType: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Find all users
exports.findAllUsers = (req, res, next) => {
  User.find((err, users) => {
    if (!err) { res.send(users) }
  })
}

// Find user by ID
exports.findByUserId = (req, res, next) => {
  if (!req.query.id) { return res.send('No id provided') }

  User.findOne({ _id: req.query.id}, (err, user) => {
    if (!err) { res.send(user) }
  })
}

/*
exports.findByTitlePOST = (req, res, next) => {
  console.log('find by post')
  console.log(req.body)
  if (!req.body.title) { return res.send('No title provided') }

  User.findOne({ title: req.body.title}, (err, user) => {
    if (!err) { res.send(user) }
  })
}
*/

// Add a new user
exports.addUser = (req, res, next) => {
  // Checks for missing fields
  if (!req.body.firstName || !req.body.lastName || !req.body.userType || !req.body.email || !req.body.password) {
    return res.send({ success: false, message: "Missing fields" });
  }

  // Checks for email validity
  const emailRegex = /^\S+@\S+\.\S+$/; // abc@def.ghi
  if (!emailRegex.test(req.body.email)) {
    return res.status(400).send({ success: false, message: "Invalid email format" });
  }

  // Checks for duplicate email
  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) {
      return res.status(500).send({ success: false, message: "Database error", error: err });
    }
    if (existingUser) {
      return res.status(400).send({ success: false, message: "Email already in use" });
    }
  });

  // Checks for password strength (at least 6 characters)
  if (req.body.password.length < 6) {
    return res.status(400).send({ success: false, message: "Password must be at least 6 characters long" });
  }

  // Create a new user instance
  const newUser = new User({
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    userType: req.body.userType,
    email: req.body.email,
    password: req.body.password,
  });

  // Save the new user to the database
  newUser.save((err) => {
    if (!err) {
      res.status(201).json(newUser);  
    } else {
      res.status(500).json({ message: 'Unable to save user', error: err });
    }
  });
};

// Delete user by ID
exports.deleteByUserId = (req, res, next) => {
  User.findOneAndDelete({ _id: req.body.id }, (err, user) => {
    if (!err && user) {
      res.send('Successfully deleted ' + user.firstName + ' ' + user.lastName)
    }
    else {
      res.send('Unable to delete user')
    }
  })
}
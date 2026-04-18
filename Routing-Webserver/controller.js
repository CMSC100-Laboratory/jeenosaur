const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/FARM-TO-TABLE', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('MongoDB connected');
    await addAdmin();
  })
  .catch((err) => console.log('MongoDB connection error: ', err));


// User Model
const User = mongoose.model('users', {
    firstName: { type: String, required: true },
    middleName: { type: String, required: false }, // optional
    lastName: { type: String, required: true },
    userType: { type: String, required: true }, // Customer or Admin
    email: { type: String, required: true },
    password: { type: String, required: true },
});



// --------------- POST --------------

// Add a new user
exports.addUser = async (req, res, next) => {
  // Checks for missing fields
  if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
    res.send({ success: false, message: "Missing required fields" });
  }

  // Checks for email validity
  const emailRegex = /^\S+@\S+\.\S+$/; // abc@def.ghi
  if (!emailRegex.test(req.body.email)) {
    res.send({ success: false, message: "Invalid email format" });
  }

  // Checks for password length (at least 6 characters)
  if (req.body.password.length < 6) {
    res.send({ success: false, message: "Password must be at least 6 characters long" });
  }

  // Checks for duplicate email
  let hasDuplicateEmail = await User.findOne({ email: req.body.email });

  // If there is no duplicate email
  if(hasDuplicateEmail == null){
    // Create a new user instance
    const newUser = new User({
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      userType: 'Customer', // Default user type
      email: req.body.email,
      password: req.body.password,
    });

    // Saves the user to the database successfully
    await newUser.save();
    
    res.send({ success: true, message: "User added successfully" });
  
  // If there is a duplicate email
  } else { 
    res.send({ success: false, message: "Email already exists" });
  }
};

exports.loginUser = async (req, res, next) => {
  // Checks for missing fields
  if (!req.body.email || !req.body.password) {
    res.send({ success: false, message: "Missing required fields" });
  }

  // Find the user by email
  const user = await User.findOne({ email: req.body.email });

  // If user is not found or password doesn't match
  if (!user || user.password !== req.body.password) {
    res.send({ success: false, message: "Invalid email or password" });
  
  // If login is successful
  } else {
    res.send({ success: true, message: "Login successful" });
    return user; // returns the user 
  }
};

// Checks if the user is an admin
function isAdmin (type) {
  return type === 'Admin';
};



// --------------- GET --------------

// Find all users
exports.findAllUsers = async (req, res, next) => {
  // Find the current logged user
  const requester = await User.findById(req.headers['x-user-id']);

  // Checks if the user is an admin
  if (!requester || !isAdmin(requester.userType)) { return res.send('Unauthorized'); }

  const users = await User.find();
  res.send(users);
}

// Find user by ID
exports.findByUserId = async (req, res, next) => {
  // Find the current logged user
  const requester = await User.findById(req.headers['x-user-id']);

  // Checks if the user is an admin
  if (!requester || !isAdmin(requester.userType)) { return res.send('Unauthorized'); }

  // Checks if id is provided
  if (!req.query.id) { return res.send('No id provided') }

  const user = await User.findOne({ _id: req.query.id });
  res.send(user);
}



// --------------- DELETE --------------

// Delete a user by ID
exports.deleteByUserId = async (req, res, next) => {
  // Find the current logged user
  const requester = await User.findById(req.headers['x-user-id']);

  // Checks if the user is an admin
  if (!requester || !isAdmin(requester.userType)) { return res.send('Unauthorized'); }

  const user = await User.findOneAndDelete({ _id: req.body.id });

  if (isAdmin(user.userType)) {
    // Checks if the id to be deleted is an admin
    res.send('Unable to delete an admin user')
  } else if (user) {
    res.send('Successfully deleted ' + user.firstName + ' ' + user.lastName)
  } else {
    res.send('Unable to delete user')
  }
};




// --------------- ADD ADMIN --------------
const addAdmin = async () => {
  const existing = await User.findOne({ email: 'admin@da.gov.ph' });
  if (!existing) {
    const admin = new User({
      firstName: 'Department',
      middleName: 'of',
      lastName: 'Agriculture',
      userType: 'Admin',
      email: 'admin@da.gov.ph',
      password: 'admin123',
    });
    await admin.save();
    console.log('Admin account created');
  }
};
const User = require('../models/User')

const isAdmin = (type) => type === 'Admin';

// POST /sign-up
exports.addUser = async (req, res, next) => {
  if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
    return res.send({ success: false, message: "Missing required fields" });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(req.body.email)) {
    return res.send({ success: false, message: "Invalid email format" });
  }

  if (req.body.password.length < 6) {
    return res.send({ success: false, message: "Password must be at least 6 characters long" });
  }

  let hasDuplicateEmail = await User.findOne({ email: req.body.email });

  if (hasDuplicateEmail == null) {
    const newUser = new User({
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      userType: 'Customer',
      email: req.body.email,
      password: req.body.password,
    });

    await newUser.save();
    res.send({ success: true, message: "User added successfully" });
  } else {
    res.send({ success: false, message: "Email already exists" });
  }
};

// POST /login
exports.loginUser = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.send({ success: false, message: "Missing required fields" });
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user || user.password !== req.body.password) {
    return res.send({ success: false, message: "Invalid email or password" });
  } else {
    res.send({
      success: true,
      message: "Login successful",
      user: { id: user._id.toString(), email: user.email, userType: user.userType }
    });
  }
};

// GET /find-all-users (Admin)
exports.findAllUsers = async (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!req.headers['x-user-id']) { return res.send('Unauthorized'); }
  if (!userId) { 
      return res.send({ success: false, message: 'Unauthorized: Missing credentials' }); 
  }
  const requester = await User.findById(req.headers['x-user-id']);
  if (!requester || !isAdmin(requester.userType)) { return res.send('Unauthorized'); }

  const users = await User.find();
  return res.send({ total: users.length, users: users });
};

// GET /find-by-user-id (Admin)
exports.findByUserId = async (req, res, next) => {
  const requester = await User.findById(req.headers['x-user-id']);
  if (!req.headers['x-user-id']) { return res.send('Unauthorized'); }
  if (!requester || !isAdmin(requester.userType)) { return res.send('Unauthorized'); }

  if (!req.query.id) { return res.send('No id provided'); }

  const user = await User.findOne({ _id: req.query.id });
  res.send(user);
};

// POST /delete-by-user-id (Admin)
exports.deleteByUserId = async (req, res, next) => {
  if (!req.headers['x-user-id']) { return res.send('Unauthorized'); }
  const userId = req.headers['x-user-id'];
  if (!userId) return res.send('Unauthorized');

  const requester = await User.findById(req.headers['x-user-id']);
  if (!requester || !isAdmin(requester.userType)) { return res.send('Unauthorized'); }

  const user = await User.findOneAndDelete({ _id: req.body.id });
  if (!user) { return res.send('Unable to delete user'); }
  if (isAdmin(user.userType)) {
    res.send('Unable to delete an admin user');
  } else if (user) {
    res.send('Successfully deleted ' + user.firstName + ' ' + user.lastName);
  } else {
    res.send('Unable to delete user');
  }
};

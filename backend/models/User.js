const mongoose = require('mongoose')

const User = mongoose.model('users', {
  firstName: { type: String, required: true },
  middleName: { type: String, required: false },
  lastName: { type: String, required: true },
  userType: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = User;

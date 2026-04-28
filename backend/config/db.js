const mongoose = require('mongoose')
const User = require('../models/User')

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

mongoose.connect('mongodb://localhost:27017/FARM-TO-TABLE', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('MongoDB connected');
    await addAdmin();
  })
  .catch((err) => console.log('MongoDB connection error: ', err));

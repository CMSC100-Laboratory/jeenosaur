const needle = require('needle');

// run `node index.js` in the terminal, then `node test.js` in another 
// Uncomment the needed code

// // Testing sign-up
// const userInfo = {
//     firstName: "John",
//     middleName: "Smith",
//     lastName: "Doe",
//     email: "john.doe@example.com",
//     password: "hello1234"
// };

// needle.post('http://localhost:3001/sign-up', userInfo, { json: true }, (err, res) => {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log('Response:', res.body);
//     }
// });

// // Testing login
// const loginData = {
//     email: "john.doe@example.com",
//     password: "hello1234"
// };

// needle.post('http://localhost:3001/login', loginData, { json: true }, (err, res) => {
//     console.log('Login Response:', res.body);
// });

// const ADMIN_ID = '69e3c0c5e7b9ff069836f368'; // Replace with admin user id

// // Testing find all users as an Admin
// needle.get('http://localhost:3001/find-all-users', { headers: { 'x-user-id': ADMIN_ID } }, (err, res) => {
//     if (err) console.error(err);
//     console.log('Find All Users (Admin Access):', res.body);
// });

// // Testing find all users as a Customer
// needle.get('http://localhost:3001/find-all-users', { headers: { 'x-user-id': '69e3c0d0e7b9ff069836f36b' } }, (err, res) => {
//     console.log('Find All Users (Customer Access):', res.body);
// });

// // Testing delete user by id as an Admin
// const deleteData = { id: TARGET_ID };

// needle.post('http://localhost:3001/delete-by-user-id', deleteData, { 
//     json: true, 
//     headers: { 'x-user-id': ADMIN_ID }}, (err, res) => {
//     console.log('Delete Response:', res.body);
// });
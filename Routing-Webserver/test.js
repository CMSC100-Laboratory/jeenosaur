const needle = require('needle');

const userInfo = {
    firstName: "John",
    middleName: "Smith",
    lastName: "Doe",
    userType: "Player",
    email: "john.doe@example.com",
    password: "password123"
};

const submitData = (userInfo) => {
    needle.post('http://localhost:3001/sign-up', userInfo, { json: true }, (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Response:', res.body);
        }
    });
};

submitData(userInfo);

// const clearDatabase = async () => {
//     needle.get('http://localhost:3001/find-all-users', (err, res) => {
//         if (err) return console.error(err);
        
//         const games = res.body;
//         console.log(`Found ${games.length} games to delete.`);

//         games.forEach(game => {
//             needle.post('http://localhost:3001/delete-by-user-id', { id: game._id }, { json: true }, (err, res) => {
//                 if (!err) console.log(`Deleted: ${game.title}`);
//             });
//         });
//     });
// };

// clearDatabase();
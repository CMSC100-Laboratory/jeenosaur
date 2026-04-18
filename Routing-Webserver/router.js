const controller = require('./controller');
module.exports = (app) => {

  // Allow Cross Origin Resource Sharing
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    next();
  })

  // Public routes
  app.post('/sign-up', controller.addUser)
  app.post('/login', controller.loginUser)

  // Customer routes

  // Admin routes
  app.get('/find-all-users', controller.findAllUsers)
  app.get('/find-by-user-id/', controller.findByUserId)
  app.post('/delete-by-user-id', controller.deleteByUserId)
  // app.post('/find-by-title-post', controller.findByTitlePOST) // galing pa sa example ng tutorial & baka magamit
}
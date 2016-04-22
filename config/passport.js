var passport = require('passport');
console.log('Passport session setup2');
// Teach our Passport how to serialize/dehydrate a user object into an id
passport.serializeUser(function(user, done) {
  console.log('Passport serializeUser');
  done(null, user.id);
});

// Teach our Passport how to deserialize/hydrate an id back into a user object
passport.deserializeUser(function(id, done) {
  console.log('Passport deserializeUser');
  User.findOne(id, function(err, user) {
    done(err, user);
  });
});

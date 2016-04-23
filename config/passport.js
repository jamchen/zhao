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


var LocalStrategy = require('passport-local').Strategy;
// Build our strategy and register it w/ passport
// (unfortunately the direct pass-it-in-to-authenticate usage
//  no longer works in the latest version of passport on npm)
passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({ username: username }, function (err, user) {
			if (err) { return done(err); }
			if (!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}
			console.log('user.password:', user.password, password);
			if (user.password !== password) {
				return done(null, false, {
					message: 'Invalid Password'
				});          
			} else {
				var returnUser = {
					username: user.username,
					createdAt: user.createdAt,
					id: user.id
				};
				return done(null, returnUser, {
					message: 'Logged In Successfully'
				});
			}
		});
	}
));
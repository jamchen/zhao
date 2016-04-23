/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */
var passport = require('passport');

module.exports.bootstrap = function(cb) {

	passport.serializeUser(function (user, next) {
		next(null, user.id);
	});

	passport.deserializeUser(function (id, next) {
		return sails.models.user.findOne(id).then(function (user) {
			next(null, user || null);
			return user;
		})['catch'](next);
	});
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};

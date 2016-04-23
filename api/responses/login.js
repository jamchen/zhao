/**
 * Module dependencies
 */

var passport = require('passport');
// var bcrypt = require('bcrypt');
// For reference, to get the constructor:
// var PassportAuthenticator = require('passport').constructor;
// -or-
// var PassportAuthenticator = require('passport').Passport;
// -or-
// var PassportAuthenticator = require('passport').Authenticator;


/**
 * res.login([opts])
 *
 * @param {String} opts.successRedirect
 * @param {String} opts.failureRedirect
 *
 * @description :: Log the requesting user in using a passport strategy
 * @help        :: See http://links.sailsjs.org/docs/responses
 */

module.exports = function login(opts) {

  // Get access to `req` and `res`
  var req = this.req;
  var res = this.res;

  // Merge provided options into defaults
  var passportOpts = _.extend({
    successRedirect: '/'
  }, opts || {});
  
  // Configure passport's login with our strategy
  var configuredLogin = passport.authenticate('local', function (err, user, info){
    console.log('RUNNING THE PASSPORT thing');
    if (err) return res.negotiate(err);
    if (!user) return res.forbidden(info);
    req.logIn(user, function (err) {
      if (err) return res.negotiate(err);
      return res.redirect(passportOpts.successRedirect);
    });
  });

  // {
  //   successRedirect: passportOpts.successRedirect ||'/success',
  //   failureRedirect: passportOpts.failureRedirect ||'/failure'
  // });



  // Run the configured login logic
  return configuredLogin(req, res, function afterwards (err) {
    if (err) return res.negotiate(err);
    return res.json({hellow:'world'});
    // return res.notFound();
  });
};
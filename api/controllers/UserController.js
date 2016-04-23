
var passport = require('passport');
/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	

  // _config: {
  //   actions: false,
  //   shortcuts: false,
  //   rest: false
  // },

  /**
   * `UserController.login()`
   */
  login: function (req, res) {
    return res.login({
      strategy: 'local',
      successRedirect: '/'
    });
  },


  /**
   * `UserController.logout()`
   */
  logout: function (req, res) {
    req.logout();
    return res.redirect('/');
  },


  /**
   * `UserController.signup()`
   */
  signup: function (req, res) {
    console.log('UserController signup');
      
    User.create(req.params.all()).exec(function (err, user) {
      if (err) return res.negotiate(err);
      if (req.login) {
      req.login(user, function (err){
        if (err) return res.negotiate(err);
        return res.redirect('/welcome');
      });

      }
    });
  },

  fbLogin: function(req, res) {
    return res.login({
      strategy: 'facebook',
      successRedirect: '/'
    });
        
  },

  fbAuthCallback: function(req, res) {
    return res.login({
      strategy: 'facebook',
      successRedirect: '/welcome'
    });
  }


};


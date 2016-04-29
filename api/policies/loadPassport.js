/**
 * loadPassport
 *
 * @module      :: Policy
 * @description :: Simple policy to populate possport to current user
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

	if (req.user) {
		User.findOne({
			id: req.user.id
 		}).populate('passports').exec(function (err, user){
			if (err) {
				sails.log.error('populate passports from user failed.', user, err);
			} else {
				if (user) {
					sails.log.info('load passports for user', user.passports)
					req.user = user;					
				} else {
					sails.log.error('find no user for ', user.id);
				}
			}

			next();
		});
	} else {
		return next();
	}
};

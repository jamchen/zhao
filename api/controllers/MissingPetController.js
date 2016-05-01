/**
 * MissingPetController
 *
 * @description :: Server-side logic for managing missingpets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment');

module.exports = {
	post: function(req, res) {
		return res.view();
	},

	detail: function(req, res) {
		moment.locale(req.getLocale());
		MissingPet.findOne({id: req.param('id')})
		.exec(function(err, missingPet) {
			if (err) {
				return res.serverError(err);
			}
			if (!missingPet) {
				return res.notFound();				
			}
			res.view('missingpet/detail', {
				missingPet: missingPet,
				moment: moment
			});
		});
	}
};


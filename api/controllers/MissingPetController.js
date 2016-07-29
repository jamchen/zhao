/**
 * MissingPetController
 *
 * @description :: Server-side logic for managing missingpets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment');
var _ = require('lodash');

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
	},

	master: function (req, res) {
		var criteria = {
			skip: 0,
			limit: 10,
			sort: 'updatedAt DESC'
		};
		_.assign(criteria, {
			skip: req.param('offset')||criteria.skip,
			limit: req.param('limit')||criteria.limit,
		});
		moment.locale(req.getLocale());
		MissingPet.find(criteria)
		.exec(function(err, missingPets) {
			if (err) {
				return res.serverError(err);
			}
			if (!missingPets) {
				return res.notFound();				
			}
			res.view('missingpet/master', {
				missingPets: missingPets,
				moment: moment
			});
		});
	}
};


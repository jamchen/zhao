/**
 * MissingPetController
 *
 * @description :: Server-side logic for managing missingpets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment');
var _ = require('lodash');
var co = require('co');

module.exports = {
    post: function(req, res) {
        return res.view();
    },

    detail: function(req, res) {
        moment.locale(req.getLocale());
        MissingPet.findOne({ id: req.param('id') })
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

    _getMissingPetsAsync: function(criteria) {
        return new Promise(function(fulfill, reject) {
            MissingPet.find(criteria)
                .exec(function(err, missingPets) {
                    if (err) {
                        reject(err);
                    } else {
                        fulfill(missingPets);
                    }
                });
        });
    },

    _getTotalCountAsync: function() {
    	return new Promise(function(fulfill, reject) {
            MissingPet.count()
                .exec(function(err, total) {
                    if (err) {
                        reject(err);
                    } else {
                        fulfill(total);
                    }
                });
        });
    },

    master: function(req, res) {
        var missingPetController = this;
        var criteria = {
            skip: 0,
            limit: 10,
            sort: 'updatedAt DESC'
        };
        _.assign(criteria, {
            skip: req.param('offset') || criteria.skip,
            limit: req.param('limit') || criteria.limit,
        });
        criteria.limit = Math.min(criteria.limit, 24);
        moment.locale(req.getLocale());

        co(function*() {
            var queryDB = yield {
            	missingPets: missingPetController._getMissingPetsAsync(criteria),
            	total: missingPetController._getTotalCountAsync()
            };
            if (!queryDB.missingPets) {
            	return res.notFound();
            }
            res.view('missingpet/master', {
            	missingPets: queryDB.missingPets,
            	total: queryDB.total,
            	moment: moment,
                limit: criteria.limit,
                offset: criteria.skip
            });            
        }).catch(function(err) {
            res.serverError(err);
        });


    }
};

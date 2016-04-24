var _ = require('lodash');
var _super = require('sails-auth/api/models/User');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.
  attributes: {
    missingPet: {
    	collection: 'missingPet',
    	via: 'creator'
    },
    picture: {
    	collection: 'picture',
    	via: 'uploader'
    },
    contactInfo: {
			collection: 'contactInfo',
			via: 'creator'
		}
  }
});
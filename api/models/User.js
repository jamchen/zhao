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
		},
    toJSON: function toJSON() {
      sails.log.debug('user.toJSON ');
      var user = _super.attributes.toJSON.apply(this);
      user.facebookProfilePicture = this.getFacebookProfilePicture();
      sails.log.debug('user.toJSON ', user);
      return user;
    },

    getFacebookProfilePicture: function getFacebookProfilePicture() {
      sails.log.debug('user passports', this.passports);
      // var facebookPassport = _.find(this.passports, { provider: 'facebook' });
      var facebookPassport = _.find(this.passports, function(o) { 
        sails.log.debug('passport', o);
        return 'facebook' === o.provider; 
      });
      sails.log.debug('facebookPassport', facebookPassport);
      if (facebookPassport && facebookPassport.identifier) {
      sails.log.debug('return');
        return 'https://graph.facebook.com/v2.6/'+facebookPassport.identifier+'/picture';
      }    
    },
  },

  beforeCreate: function beforeCreate(user, next) {
    sails.log.debug('user.beforeCreate', user);
    if (_super.beforeCreate) {
      _super.beforeCreate.apply(_super, arguments);
    }
  },

});
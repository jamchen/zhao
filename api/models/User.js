'use strict';

var _super = require('sails-auth/api/models/User');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.
  attributes: {
    missingPets: {
    	collection: 'missingPet',
    	via: 'creator'
    },
    pictures: {
    	collection: 'Picture',
    	via: 'uploader'
    },
    contactInfo: {
			collection: 'contactInfo',
			via: 'creator'
		},
    profilePicture: {
      type: 'string',      
    },

    toJSON: function toJSON() {
      var user = _super.attributes.toJSON.apply(this);
      user.facebookProfilePicture = this.getFacebookProfilePicture();
      return user;
    },

    getFacebookProfilePicture: function getFacebookProfilePicture() {
      return User._getFacebookProfilePictureUrl(_.find(this.passports, _.matches({ provider: 'facebook' })));
    },
  },

  beforeCreate: function beforeCreate(user, next) {
    user.profilePicture = User.getGravatarUrl(user.email);
    if (_super.beforeCreate) {
      _super.beforeCreate.apply(_super, arguments);
    }
  },

  afterConnectToPassport: function afterConnectToPassport(user, passport, next) {
    if ('facebook' === passport.provider) {
      User.update(
        {id: user.id}, 
        {profilePicture: this._getFacebookProfilePictureUrl(passport)}
      ).exec(function(err, updated) {
        next(null, user);
      });
    } else {
      next(null, user);
    }    
  },

  _getFacebookProfilePictureUrl: function _getFacebookProfilePictureUrl(facebookPassport) {
    if (facebookPassport && facebookPassport.identifier) {
      return 'https://graph.facebook.com/v2.6/'+facebookPassport.identifier+'/picture';
    }
  }

});
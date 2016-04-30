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
      var facebookPassport = _.find(this.passports, _.matches({ provider: 'facebook' }));
      if (facebookPassport && facebookPassport.identifier) {
        return 'https://graph.facebook.com/v2.6/'+facebookPassport.identifier+'/picture';
      }    
    },
  },

  beforeCreate: function beforeCreate(user, next) {
    user.profilePicture = _super.attributes.getGravatarUrl(user.email);
    if (_super.beforeCreate) {
      _super.beforeCreate.apply(_super, arguments);
    }
  },

});
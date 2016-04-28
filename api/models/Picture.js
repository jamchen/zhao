/**
 * Picture.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	url: {
  		type: 'string',
  		required: true,  		
  	},
  	missingPet: {
  		model: 'missingPet',
  		via: 'picture',
  		required: true,
  	},
  	uploader: {
  		model: 'user',
  		via: 'picture',
  		required: true,
  	}
  }
};

/**
 * MissingPet.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        name: {
            type: 'string',
            required: true
        },
        kind: {
            type: 'string',
            required: true
        },
        gender: {
            type: 'string',
            required: true,
            enum: ['male', 'female']
        },
        color: {
            type: 'string',
            required: true
        },
        weight: {
            type: 'integer',
            required: true,
        },
        neuter: {
            type: 'boolean',
            required: true,
        },
        hasMicrochip: {
            type: 'boolean',
            required: true,
        },
        hasCollars: {
            type: 'boolean',
            required: true,
        },
        breed: {
            type: 'string',
        },
        location: {
            type: 'string',
            required: true
        },
        missingDate: {
            type: 'datetime',
            required: true
        },
        mainPictureUrl: {
            type: 'string'
        },
        description: {
            type: 'text'
        },
        age: {
            type: 'integer'
        },
        pictures: {
            collection: 'Picture',
            via: 'missingPet'
        },
        contactInfo: {
            model: 'contactInfo',
            via: 'missingPet'
        },
        creator: {
            model: 'user',
            required: true,
            via: 'missingPets'
        }
    }
};

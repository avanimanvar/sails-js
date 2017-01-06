/**
 * AccessKey.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

   attributes: {
        access_key: {
            type: 'string',
            required: true,
            unique: true
        },
        plateform: {
            type: 'string',
            required: true
        },
    },

    saveAccessKey: function (inputs, cb) {
    // Create a AccessKey
    AccessKey.create({
      access_key: inputs.access_key,
      plateform: inputs.plateform,
    })
      .exec(cb);
  },
};


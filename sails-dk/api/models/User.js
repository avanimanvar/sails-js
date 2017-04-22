/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

// connection: 'someMysqlServer',
  attributes: {
    email: {
      type: 'email',
      required: true,
      unique: true,
    },
    password: {
      type: 'string',
      required: true
    },
    name: {
      type: 'string',
      required: true
    },
    profile_photo: {
      type: 'string',
      required: false
    },
  },

  signup: function (inputs, cb) {
    // Create a user
    User.create({
      name: inputs.name,
      email: inputs.email,

      // TODO: But encrypt the password first
      password: inputs.password
    })
      .exec(cb);
  },

  attemptLogin: function (inputs, cb) {
    // Create a user
    User.findOne({
      email: inputs.email,
      // TODO: But encrypt the password first
      password: inputs.password
    })
    .exec(cb);
  }

};


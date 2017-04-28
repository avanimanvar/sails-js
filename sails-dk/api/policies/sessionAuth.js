/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

var jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  // if (req.session.authenticated) {
  //  return next();
  //}
  if (!req.headers.jwtoken && !req.headers.authorization) {
    return res.forbidden({ success: false, message: 'You are not permitted to perform this action.' });
  } 
  var authorizationToken = req.headers.jwtoken ? req.headers.jwtoken : req.headers.authorization;
  jwt.verify(authorizationToken, sails.config.jwtSecret, function (err, decoded) {
    if (err) {
      return res.json({ success: false, message: 'Failed to authenticate token.' });
    } else {
      User.findOne({ id: decoded.user }).exec(function (err, records) {
        if (err) {
          return res.json({ success: false, message: "No data found" });
        }
        if (!records) {
          return res.forbidden('You are not permitted to perform this action.');
        }
        req.currentUserDetails = records;
        next();
      });
    }
  });
};

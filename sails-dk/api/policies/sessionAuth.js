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

  if (!req.headers.jwtoken) {
    return res.forbidden({ success: false, message: 'You are not permitted to perform this action.' });
  }

  jwt.verify(req.headers.jwtoken, sails.config.jwtSecret, function (err, decoded) {
    if (err) {
      return res.json({ success: false, message: 'Failed to authenticate token.' });
    } else {
      // if everything is good, save to request for use in other routes
      //req.decoded = decoded;
      //next();
      
      User.findOne({ id: decoded.user }).exec(function (err, records) {
        if (err) {
          return res.json({ success: false, message: "No data found" });
        }

        if (!records) {
          return res.forbidden('You are not permitted to perform this action.');
        }
        req.body.currentUserDetails = records;
        
        next();

      });
    }
  });
};

/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var jwt = require('jsonwebtoken');

module.exports = {
    index: function (req, res) {
        User.find().paginate({ page: 1, limit: 50 }).exec(function (err, records) {
            if (err) {
                return res.json({ success: false, message: "No data found" });
            }
            return res.json({ success: true, data: records });
        });
    },

    details: function (req, res) {
        if (req.body.currentUserDetails) {
            return res.json({ success: true, data: req.body.currentUserDetails });
        }
        User.findOne({ id: req.params.id }).exec(function (err, records) {
            if (err) {
                return res.json({ success: false, message: "No data found" });
            }
            return res.json({ success: true, data: records });
        });
    },

    profiles: function (req, res) {
        var currntUserId = req.body.currentUserDetails.id;
        req.file('avatar').upload({
            dirname: require('path').resolve(sails.config.appPath, 'assets/images')
        }, function (err, uploadedFiles) {

            if (err) return res.json({ status: false, message: "Please try againg" });;
            var fileNames = [];
            uploadedFiles.forEach(function (value) {
                fileNames.push(value.filename);
            });
            
            if (fileNames.length > 1) {
                var updateCondition = { profile_photo: JSON.stringify(fileNames), name: req.body.name };
            } else {
                var updateCondition = { name: req.body.name };
            }
            
            User.update({ id: currntUserId }, updateCondition).exec(function afterwards(err, updated) {
                if (err) {
                    return res.json({ status: false, message: "Please try againg" });
                }
                return res.json({
                    status: true, data: updated
                });
            });
        });
    },

    /**
     * `UserController.signup()`
     */
    signup: function (req, res) {

        // Attempt to signup a user using the provided parameters
        User.signup({
            name: req.param('name'),
            email: req.param('email'),
            password: req.param('password')
        }, function (err, user) {
            if (err) {
                return res.badRequest({ success: false, message: "Email already exits" });
            }
            var token = jwt.sign({ user: user.id }, sails.config.jwtSecret, { expiresIn: sails.config.jwtExpires });

            if (req.wantsJSON) {
                return res.json({ success: true, jwtoken: token });
            }

        });
    },

    login: function (req, res) {

        // Look up the user
        User.attemptLogin({
            email: req.param('email'),
            password: req.param('password'),
        }, function (err, user) {
            if (err) return res.negotiate(err);
            if (!user) {

                // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
                // send a 200 response letting the user agent know the login was successful.
                // (also do this if no `invalidRedirect` was provided)
                if (req.wantsJSON || !inputs.invalidRedirect) {
                    return res.badRequest({ success: false, message: 'Invalid username/password combination.' });
                }
                // Otherwise if this is an HTML-wanting browser, redirect to /login.
                return res.view('login');
            }

            var token = jwt.sign({ user: user.id }, sails.config.jwtSecret, { expiresIn: sails.config.jwtExpires });
            return res.json({ success: true, token: token });

        });

    },
};



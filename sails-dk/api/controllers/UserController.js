/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var jwt = require('jsonwebtoken');

module.exports = {
    index: function (req, res) {
        User.find().paginate({ page: 1, limit: 2 }).exec(function (err, records) {
            if (err) {
                return res.json({ message: "No data found" });    
            }
            return res.json({ data: records });
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
            // res.negotiate() will determine if this is a validation error
            // or some kind of unexpected server error, then call `res.badRequest()`
            // or `res.serverError()` accordingly.
            if (err) return res.negotiate(err);

            // Go ahead and log this user in as well.  We do this by issuing a JWT token for them.
            var token = jwt.sign({ user: user.id }, sails.config.jwtSecret, { expiresIn: sails.config.jwtExpires });

            // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
            // send a 200 response letting the user agent know the signup was successful.
            if (req.wantsJSON) {
                return res.json({ token: token });
            }

            // Otherwise if this is an HTML-wanting browser, redirect to /welcome.
            //return res.redirect('/welcome');
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
                    return res.badRequest({ error: 'Invalid username/password combination.' });
                }
                // Otherwise if this is an HTML-wanting browser, redirect to /login.
                return res.view('login');
            }

            var token = jwt.sign({ user: user.id }, sails.config.jwtSecret, { expiresIn: sails.config.jwtExpires });
            return res.json({ token: token });

        });

    },
};


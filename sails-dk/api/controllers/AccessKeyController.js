/**
 * AccessKeyController
 *
 * @description :: Server-side logic for managing acesskeys
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var uuid = require('node-uuid');

module.exports = {
    index: function (req, res) {
        var uniqueId = uuid.v4();

        var publicKey = req.params.publickey;
        console.log(sails.config.publicKey);
        if (sails.config.publicKey == publicKey) {
            AccessKey.saveAccessKey({
                access_key : uniqueId,
                plateform: 'mobile'
            }, function (err, user) {
                console.log(user);
                console.log(err);
                return res.json({ access_key: uniqueId });
            });
            
        } else {
            return res.badRequest({ error: 'Invalid public Key' });
        }
    },
};


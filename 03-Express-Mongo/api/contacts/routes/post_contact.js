const express = require('express');
const mongoose = require('mongoose');
const Contact = require('../model/Contact');
const router = express.Router();


var uuid = require('node-uuid');
var md5 = require('js-md5');



router.route('/')
  .post((req, res) => {

    var rerData = req.body;
    rerData.user_key = uuid.v1();
    //md5(req.body.password);


    const contact = new Contact(rerData);
    var email = rerData.email;

    if (!rerData.password) {
      console.log('in');
      res.status(400).json({
        "errors": {
          "password": {
            "message": "Password is missing.",
            "name": "ValidatorError"
          }
        },
        "message": "Password field is missing",
        "name": "ValidationError"
      });
      res.end();
    } else {
      Contact.findOne({ email }, (err, rerData) => {
        if (err) {
          res.status(400).json(err);
        }
        if (rerData) {
          res.status(400).json({
            "errors": {
              "email": {
                "message": "Email` is duplicate.",
                "name": "ValidatorError"
              }
            },
            "message": "Contact email is duplicate",
            "name": "ValidationError"
          });
        }
        if (!rerData) {

          contact.password = md5(req.body.password);
          contact.save((err, contact) => {
            if (err) {
              res.status(400).json(err);
            }
            res.json({ message: 'Contact saved! ', success: true });
          });
        }
      });
    }





  });

module.exports = router;
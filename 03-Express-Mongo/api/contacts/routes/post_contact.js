const express = require('express');
const mongoose = require('mongoose');
const Contact = require('../model/Contact');
const router = express.Router();

router.route('/')
  .post((req, res) => {

    var rerData = req.body;
    rerData.user_key = "dkvasani"

    const contact = new Contact(rerData);
    var email = rerData.email;

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
        contact.save((err, contact) => {
          if (err) {
            res.status(400).json(err);
          }
          res.json({ message: 'Contact saved! ', success:true });
        });
      }
    });



  });

module.exports = router;
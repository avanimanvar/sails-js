const express = require('express');
const mongoose = require('mongoose');
const Contact = require('../model/Contact');
const router = express.Router();

router.route('/')
  .post((req, res) => {

var rerData = req.body;
rerData.user_key = "dkvasani"
console.log(rerData);
    const contact = new Contact(rerData);

    contact.save((err, contact) => {
      if (err) {
        res.status(400).json(err);
      }
      console.log(req.body);
      res.json(contact);
      // res.json({ message: 'Contact saved! '});
    });
    
  });

module.exports = router;
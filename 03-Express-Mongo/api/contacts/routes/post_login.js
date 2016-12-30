const express = require('express');
const mongoose = require('mongoose');
const Contact = require('../model/Contact');
const router = express.Router();
var paginate = require('express-paginate');
var md5 = require('js-md5');

router.route('/')
  .post((req, res) => {

    var email = req.body.email;
    var password = req.body.password;
    if (!email || !password) {
      res.json({status: false, message: "Email or password is missing"});
    }

    var password = md5(password);
    
    Contact.find({email: email, password: password}, (err, contacts) => {
      if (err) {
        res.status(400).json({status: false, message: "Invalid Email or password"});
      }
      
      if (contacts.length == 0) {
        res.status(400).json({status: false, message: "Invalid Email or password"});
      } else {
        var responseData = {data: contacts, status: true, message: "success"}
        res.json(responseData);
      }
      
    });
  });

module.exports = router;
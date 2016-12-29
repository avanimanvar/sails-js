const express = require('express');
const mongoose = require('mongoose');
const Contact = require('../model/Contact');
const router = express.Router();
var paginate = require('express-paginate');

router.route('/:page')
  .get((req, res) => {

    // Find all contacts
    // Contact.find({}, (err, contacts) => {
    //   if (err) {
    //     res.status(400).json(err);
    //   }
    //   res.json(contacts);
    // });

    var pageNumber = req.params.page;
    console.log(pageNumber);
    Contact.paginate({}, { page: pageNumber, limit: 3 }, function (err, result) {

      if (err) {
        res.status(400).json(err);
      }
      res.json(result);
      // result.docs
      // result.total
      // result.limit - 10
      // result.offset - 20
    });

  });

module.exports = router;
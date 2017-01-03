'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const uriUtil = require('mongodb-uri');

var paginate = require('express-paginate');
var mongoosePaginate = require('mongoose-paginate');

var validator = require("email-validator");


//file upload related module
var fs = require('fs-extra');
let busboy = require('connect-busboy');
var fileUpload = require('express-fileupload');

//Email related module
var mailer = require('express-mailer');


const app = express();

//Set view folder
app.set('views', __dirname + '/views');

//Set template engine
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({ extended: true }));
app.use(cors());
app.use(paginate.middleware(10, 50));

//Used for the fille upload
app.use(busboy());

//Used for the fille upload
app.use(fileUpload())

const mongodbUri = 'mongodb://localhost:27017/exampleDb';
const mongooseUri = uriUtil.formatMongoose(mongodbUri);
const dbOptions = {};


// Email sending configurations
mailer.extend(app, {
  from: 'no-reply@example.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'test1.multidots@gmail.com',
    pass: 'thinker99d'
  }
});

//file upload with busboy
app.post('/upload', function (req, res) {
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    var fstream = fs.createWriteStream('./images/' + filename);
    file.pipe(fstream);
    fstream.on('close', function () {
      res.json('upload succeeded!');
    });
  });

});


//file upload with express file upload
app.post('/fileupload', function (req, res) {
  var sampleFile;
  var fileName;

  if (!req.files) {
    res.send('No files were uploaded.');
    return;
  }

  sampleFile = req.files.sampleFile;
  fileName = req.files.sampleFile.name;
  sampleFile.mv('./images/' + fileName, function (err) {
    if (err) {
      res.status(500).send(err);
    }
    else {
      res.send('File uploaded!');
    }
  });
});

app.post('/sendemail', function (req, res, next) {
  var email = req.body.email;
  if (!email) {
    res.json({ message: 'There was an error sending the email' });
  }
  if (validator.validate(email)) {
    app.mailer.send('email', {
      to: 'dharmesh.vasani@multidots.in', // REQUIRED. This can be a comma delimited string just like a normal email to field. 
      subject: 'Test Email', // REQUIRED.
      otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
    }, function (err) {
      if (err) {
        // handle error
        res.json({ message: 'There was an error sending the email' });
        return;
      }
      res.send({ message: 'Email Sent' });
    });
  } else {
    res.json({ message: 'Email is invalid' });
  }
});

app.use('/api/contacts', require('./api/contacts/routes/post_contact'));
app.use('/api/contacts', require('./api/contacts/routes/get_contacts'));
app.use('/api/contacts', require('./api/contacts/routes/get_contact'));
app.use('/api/contacts', require('./api/contacts/routes/put_contact'));
app.use('/api/contacts', require('./api/contacts/routes/delete_contact'));
app.use('/api/auth/login', require('./api/contacts/routes/post_login'));

const hostname = 'localhost';
const port = 3001;
const server = app.listen(port, hostname, () => {

  //connect to our database
  mongoose.connect(mongooseUri, dbOptions, (err) => {
    if (err) {
      console.log(err);
    }
    console.log(`Server running at http://${hostname}:${port}/`);
  });

});

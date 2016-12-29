const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var schema = new mongoose.Schema({ /* schema definition */ });
schema.plugin(mongoosePaginate);


const ContactSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  website: { type: String, required: true },
  user_key: { type: String, required: true },
  last_active: { type : Date },
  created : { type : Date, default: Date.now },
  modified : { type : Date, default: Date.now },
});

ContactSchema.plugin(mongoosePaginate);

// ContactSchema.pre('save', function(next){
  
//   console.log(333);
//   next();
// });

module.exports = mongoose.model('Contact', ContactSchema);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    zipcode: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'nonbinary']
    },
    university: {
      type: String
    },
    major: {
      type: String
    },
    bio: {
      type: String
    },
    age: {
      type: Number
    },
    sleep: {
      type: String,
      enum: ['early-bird', 'owl-night']
    },
    guests: {
      type: String,
      enum: ['guests-allowed', 'no-guests']
    },
    smoking: {
      type: String,
      enum: ['smoking-allowed', 'no-smoking']
    },
    pets: {
      type: String,
      enum: ['pets-allowed', 'no-pets']
    },
    lgbt: {
      type: String,
      enum: ['lgbt-friendly', 'not-lgbt-friendly']
    },
    couples: {
      type: String,
      enum: ['couples-allowed', 'no-couples']
    },
    budget: {
      type: String
    },
    move_in_date: {
      type: Date
    },
    min_length: {
      type: String
    },
    max_length: {
      type: String
    },
    amenities: {
      wifi: Boolean,
      kitchen: Boolean,
      parking: Boolean
    },
    size: {
      type: String,
      enum: ['any', 'small', 'large']
    },
    furnished: {
      type: String,
      enum: ['yes', 'no']
    },
    occupancy: {
      type: String,
      enum: ['single', 'double', 'triple', 'quadruple']
    },
    savedList: {
      type: [Schema.Types.ObjectId],
      ref: 'user'
    },
    chatHistory : {
      type: [Schema.Types.ObjectId],
      ref: 'user'
    }
  });
  
module.exports = mongoose.model('user', userSchema);

let mongoose = require('mongoose')

// Customer schema

let customerSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  surname:{
    type: String,
    required: true
  },
  color:{
    type: String,
    required: false
  }
});


module.exports = mongoose.model('Customer',customerSchema)

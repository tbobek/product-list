const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Glass = new Schema({
  id: {
    type: String
  },
  key: {
      type: String
  }, 
  value: {
      type: String
  }
},{
    collection: 'laminates'
});

module.exports = mongoose.model('Glass', Glass);
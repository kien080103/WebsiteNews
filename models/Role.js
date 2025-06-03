const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    enum: ['admin', 'author']
  },
  description: {
    type: String
  }
}, { collection: 'roles' });

module.exports = mongoose.model('Role', roleSchema);

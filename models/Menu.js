const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
   
  },
  price: {
    type: Number,
  
  },
  image:
    {
     
      type: String,
    },

});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
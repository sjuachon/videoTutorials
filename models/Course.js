const mongoose = require('mongoose');
const schema = mongoose.Schema;
const User = require('./User')

const courseSchema = schema({
  title: {
    type:String, 
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 50
  }, 
  
  description: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50
  },

  imageUrl: {
      type: String,
      required: true
      
  },

  isPublic: {
      type: Boolean,
      default: false
  },

  dateCreated: {
      type: Date,
      required: true
  },

  users: [
    {
    type: schema.Types.ObjectId,
    ref: "User"
    }
]
 


});



const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
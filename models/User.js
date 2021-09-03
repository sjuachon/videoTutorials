const mongoose = require('mongoose');
const schema = mongoose.Schema;
const Course = require('./Course')

const userSchema = schema({
  username: {
    type:String, 
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20
  }, 
  password:{
    type:String, 
    required: true,
    minlength: 3,
    maxlength: 200
  },
  
  courses: [
    {
      type: schema.Types.ObjectId,
      ref: "Course"    }
    ]
  });



const User = mongoose.model('User', userSchema);
module.exports = User;
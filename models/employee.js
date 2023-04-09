const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  dateOfBirth: {
    type: String,
    require: true,
  },
  dateOfJoining: {
    type: String,
    require: true,
  },
  designation: {
    type: String,
    require: true,
  },
  department: {
    type: String,
    require: true,
  },
  employeeType: {
    type: String,
    require: true,
  },
  currentStatus: {
    type: String,
    require: true,
  },
});


module.exports =  mongoose.model('Employee',employeeSchema);
const {connection, Schema} = require('mongoose');

const SalarySchema = new Schema({
   status : {
      type : Number,
      default : 1
   },
   city_id: Number,
   city_name: {
      type: String,
      lowercase: true,
      unique: true
   },
   industry_id: Number,
   industry_name: String,
   designation_id: Number,
   designation_name: String,
   work_experience: Number,
   company_id: Number,
   company_name: {
      type: String,
      lowercase: true
   },
   priority_id: Number,
   display_order: Number,
   min_salary: Number,
   max_salary: Number,
   created_time: {
      type: Date,
      default: Date.now
   },
   updated_time: {
     type: Date,
     default: Date.now
   }
});

module.exports = connection.model('salary', SalarySchema);

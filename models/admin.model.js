const mongoose = require('mongoose')

const logRegSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  
    phone: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

module.exports = new mongoose.model('logReg', logRegSchema)

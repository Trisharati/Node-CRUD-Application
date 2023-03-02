const mongoose = require("mongoose");

const logRegSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      default: "User",
      enum: ["Admin", "User"],
    },
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
);

module.exports = new mongoose.model("addUser", logRegSchema);

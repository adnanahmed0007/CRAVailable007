import mongoose from "mongoose";

const Doneruser = new mongoose.Schema(
  {

    name: {
      type: String,
      required: true,
      trim: true,
    },


    age: {
      type: Number,
      required: function () {
        return this.role === "donor";
      },
    },


    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,

      match: [
        /^\S+@\S+\.\S+$/,
        "Please enter a valid email",
      ],
    },



    phone: {
      type: Number,
      required: true,
      unique: true,

      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v.toString());
        },

        message:
          "Phone number must be exactly 10 digits",
      },
    },



    bloodGroup: {
      type: String,

      required: function () {
        return this.role === "donor";
      },

      enum: [
        "A+",
        "A-",
        "B+",
        "B-",
        "O+",
        "O-",
        "AB+",
        "AB-",
      ],
    },


    password: {
      type: String,
      required: true,
    },


    role: {
      type: String,

      enum: [
        "donor",
        "admin",
      ],

      default: "donor",
    },

    location: {
      lat: {
        type: Number,
      },

      lng: {
        type: Number,
      },

      address: {
        type: String,
      },
    },
  },

  {
    timestamps: true,
  }
);

const DonorUserexport = mongoose.model(
  "Donoruser",
  Doneruser
);

export default DonorUserexport;
import mongoose from "mongoose"
import express from "express"
const DonorBloodDonation = new mongoose.Schema({
    bloodGroup:
    {
        type: String,
        required: true,
    }
    , Registerday:
    {
        type: String,
        required: true,
    }, Address:
    {
        type: String,
        required: true,
    },
    NearestHospital:
    {
        type: String,
        required: true,
    },
    phoneNumber:
    {
         type: Number,
    required: true,
    unique: true,
    validate: {
        validator: function(v) {
            return /^\d{10}$/.test(v.toString());
        },
        message: "Phone number must be exactly 10 digits"
    }

    },
    UserIdinf:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donoruser",
        required: true
    },

}, { timestamps: true })
const DonorBloodDonationexport = mongoose.model("DonorBloodDonationusers", DonorBloodDonation);
export default DonorBloodDonationexport;

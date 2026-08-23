import mongoose from "mongoose";
import express from "express";
const BloodRequired = new mongoose.Schema({
    bloodGroup:
    {
        type: String,
        required: true,
        enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
    },
    NearestHospital:
    {
        type: String,
        required: true,
    },
    phone: {
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
    query:
    {
        type: String,
        required: true,
    }
}, { timestamps: true })
const BloodRequiredexport = mongoose.model("BloodRequireddonor", BloodRequired)
export default BloodRequiredexport;

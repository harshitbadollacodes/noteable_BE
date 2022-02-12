const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: "Please enter first name",
        trim: true
    },

    lastName: {
        type: String,
        required: "Please enter last name",
        trim: true
    },

    email: {
        type: String,
        required: "Please enter email",
        trim: true,
        unique: true
    },

    password: {
        type: String,
        required: "Please enter password",
        trim: true
    }

});

const User = mongoose.model("User", UserSchema);

module.exports = { User }; 
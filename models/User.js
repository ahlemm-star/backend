const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    role: {
        type: Array,
        required: false
    },
    token: {
        type: String,
        required: false
    },
   /* dons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Don',
        default: []
    }]*/
});
module.exports = User = mongoose.model("users", UserSchema);
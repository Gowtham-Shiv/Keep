const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: { type: String },
    email: { type: String },
    password: { type: String },
    createdOn: { type: Date, default: new Date().getTime() },
});

module.exports = mongoose.model("User", userSchema);

// import mongoose from "mongoose";
// const Schema = mongoose.Schema;
// export const User = mongoose.model("User", userSchema)
// export default User
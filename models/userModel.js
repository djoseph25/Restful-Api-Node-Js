const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user name is reuired'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, 'An email address is required'],
    validate: [validator.isEmail, 'A correct Email address is required!'],
  },
  photo: [String],
  password: {
    type: String,
    required: [true, 'A Password is required'],
    minlength: [8, 'A passowrd must have at least 8 character'],
  },
  passwordConfirm: {
    type: String,
    required: [true, `Please Confirm your password`],
    validate: {
      // NOTE This only work on SAVE when we try to update we need to save
      validator(el) {
        return el === this.password;
      },
      message: 'Password Does not Match',
    },
  },
});

userSchema.pre('save', async function (next) {
  // NOTE this function only run if password was modified
  if (!this.isModified('password')) {
    return next();
  }
  // NOTE Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // NOTE delete the confirm password
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  photo: [String],
  password: {
    type: String,
    required: [true, 'A Password is required'],
    minlength: [8, 'A passowrd must have at least 8 character'],
    // NOTE Setting it to false to hide it
    select: false,
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
  passwordChangedAt: Date,
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
// NOTE Encryt BOth passWord and so I can compare in my authController
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // eslint-disable-next-line no-return-await
  return await bcrypt.compare(candidatePassword, userPassword);
};
// CREATING ANOTHER INSTANCE OBJECT FOR IF PASSWORD WAS change
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changeTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changeTimeStamp, JWTTimestamp);
    return JWTTimestamp < changeTimeStamp;
  }
  // False Mean not change
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

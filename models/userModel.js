const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
  passwordResetToken: String,
  passwordResetExpired: Date,
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
// SECTION MIDDLEWARE TO UDATE CHANGE PASSWORD
userSchema.pre('save', async function (next) {
  if (!this.isModified('password' || this.isNew)) return next();
  // WE NEED PASS 1000 MS WILL MAKE SURE THE TOKEN IS CREATD AFTER THE PASSWORD CHANGE
  this.passwordChangedAt = Date.now() - 1000;
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
// CREATING INSTANCE METHOD TO RESET PASSWORD
userSchema.methods.createPasswordResetToken = function () {
  // This token this is what we going to send to the user
  const resetToken = crypto.randomBytes(30).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  // NOTE Reseting password after 10 minute
  this.passwordResetExpired = Date.now() + 10 * 60 * 1000;
  console.log({ resetToken }, this.passwordResetToken);
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

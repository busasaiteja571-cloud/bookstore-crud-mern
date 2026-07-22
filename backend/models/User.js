import mongoose from 'mongoose';
import bcrypt   from 'bcryptjs'
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // MongoDB rejects duplicate emails at the index level
      lowercase: true, // normalizes "User@Mail.com" and "user@mail.com" to the same value
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    // Public signup always creates 'user'. 'admin' is set manually
    // via direct DB edit (e.g. MongoDB Atlas UI) — never exposed
    // through the signup API, per your decision above.
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

// A Mongoose "pre-save hook" — runs automatically right before a
// document is saved. We use it to hash the password ONCE, here,
// so every code path that creates a user (just signup, for now)
// automatically gets this behavior without remembering to call it.
userSchema.pre('save', async function (next) {
  // Only re-hash if the password field was actually changed —
  // without this check, updating a user's name would re-hash an
  // ALREADY-hashed password, breaking login.
  if (!this.isModified('password')) return next();

  // bcrypt "salts" the hash automatically — 10 is the salt round
  // count, a standard tradeoff between hashing speed and security.
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method — callable on any fetched user document as
// user.matchPassword(plainTextPassword). Keeps the comparison
// logic next to the schema, instead of scattered across controllers.
userSchema.methods.matchPassword = async function (enteredPassword) {
  // bcrypt.compare re-hashes the entered password with the SAME
  // salt stored in this.password, and checks if they match — you
  // can never reverse a bcrypt hash back into the original password.
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
import mongoose, { Schema } from 'mongoose';

const User = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  googleId: {
    type: String,
  },
  linkedinId: {
    type: String,
  },
  facebookId: {
    type: String,
  },
  authProvider: {
    type: String,
  }
}, {
  timestamps: true,
});

User.index({ '$**': 'text' });

export default mongoose.model('User', User);

import mongoose, { Schema } from 'mongoose';

const User = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
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
  role: {
    type: String,
    enum: ['Player', 'Facilitator', 'Admin'],
    default: 'Player',
  },
  isComplete: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

User.index({ '$**': 'text' });

export default mongoose.model('User', User);

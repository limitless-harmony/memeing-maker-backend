import mongoose, { Schema } from 'mongoose';

const User = new Schema(
  {
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
    topText: {
      type: String,
    },
    bottomText: {
      type: String,
    },
    image: {
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
      enum: ['Player', 'Admin', 'SuperAdmin'],
      default: 'Player',
    },
    reactions: {
      type: Number,
      default: 0,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

User.index({ '$**': 'text' });

export default mongoose.model('User', User);

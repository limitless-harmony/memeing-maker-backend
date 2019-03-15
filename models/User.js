import mongoose, { Schema } from 'mongoose';


const User = new Schema({
  name: String,
  email: String,
  imageUrl: String,
  googleId: String,
  linkedInId: String,
  facebookId: String,
}, {
  timestamps: true
});

// Add full text search
User.index({ '$**': 'text' });

export default mongoose.model('User', User);

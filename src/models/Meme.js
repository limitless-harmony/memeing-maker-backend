import mongoose, { Schema } from 'mongoose';

const Meme = new Schema({
  id: Schema.ObjectId,
  topText: {
    type: String,
  },
  bottomText: {
    type: String,
  },
  image: {
    type: String,
    required: 'Please select a meme image first'
  },
  name: {
    type: String,
    required: 'A meme must have a name'
  },
  userId: {
    type: String,
    required: 'A user id is required'
  },
  flagged: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false,
  },

});

// Add full text search
Meme.index({ '$**': 'text' });

export default mongoose.model('Meme', Meme);

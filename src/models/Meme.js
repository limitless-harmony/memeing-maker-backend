import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

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
  },
  name: {
    type: String,
    required: 'A meme must have a name'
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  flagged: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  reactions: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

Meme.plugin(paginate);
// Add full text search
Meme.index({ '$**': 'text' });

export default mongoose.model('Meme', Meme);

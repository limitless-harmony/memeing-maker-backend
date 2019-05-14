import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const Wall = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  memes: [{
    type: Schema.Types.ObjectId,
    ref: 'Meme',
  }],

}, { timestamps: true });

Wall.plugin(paginate);
// Add full text search
Wall.index({ '$**': 'text' });

export default mongoose.model('Wall', Wall);

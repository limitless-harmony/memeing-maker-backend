import mongoose, { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const Rule = new Schema(
  {
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
  },
  { timestamps: true }
);

Rule.plugin(paginate);
// Add full text search
Rule.index({ '$**': 'text' });

export default mongoose.model('Rule', Rule);

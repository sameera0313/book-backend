import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
});

// Update lastModified timestamp before saving
wishlistSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;
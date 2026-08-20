const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    attending: {
      type: Boolean,
      required: [true, 'Please specify if you are attending'],
    },
    guests: {
      type: Number,
      required: [true, 'Please specify the number of guests'],
      min: [0, 'Number of guests cannot be negative'],
      default: 0,
    },
    wish: {
      type: String,
      trim: true,
      maxLength: [500, 'Wish cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Add index on phone number for faster searches and updates
rsvpSchema.index({ phone: 1 });

const Rsvp = mongoose.model('Rsvp', rsvpSchema);

module.exports = Rsvp;

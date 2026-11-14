import mongoose from 'mongoose';

/**
 * Contact Schema
 * Validates and persists project inquiry messages submitted via ContactModal.
 */
const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: [120, 'Email cannot exceed 120 characters'],
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    project: {
      type: String,
      required: [true, 'Project message is required'],
      trim: true,
      maxlength: [1500, 'Project message cannot exceed 1500 characters'],
    },
    ip: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;

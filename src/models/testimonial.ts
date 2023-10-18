import mongoose from "mongoose";

const { Schema } = mongoose;

const testimonialSchema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: String, required: true },
    imgpath: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema, "testimonials");

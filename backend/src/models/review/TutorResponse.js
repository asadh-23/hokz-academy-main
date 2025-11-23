// backend/src/models/review/TutorResponse.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const TutorResponseSchema = new Schema(
  {
    review: {
      type: Schema.Types.ObjectId,
      ref: "Review",
      required: true,
      index: true,
    },

    tutor: {
      type: Schema.Types.ObjectId,
      ref: "Tutor",
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    createdByAdmin: {
      type: Boolean,
      default: false, // in case admin wants to respond on behalf of tutor
    },
  },
  { timestamps: true }
);

// Index to speed up lookups
TutorResponseSchema.index({ review: 1 });

const TutorResponse = mongoose.model("TutorResponse", TutorResponseSchema);
export default TutorResponse;

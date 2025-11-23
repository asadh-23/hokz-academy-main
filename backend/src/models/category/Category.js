import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },

    isListed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Useful indexes
categorySchema.index({ name: 1 });
categorySchema.index({ isListed: 1 });
categorySchema.index({ createdAt: -1 });

const Category = mongoose.model("Category", categorySchema);

export default Category;

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

// Useful indexes (name already has unique index from schema definition)
categorySchema.index({ isListed: 1 });
categorySchema.index({ createdAt: -1 });

const Category = mongoose.model("Category", categorySchema);

export default Category;

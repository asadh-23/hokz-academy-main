import mongoose from "mongoose";

const { Schema } = mongoose;

const CartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    items: [
      {
        course: {
          type: Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
    
      },
    ],

   
    appliedCoupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
  },
  { timestamps: true }
);

CartSchema.path("items").validate(function (items) {
  return items.length <= 50;
}, "Cart limit reached (maximum 50 courses allowed)");


CartSchema.methods.addCourse = function (courseId) {
  const exists = this.items.some(
    (item) => item.course.toString() === courseId.toString()
  );

  if (!exists) {
    this.items.push({ course: courseId });
  }
  return this;
};

/**
 * REMOVE COURSE
 */
CartSchema.methods.removeCourse = function (courseId) {
  this.items = this.items.filter(
    (item) => item.course.toString() !== courseId.toString()
  );
  return this;
};

/**
 * CLEAR CART (After Payment)
 */
CartSchema.methods.clearCart = function () {
  this.items = [];
  this.appliedCoupon = null;
  return this;
};

export default mongoose.model("Cart", CartSchema);
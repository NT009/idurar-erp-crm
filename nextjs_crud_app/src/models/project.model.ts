import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    removed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);

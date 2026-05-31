import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    category: {
      type: String,
      enum: ["store", "payment", "cloudinary", "email"],
      default: "store",
    },
    description: String,
  },
  { timestamps: true }
);

export const Setting = mongoose.models.Setting || mongoose.model("Setting", settingSchema);

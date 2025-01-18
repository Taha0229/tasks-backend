import mongoose, { Schema } from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

const taskSchema = new Schema(
  {
    taskId: {
      type: Number,
      unique: true,
    },

    title: {
      type: String,
      required: [true, "Title is a required field"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
      index: true,
    },

    description: {
      type: String,
      required: [true, "Description is a required field"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    status: {
      type: String,
      enum: {
        values: ["pending", "in-progress", "completed"],
        message:
          "Status must be either 'pending', 'in-progress', or 'completed'",
      },
      default: "pending",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task must have a creator"],
    },
  },
  { timestamps: true }
);

taskSchema.plugin(AutoIncrement, { inc_field: "taskId" });

export const Task = mongoose.model("Task", taskSchema);

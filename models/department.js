import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const DepartmentModel = mongoose.model(
  "Department",
  departmentSchema,
  "Department"
);

export default DepartmentModel;

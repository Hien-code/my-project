const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    title: String,
    permissions: {
      type: Array,
      default: [],
    },
    description: String,
    delete: {
      type: Boolean,
      default: false,
    },
    deleteAt: Date,
  },
  {
    timestamps: true,
  }
);
//Create model mongoose.model(<modelName>, <schema>, <collectionName>);
const Role = mongoose.model("Role", roleSchema, "roles");

module.exports = Role;

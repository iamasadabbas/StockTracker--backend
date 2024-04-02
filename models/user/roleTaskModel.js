const mongoose = require("mongoose");
const roleTaskSchema = new mongoose.Schema({
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  task_id: [
    {
      task_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
      status: {
        type: Boolean,
        default: true,
      },
    },
  ],
});
module.exports = mongoose.model("RoleTask", roleTaskSchema);

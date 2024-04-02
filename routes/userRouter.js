const express = require("express");
const {
  registerUser,
  loginUser,
  addTask,
  addRole,
  addDepartment,
  getAllUser,
  getRole,
  getDepartment,
  getAllTask,
  assignTask,
  getRoleTask,
  removeRoleTask,
  getSpecificTask,
  editTask,
  editUserDetail,
  changePassword,
  updateAssignTask,
  addDesignation,
  getDesignation,
  removeUser,
  editUser,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const upload = require("../middlewares/ImageUploader");
const controller = require("../controllers/userController");
const router = express.Router();

// Post Route
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.route("/loginUser").post(loginUser);
router.route("/registerUser").post(registerUser);
router.route("/addDepartment").post(addDepartment);
router.route("/addDesignation").post(addDesignation);
router.route("/addRole").post(addRole);
router.route("/addTask").post(addTask);
router.route("/assignRoleTask").post(assignTask);
router.route("/addFaculty").post(controller.addFaculty);


///////////update Assign task
router.route("/updateAssignRoleTask/:role_id/:task_id").put(updateAssignTask);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get Route
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.route("/getAllUser").get(getAllUser);
router.route("/getRole").get(getRole);
router.route("/getDepartment/:id").get(getDepartment);
router.route("/getDesignation").get(getDesignation);
router.route("/getFaculty").get(controller.getFaculty);
router.route("/getAllTask").get(getAllTask);
router.route("/getRoleTask/:role_id").get(getRoleTask);
router.route("/getSpecificTask/:role_id").get(getSpecificTask);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//  delete
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.route("/removeTaskFromRole").post(removeRoleTask);
router.route("/removeUser/:user_id").delete(removeUser);

//////////////////////////////////////////////////////////////////////////////////////////////
router.route("/editTask").put(editTask);
router.route("/editUser/:user_id").put(editUser);
router.put(
  "/editUserDetail",
  upload.single("image"),
  controller.editUserDetail
);
router.route("/changePassword").put(changePassword);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = router;

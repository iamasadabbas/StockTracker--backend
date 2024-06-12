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
  getRegistartionRequest,
  editUser,
  updateUserStatus,
  getTotalUserCount,
  getTotalActiveUserCount,
  getTotalRoleCount,
  updateRole,
  getUserApprovalRequest,
  getLast7daysUserApproval,
  getUserDetails,
  forgetPassword,
  resetPassword,
  logout
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const upload = require("../middlewares/ImageUploader");
const controller = require("../controllers/userController");
const router = express.Router();

// Post Route
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.route("/loginUser").post(loginUser);
router.route("/logout").post(logout);
router.route("/registerUser").post(registerUser);
router.route("/addDepartment").post(addDepartment);
router.route("/addDesignation").post(addDesignation);
router.route("/addRole").post(addRole);
router.route("/addTask").post(addTask);
router.route("/assignRoleTask").post(assignTask);
router.route("/addFaculty").post(controller.addFaculty);


///////////update Assign task
router.route("/updateAssignRoleTask/:role_id/:task_id").put(updateAssignTask);
router.route("/updateRole").put(updateRole);
router.route("/updateUserStatus").put(updateUserStatus);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get Route
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.route("/me").get(isAuthenticatedUser,getUserDetails);
router.route("/getAllUser").get(getAllUser);
router.route("/getRegistartionRequest").get(getRegistartionRequest);
router.route("/getRole").get(getRole);
router.route("/getDepartment/:id").get(getDepartment);
router.route("/getDesignation").get(getDesignation);
router.route("/getFaculty").get(controller.getFaculty);
router.route("/getAllTask").get(getAllTask);
router.route("/getRoleTask/:role_id").get(getRoleTask);
router.route("/getSpecificTask/:role_id").get(getSpecificTask);
router.route("/getTotalUserCount").get(getTotalUserCount);
router.route("/getTotalActiveUserCount").get(getTotalActiveUserCount);
router.route("/getTotalRoleCount").get(getTotalRoleCount);
router.route("/getUserApprovalRequest").get(getUserApprovalRequest);
router.route("/getLast7daysUserApproval").get(getLast7daysUserApproval);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//  delete
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.route("/removeTaskFromRole").post(removeRoleTask);
router.route("/removeUser/:user_id").delete(removeUser);

//////////////////////////////////////////////////////////////////////////////////////////////
router.route("/editTask").put(editTask);
router.route("/editUser/:user_id").put(editUser);
router.route("/editUserDetail").put(upload.single("avatar"), editUserDetail);
router.route("/changePassword").put(changePassword);
router.route("/password/forgot").post(forgetPassword);
router.route("/password/reset/:token").put(resetPassword);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = router;

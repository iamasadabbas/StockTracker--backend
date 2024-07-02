const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncError");
const User = require("../models/user/userModel");
const bcrypt = require("bcryptjs");
const Task = require("../models/user/taskModel");
const Role = require("../models/user/roleModel");
const RoleTask = require("../models/user/roleTaskModel");
const Department = require("../models/user/departmentModel");
const designationModel = require("../models/user/designationModel");
const sendToken=require("../utils/jwtToken")
const Faculty = require("../models/user/facultyModel");
const { response } = require("express");
const { sendMessage } = require("./notificationController");
const ErrorHander =require("../utils/errorHandler")
const crypto = require('crypto');

//Register User
//////////////////////////////////////////////////////////////////////////
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  let {
    name,
    email,
    password,
    phone_no,
    gender,
    designation_id,
    department_id,
    faculty_id,
    status,
  } = req.body;
  console.log(req.body);
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone_no,
      designation_id,
      department_id,
      faculty_id,
      gender,
      status,
    });
    console.log(req.body);
    // Convert email to lowercase
    email = email.toLowerCase();

    res.send({
      status: 200,
      message: "Successfully created",
      // user,
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyValue) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        status: 409,
        message: `Duplicate ${duplicateField}: ${error.keyValue[duplicateField]}`,
      });
    } else {
      // Other errors
      console.error("Error registering user:", error);
      res.status(500).json({ status: 500, error: "Internal server error" });
    }
  }
});

///////////////////////////////////////////////////////////////////////////////

// Login User
/////////////////////////////////////////////////////////////////////////////
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  let { email, password } = req.body;


  if (!email || !password) {
    return res.json({ success: false, message: "Please Enter Email & Password" });
  }
  email = email.toLowerCase();
  // Define a regex for validating email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate the email format
  if (!emailRegex.test(email)) {
    return res.json({ success: false, message: "Invalid email format" });
  }

  const user = await User.findOne({ email, status: true })
    .select("+password")
    .populate("role_id")
    .populate("designation_id");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Correct role check logic
  if (user.role_id.name !== "Admin" && user.role_id.name !== "SuperAdmin" && user.role_id.name !== "StoreKeeper") {
    return next(new ErrorHandler("Invalid Email or password", 401));
    }

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) {
    return next(new ErrorHandler("Invalid Email or password", 401));
  }

  sendToken(user, 200, res);
  return res.status(200).json({
    success: true,
    user,
    message: "Login Successfully",
  });
});

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
});
////////////////////////////////////////////////////////////////////////////////////

// get all users
/////////////////////////////////////////////////////////////////////////////////////////////
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const users = await User.find({role_id:{ $ne: null }}).populate("role_id").populate("designation_id");
    if (users) {
      res.send({
        status: 200,
        users,
      });
    } else {
      res.send({ status: 200, message: "user not found" });
    }
  } catch (error) {
    console.error(error);
  }
});

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  // console.log('enter');
  const user = await User.findById(req.user.id).populate("role_id")
  res.status(200).send({
    status: true,
    user,
  });
});
exports.getTotalUserCount = catchAsyncErrors(async (req, res, next) => {
  try {
    const users = await User.find()
    if(users){
      const totalUser=users.length
      res.send({
            status: 200,
            totalUser,
          });
    }else {
        res.send({ status: 200, message: "user not found" });
      }
    
  } catch (error) {
    console.error(error);
  }
});
exports.getLast7daysUserApproval = catchAsyncErrors(async (req, res, next) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set to start of the current day in UTC

    let NoOfApproval = [];

    for (let index = 0; index < 7; index++) {
      const startOfDay = new Date(today);
      startOfDay.setUTCDate(today.getUTCDate() - index);
      // console.log('Start of Day:', startOfDay);

      const endOfDay = new Date(startOfDay);
      endOfDay.setUTCHours(23, 59, 59, 999);
      // console.log('End of Day:', endOfDay);

      const approval = await User.find({
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      });
      // console.log(`Requests on day ${index}:`, requests.length);
      NoOfApproval.push(approval.length);
    }

    res.send({
      status: 200,
      approvalCounts: NoOfApproval.reverse(), // Reverse the array to get the counts in chronological order
    });
  } catch (error) {
    console.error('Error finding requests:', error);
    res.status(500).send({
      message: 'Internal server error',
    });
  }
});
exports.getUserApprovalRequest = catchAsyncErrors(async (req, res, next) => {
  try {
    const userApprovalRequest = await User.find({ role_id: null })
    const totalUserApprovalRequest = userApprovalRequest.length;
    
    if (totalUserApprovalRequest >= 0) {
      res.send({
        status: 200,
        totalUserApprovalRequest,
        userApprovalRequest,
      });
    } else {
      res.send({
        status: 200,
        totalUserApprovalRequest: 0,
        message: "user not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 500, message: "Internal server error" });
  }
});

exports.getTotalActiveUserCount = catchAsyncErrors(async (req, res, next) => {
  try {
    const users = await User.find({status: true})
    if(users){
      const totalActiveUser=users.length
      // console.log(totalActiveUser);
      res.send({
            status: 200,
            totalActiveUser,
          });
    }else {
        res.send({ status: 200, message: "user not found" });
      }
    
  } catch (error) {
    console.error(error);
  }
});
exports.getTotalRoleCount = catchAsyncErrors(async (req, res, next) => {
  try {
    const role = await Role.find()
    if(role){
      const totalRole=role.length
      res.send({
            status: 200,
            totalRole,
          });
    }else {
        res.send({ status: 200, message: "role not found" });
      }
    
  } catch (error) {
    console.error(error);
  }
});
exports.getRegistartionRequest = catchAsyncErrors(async (req, res, next) => {
  // const name = req.params.roleName;
  // if (name == "SuperAdmin") {
  try {
    const users = await User.find({role_id:null}).populate("department_id")
    .populate("designation_id").populate("faculty_id");
    if (users) {
      res.send({
        status: 200,
        users,
      });
    } else {
      res.send({ status: 200, message: "user not found" });
    }
  } catch (error) {
    console.error(error);
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////

// add task
////////////////////////////////////////////////////////////////////////////////////////////////
exports.addTask = catchAsyncErrors(async (req, res, next) => {
  const { name, description } = req.body;

  try {
    await Task.create({
      name,
      description,
    });

    res.status(200).send({
      status: 200,
      message: "Task Add Successfully",
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyValue) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(409).send({
        status: 409,
        message: `Duplicate ${duplicateField}: ${error.keyValue[duplicateField]}`,
      });
    } else {
      res.status(500).json({ status: 500, error: "Internal server error" });
    }
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////

// add task
////////////////////////////////////////////////////////////////////////////////////////////////
exports.editTask = catchAsyncErrors(async (req, res, next) => {
  const { _id, name, description } = req.body;
  // console.log(req.body);
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      _id,
      {
        name,
        description,
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task Add Successfully",
    });
  } catch (error) {
    if (error.code == 11000) {
      res.status(400).json({
        message: "Task Already Register",
      });
    }
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////

// get AllTask
////////////////////////////////////////////////////////////////////////////////////////////////
exports.getAllTask = catchAsyncErrors(async (req, res, next) => {
  const task = await Task.find();
  // console.log(task);
  res.send({
    status: 200,
    task,
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////

// add role
////////////////////////////////////////////////////////////////////////////////////////////////
exports.addRole = catchAsyncErrors(async (req, res, next) => {
  const { name, description } = req.body;

  try {
    await Role.create({
      name,
      description,
    });

    res.status(201).json({
      status: 201,
      message: "Successfully created",
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyValue) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        status: 409,
        error: `Role Already Exists`,
      });
    } else {
      console.error("Error registering Role:", error);
      res.status(500).json({ status: 500, error: "Internal server error" });
    }
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////

// Get role
////////////////////////////////////////////////////////////////////////////////////////////////
exports.getRole = catchAsyncErrors(async (req, res, next) => {
  try {
    const role = await Role.find();
    // console.log(role);
    res.send({ status: 200, role });
  } catch (error) {
    res.error(error.message);
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////

// add Department
////////////////////////////////////////////////////////////////////////////////////////////////
exports.addDepartment = catchAsyncErrors(async (req, res, next) => {
  const { name, description } = req.body;

  try {
    await Department.create({
      name,
      description,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    if (error.code == 11000) {
      res.status(400).json({
        message: "Department Already Register",
      });
    }
  }
});

/////add designation///////////

exports.addDesignation = catchAsyncErrors(async (req, res, next) => {
  const { name, description } = req.body;

  try {
    const task = await designationModel.create({
      name,
      description,
    });
    if (task) {
      res.send({
        status: 200,
        message: "Designation created successfully",
      });
    }
  } catch (error) {
    if (error.code == 11000) {
      res.status(409).json({
        message: "Designation Already Register",
      });
    }
  }
});
// });

//////////////////////////////////////////////////////////////////////////////////////////////////

// Get department
////////////////////////////////////////////////////////////////////////////////////////////////
exports.getDepartment = catchAsyncErrors(async (req, res, next) => {
  const department = await Department.find({ faculty_id: req.params.id });
  res.status(200).json({
    department,
  });
});

///// get Designation///////
exports.getDesignation = catchAsyncErrors(async (req, res, next) => {
  const designation = await designationModel.find();
  res.send({
    status: 200,
    designation,
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////

///// add faculty //////
exports.addFaculty = catchAsyncErrors(async (req, res, next) => {
  const { name, description, faculty_id } = req.body;

  try {
    await Faculty.create({
      name,
      description,
      faculty_id,
    });

    res.status(200).json({
      success: true,
      message: "Faculty added",
    });
  } catch (error) {
    if (error.code == 11000) {
      res.status(400).json({
        message: "Faculty Already Exist",
      });
    }
  }
});
///// get Faculty///////
exports.getFaculty = catchAsyncErrors(async (req, res, next) => {
  const faculty = await Faculty.find();
  res.send({
    status: 200,
    faculty,
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////

// Assign Task To Role
//////////////////////////////////////////////////////////////////////////////////////////////////
exports.assignTask = catchAsyncErrors(async (req, res, next) => {
  const { role_id, task_id } = req.body;
  const lastItem = task_id[task_id.length - 1].task_id;
  // console.log(lastItem);

  try {
    const existingRoleTask = await RoleTask.findOne({ role_id });

    if (existingRoleTask) {
      const taskExists = existingRoleTask.task_id.some(
        (task) => task.task_id.toString() === lastItem
      );
      if (taskExists) {
        res.send({ status: 409, message: "task already exists" });
      } else {
        existingRoleTask.task_id.push({ task_id: lastItem });
        existingRoleTask.save();
        res.send({ status: 200, message: "added" });
      }
    } else {
      await RoleTask.create({ role_id, task_id: task_id });
      res
        .status(200)
        .json({ status: 200, message: "Tasks assigned successfully" });
    }
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyValue) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        status: 409,
        message: `Duplicate ${duplicateField}: ${error.keyValue[duplicateField]}`,
      });
    } else {
      console.error("Error assigning Task:", error);
      res.status(500).json({ status: 500, error: "Internal server error" });
    }
  }
});

//////////////////update Task////////
exports.updateAssignTask = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;

  let result = await RoleTask.updateOne(
    {
      role_id: req.params.role_id,
      "task_id.task_id": req.params.task_id,
    },
    {
      $set: {
        "task_id.$.status": status,
      },
    }
  ).populate("task_id");
  if (result) {
    const data = await RoleTask.findOne({
      role_id: req.params.role_id,
    }).populate("task_id.task_id");
    return res.send(data);
  }
});
exports.updateRole = catchAsyncErrors(async (req, res, next) => {
  const { userId,roleId } = req.body;

  let result = await User.findOneAndUpdate(
    {
      _id:userId
    },
    {
      $set: {
        "role_id":roleId,
        "status":true,
      },
    }
  )
  if (result) {
    let user=await User.find({role_id:null})
    return res.send({
      status:200,
      message:"Updated Successfully",
      user
  });
  }

});
exports.updateUserStatus = catchAsyncErrors(async (req, res, next) => {
  const { userId,status } = req.body;

  let result = await User.findOneAndUpdate(
    {
      _id:userId
    },
    {
      $set: {
        "status":status,
      },
    }
  )
  if (result) {
    let user=await User.find({role_id:{ $ne: null }}).populate("role_id").populate("designation_id");
    return res.send({
      status:200,
      message:"Updated Successfully",
      user
  });
  }

});

////////////////////////////////////////////////////////////////////////////////////////////////////
// Remove Task To Role
//////////////////////////////////////////////////////////////////////////////////////////////////
exports.removeRoleTask = catchAsyncErrors(async (req, res, next) => {
  const { role_id, task_id } = req.body;
  try {
    await RoleTask.deleteOne({ role_id, task_id });
    res.status(200).json({
      success: true,
    });
  } catch (error) {}
});

/////// remove User ///////////
exports.removeUser = catchAsyncErrors(async (req, res, next) => {
  const { user_id } = req.params.user_id;
  try {
    const result = await User.deleteOne({ user_id });
    if (result) {
      res.send({
        status: 200,
        message: "User deleted successfully",
      });
    }
  } catch (error) {
    console.error(error);
  }
});

//////////Edit User //////////
exports.editUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone_no } = req.body;
  // console.log(req.params.user_id);
  // console.log(req.body);
  try {
    await User.updateOne({ name: name, email: email, phone_no: phone_no });
    res.send({
      status: 200,
      message: "updated successfully",
    });
  } catch (error) {
    console.error(error);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////

// get Role Task
//////////////////////////////////////////////////////////////////////////////////////////////////
exports.getRoleTask = catchAsyncErrors(async (req, res, next) => {
  try {
    const role_id = req.params.role_id;
    const taskData = await RoleTask.find({ role_id })
      .populate("role_id")
      .populate("task_id.task_id");

    if (taskData.length != 0) {
      res.json(taskData);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////

// get Role Task
//////////////////////////////////////////////////////////////////////////////////////////////////
exports.getSpecificTask = catchAsyncErrors(async (req, res, next) => {
  try {
    const role_id = req.params.role_id;

    const taskData = await RoleTask.find({ role_id }).populate("role_id");

    if (taskData.length != 0) {
      const taskArray = taskData[0].task_id;
      res.json(taskArray);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////

// user Role and status update
////////////////////////////////////////////////////////////////////////////////////////////////
exports.editUserDetail = catchAsyncErrors(async (req, res, next) => {
  const { _id, name, email } = req.body;
  const updatedFields = {
    name: req.body.name,
    email: req.body.email,
  };
  if (req.file && req.file.path) {
    console.log(req.file.path);
    updatedFields.avatar = req.file.path;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(_id, updatedFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
      });
    } else {
      res.status(200).json({
        success: true,
        message:'user updated successfully',
        updatedUser,
      });
      const user_id = _id;
      const title = '';
      const message = "Profile Updated Successfully";
      sendMessage(user_id, title, message);
    }

  } catch (error) {
    console.log(error);
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////

// change Password
////////////////////////////////////////////////////////////////////////////////////////////////
exports.changePassword = catchAsyncErrors(async (req, res, next) => {
  const { _id, oldPassword, newPassword } = req.body;
  console.log(_id,oldPassword,newPassword);

  // Fetch the user from the database
  const user = await User.findById(_id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Check if the current password provided matches the stored password
  const isPasswordCorrect = await user.checkPassword(oldPassword);

  if (!isPasswordCorrect) {
    return res
      .status(401)
      .json({ success: false, message: "Current password is incorrect" });
  }

  // Generate a new hash for the new password
  const newHashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password in the database
  user.password = newHashedPassword;
  await user.save();

  return res
    .status(200)
    .json({ success: true, message: "Password changed successfully" });
});
//////////////////////////////////////////////////////////////////////////////////////////////////


const sendEmail = require('../utils/sendEmail'); // Adjust the path as necessary

exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
  // console.log(req.body);
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHander("User Not Found", 404));
  }

  // Get reset password token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Construct the reset password URL
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/user/password/reset/${resetToken}`;

  const message = `Your Password reset token is: \n\n${resetPasswordUrl}\n\nIf you have not requested this email, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Stock Tracker Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email reset link sent`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHander(error.message, 500));
  }
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new ErrorHander(
          "Reset Password token is invalid or has expired",
          400
        )
      );
    }

    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHander("Password doesn't match", 400));
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // For login
    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
});

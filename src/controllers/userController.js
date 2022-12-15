import db from "../models/index";
import userService from "../services/UserService";

let handleLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email or password is empty! Please try again!",
    });
  }

  const data = await userService.login(email, password);

  // if (!data) {
  //   delete data.data;
  // }

  return res.status(200).json({
    status: data.status,
    message: data.message,
    data: data.data,
  });
};

const getAllUsers = async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Missing id parameter in body",
      data: [],
    });
  }
  const users = await userService.getAllUsers(id);

  return res.status(200).json({
    status: "ok",
    message: "Success",
    users,
  });
};

const createUser = async (req, res) => {
  const message = await userService.createUser(req.body);
  return res.status(201).json(message);
};

const updateUser = async (req, res) => {
  let data = req.body;
  let message = await userService.updateUser(data);
  return res.status(200).json(message);
};

const deleteUser = async (req, res) => {
  const id = req.body.id;
  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Missing id parameter in body",
    });
  }
  const message = await userService.removeUser(id);

  return res.status(200).json(message);
};

const getAllCode = async (req, res) => {
  try {
    let data = await userService.getAllCodeService(req.query.type);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "error",
      message: "Error from server",
    });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    // console.log("check data controller", req.query);
    let data = await userService.getUserByEmail(req.query);

    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "error",
      message: "Error from server",
    });
  }
};

module.exports = {
  handleLogin,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllCode,
  getUserByEmail,
};

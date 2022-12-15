import bcrypt from "bcryptjs";
import db from "../models/index";

let salt = bcrypt.genSaltSync(8);

const createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordBcrypt = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswordBcrypt,
        fullname: data.fullname,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId,
      });

      resolve("Create a new user success");
    } catch (e) {
      reject(e);
    }
  });
};

const hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({ raw: true });
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

const getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { id: userId }, raw: true });
      if (user) {
        resolve(user);
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateUserData = (data) => {
  // console.log("data from service");
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { id: data.id } });
      if (!user) {
        resolve({});
      }
      user.email = data.email;
      user.password = data.password;
      user.fullname = data.fullname;

      await user.save();

      let allUser = await db.User.findAll();

      resolve(allUser);
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUserById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { id: userId } });

      if (user) {
        await user.destroy();
      }
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createNewUser,
  getAllUser,
  getUserInfoById,
  updateUserData,
  deleteUserById,
};

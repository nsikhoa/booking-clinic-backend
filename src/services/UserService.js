import db from "../models/index";
import bcrypt from "bcryptjs";

let salt = bcrypt.genSaltSync(8);

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

const login = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = {};
      const isUserExist = await checkEmail(email);
      if (isUserExist) {
        // Nếu tồn tại user thì ta sẽ tiếp tục so sánh password
        const user = await db.User.findOne({
          where: { email },
          attributes: ["id", "email", "roleId", "password", "fullname"],
          raw: true,
        });
        if (user) {
          let isSame = bcrypt.compareSync(password, user.password);

          if (isSame) {
            data.status = "ok";
            data.message = "Success";

            delete user.password;
            data.data = user;
          } else {
            data.status = "error";
            data.message = "Wrong password";
          }
        } else {
          data.status = "error";
          data.message = "User not found!";
        }
      } else {
        data.status = `error`;
        data.message = `Your email is not exist! Please try again!`;
      }
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
};

// const comparePassword = () => {
//   return new Promise(async (req, res) => {});
// };

const checkEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({ where: { email } });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      // console.log(users);

      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

const createUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isEmailExist = await checkEmail(data.email);
      if (isEmailExist) {
        resolve({
          status: "error",
          message: "Email is exist in system",
        });
      }
      let hashPasswordBcrypt = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswordBcrypt,
        fullname: data.fullname,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
        roleId: data.roleId,
        majorId: data.majorId,
        image: data.avatar,
      });
      resolve({
        status: "ok",
        message: "Success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const removeUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: { id },
      });
      if (!user) {
        console.log("user null");
        resolve({
          status: "error",
          message: "User is not exist",
        });
      }
      await db.User.destroy({
        where: { id },
      });

      resolve({
        status: "ok",
        message: "Delete success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.roleId || !data.majorId || !data.gender) {
        resolve({
          status: "error",
          message: "Missing required input",
        });
      }
      let user = await db.User.findOne({ where: { id: data.id }, raw: false });
      if (!user) {
        resolve({});
      }
      if (user) {
        user.fullname = data.fullname;
        user.address = data.address;
        user.phoneNumber = data.phoneNumber;
        user.gender = data.gender;
        user.roleId = data.roleId;
        user.majorId = data.majorId;
        if (data.avatar) {
          user.image = data.avatar;
        }
        await user.save();
        resolve({
          status: "ok",
          message: "User update success",
        });
      } else {
        resolve({
          status: "error",
          message: "User not found",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          status: "error",
          message: "Missing input param",
        });
      } else {
        let res = {};
        let allcode = await db.Allcode.findAll({ where: { type: typeInput } });
        res.status = "ok";
        res.data = allcode;

        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getUserByEmail = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("check data service", data);
      if (!data.email) {
        resolve({
          status: "error",
          message: "Missing input body",
        });
      } else {
        let res = await db.User.findOne({
          where: { email: data.email },
          attributes: {
            exclude: ["image", "password"],
          },
        });

        resolve({
          status: "ok",
          data: res,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  login,
  getAllUsers,
  createUser,
  updateUser,
  removeUser,
  getAllCodeService,
  getUserByEmail,
};

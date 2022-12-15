import db from "../models/index";
import CRUDServices from "../services/CRUDServices";

const getHomePage = async (req, res) => {
  try {
    const data = await db.User.findAll();
    return res.render("homepage.ejs", { data: JSON.stringify(data) });
  } catch (e) {
    console.log(e);
  }
};

const getAboutPage = (req, res) => {
  return res.render("test/about.ejs");
};

const getCRUD = (req, res) => {
  return res.render("crud.ejs");
};

const postCRUD = async (req, res) => {
  let message = await CRUDServices.createNewUser(req.body);
  console.log(message);
  return res.send("post crud from server");
};

const displayGetCRUD = async (req, res) => {
  let users = await CRUDServices.getAllUser();
  // console.log("--------------------");
  // console.log(users);
  // console.log("--------------------");
  return res.render("displayCRUD.ejs", { dataTable: users });
};

const getEditCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let userData = await CRUDServices.getUserInfoById(userId);
    // check user data not found

    return res.render("editCRUD.ejs", { user: userData });
  } else {
    return res.send("User not found!");
  }
};

const putCRUD = async (req, res) => {
  let data = req.body;
  let allUser = await CRUDServices.updateUserData(data);
  return res.render("displayCRUD.ejs", { dataTable: allUser });
};

const deleteCRUD = async (req, res) => {
  let id = req.query.id;
  if (id) {
    await CRUDServices.deleteUserById(id);
    return res.send("Delete the user succeed!");
  } else {
    return res.send("User not found");
  }
};

module.exports = {
  getHomePage,
  getAboutPage,
  getCRUD,
  postCRUD,
  displayGetCRUD,
  getEditCRUD,
  putCRUD,
  deleteCRUD,
};

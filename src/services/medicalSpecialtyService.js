import db from "../models/index";

const createSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.name || !data.image || !data.desHTML || !data.desMarkdown) {
        resolve({
          status: "error",
          message: "Missing required params",
        });
      } else {
        await db.MedicalSpecialty.create({
          name: data.name,
          image: data.image,
          descriptionHTML: data.desHTML,
          descriptionMarkdown: data.desMarkdown,
        });

        resolve({
          status: "ok",
          message: "Create success",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.MedicalSpecialty.findAll();

      if (data && data.length > 0) {
        data.map((item) => {
          item.image = new Buffer(item.image, "base64").toString("binary");
          return item;
        });
      }

      resolve({
        status: "ok",
        data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getSpecialtyById = (id, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id || !location) {
        resolve({
          status: "error",
          message: "Missing input params id",
        });
      } else {
        let data = await db.MedicalSpecialty.findOne({
          where: { id },
          attributes: ["descriptionHTML", "descriptionMarkdown"],
          // include: [
          //   {
          //     model: db.Doctor_Info,
          //     // as: "specialtyData",
          //     attributes: {
          //       exclude: ["image"],
          //       // includes: ["doctorId", "provinceId"],
          //     },
          //     // include: [
          //     //   {
          //     //     model: db.User,
          //     //     attributes: { exclude: ["image", "password"] },
          //     //   },
          //     // ],
          //   },
          // ],
          // nest: true,
          // raw: true,
        });
        if (data) {
          let doctors = [];
          if (location === "ALL") {
            doctors = await db.Doctor_Info.findAll({
              where: { specialtyId: id },
              attributes: ["doctorId", "provinceId"],
            });
          } else {
            doctors = await db.Doctor_Info.findAll({
              where: { specialtyId: id, provinceId: location },
              attributes: ["doctorId", "provinceId"],
            });
          }

          data.doctors = doctors;
        } else {
          resolve({
            status: "ok",
            data: [],
          });
        }
        resolve({
          status: "ok",
          data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createSpecialty,
  getAllSpecialty,
  getSpecialtyById,
};

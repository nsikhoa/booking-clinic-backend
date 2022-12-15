import db from "../models/index";

const createClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.address ||
        !data.image ||
        !data.desHTML ||
        !data.desMarkdown
      ) {
        resolve({
          status: "error",
          message: "Missing required input body",
        });
      } else {
        await db.Clinic.create({
          name: data.name,
          image: data.image,
          address: data.address,
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

const getAllClinic = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll();

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

const getClinicById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          status: "error",
          message: "Missing input params id",
        });
      } else {
        let data = await db.Clinic.findOne({
          where: { id },
          attributes: [
            "descriptionHTML",
            "descriptionMarkdown",
            "address",
            "name",
          ],
        });
        if (data) {
          let doctors = [];
          doctors = await db.Doctor_Info.findAll({
            where: { clinicId: id },
            attributes: ["doctorId"],
          });

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
  createClinic,
  getAllClinic,
  getClinicById,
};

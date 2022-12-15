import db from "../models/index";
import _, { reject } from "lodash";
import emailService from "../services/emailService";
import { Op } from "sequelize";
require("dotenv").config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

const getDoctorsHome = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "majorData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        status: "ok",
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });

      resolve({
        status: "ok",
        data: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const createDoctorInfo = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.doctorId ||
        !data.contentHTML ||
        !data.contentMarkdown ||
        !data.action ||
        !data.selectedPrice ||
        !data.selectedPayment ||
        !data.selectedProvince ||
        !data.note ||
        !data.specialtyId
      ) {
        resolve({
          status: "error",
          message: "Missing body input",
        });
      } else {
        // upsert marrkdown
        if (data.action === "CREATE") {
          await db.Markdown.create({
            contentHTML: data.contentHTML,
            contentMarkdown: data.contentMarkdown,
            description: data.description,
            doctorId: data.doctorId,
          });
        } else if (data.action === "EDIT") {
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: data.doctorId },
            raw: false,
          });

          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = data.contentHTML;
            doctorMarkdown.contentMarkdown = data.contentMarkdown;
            doctorMarkdown.description = data.description;

            await doctorMarkdown.save();
          }
        }

        // upsert doctorinfo - extra
        let doctorInfo = await db.Doctor_Info.findOne({
          where: { doctorId: data.doctorId },
          raw: false,
        });

        if (doctorInfo) {
          // update
          doctorInfo.priceId = data.selectedPrice;
          doctorInfo.provinceId = data.selectedProvince;
          doctorInfo.paymentId = data.selectedPayment;
          doctorInfo.specialtyId = data.specialtyId;
          doctorInfo.clinicId = data.clinicId;

          doctorInfo.nameClinic = "";
          doctorInfo.addressClinic = "";
          doctorInfo.note = data.note;

          await doctorInfo.save();
        } else {
          // create
          await db.Doctor_Info.create({
            doctorId: data.doctorId,
            priceId: data.selectedPrice,
            provinceId: data.selectedProvince,
            paymentId: data.selectedPayment,
            specialtyId: data.specialtyId,
            clinicId: data.clinicId,

            nameClinic: "",
            addressClinic: "",
            note: data.note,
          });
        }

        resolve({
          status: "ok",
          message: "Create doctor information success",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailDoctorById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          status: "error",
          message: "Missing input param",
        });
      } else {
        let data = await db.User.findOne({
          where: {
            id,
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.Allcode,
              as: "majorData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Info,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });

        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }

        if (!data) data = {};

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

const createSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.schedulesArr || !data.doctorId || !data.date) {
        resolve({
          status: "error",
          message: "Missing input body",
        });
      } else {
        let schedules = data.schedulesArr;
        if (schedules && schedules.length > 0) {
          schedules = schedules.map((item) => {
            item.maxPatients = MAX_NUMBER_SCHEDULE;
            return item;
          });
        }

        let existings = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.date },
          attributes: ["timeType", "date", "doctorId", "maxPatients"],
        });

        // if (existings && existings.length > 0) {
        //   existings = existings.map((item) => {
        //     item.date = new Date(item.date).getTime();
        //     return item;
        //   });
        // }

        let toCreate = _.differenceWith(
          schedules,
          existings,
          (schedule, existing) => {
            return (
              schedule.timeType === existing.timeType &&
              +schedule.date === +existing.date
            );
          }
        );

        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }
        resolve({
          status: "ok",
          message: "Create schedules success!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getScheduleByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          status: "error",
          message: "Missing required params",
        });
      } else {
        let data = await db.Schedule.findAll({
          where: {
            doctorId,
            date,
          },
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.User,
              as: "doctorData",
              attributes: ["fullname"],
            },
          ],
          raw: false,
          nest: true,
        });

        if (!data) data = [];
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

const getDetailDoctorExtraInfoById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          status: "error",
          message: "Missing required params",
        });
      } else {
        let data = await db.Doctor_Info.findOne({
          where: {
            doctorId,
          },
          include: [
            {
              model: db.Allcode,
              as: "priceData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "provinceData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "paymentData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Clinic,
              attributes: ["name", "address"],
            },
          ],
          raw: false,
          nest: true,
        });

        if (!data) data = [];
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

const getDoctorProfileById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          status: "error",
          message: "Missing required params",
        });
      } else {
        let data = await db.User.findOne({
          where: {
            id: doctorId,
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.Allcode,
              as: "majorData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Info,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });

        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }

        if (!data) data = {};

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

const getSchedulePatients = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          status: "error",
          message: "Missing required params",
        });
      } else {
        let data = await db.Booking.findAll({
          where: {
            statusId: "S2",
            doctorId,
            date,
          },
          include: [
            {
              model: db.User,
              attributes: [
                "email",
                "fullname",
                "address",
                "phoneNumber",
                "gender",
              ],
              as: "patientData",
              include: [
                {
                  model: db.Allcode,
                  attributes: ["valueVi", "valueEn"],
                  as: "genderData",
                },
              ],
            },
            {
              model: db.Allcode,
              attributes: ["valueVi"],
              as: "timeTypeDataBooking",
            },
            {
              model: db.User,
              attributes: ["fullname"],
              as: "doctorDataSchedule",
            },
          ],
          raw: false,
          nest: true,
        });

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

const sendMedicalBill = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.doctorId || !data.email || !data.patientId || !data.timeType) {
        resolve({
          status: "error",
          message: "Missing required input body",
        });
      } else {
        let booking = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            statusId: "S2",
            date: data.date,
          },
          raw: false,
        });

        if (!booking) {
          resolve({
            status: "error",
            message: "Booking is not exist",
          });
        } else {
          booking.statusId = "S3";
          booking.save();
        }
        // await db.Booking.destroy({
        //   where: {
        //     doctorId: data.doctorId,
        //     patientId: data.patientId,
        //     timeType: data.timeType,
        //     statusId: "S2",
        //     date: data.date,
        //   },
        // });

        await emailService.sendResponseEmail(data);

        // where: { email: data.email },
        //   defaults: {
        //     email: data.email,
        //     fullname: data.fullname,
        //     password: hashPassword,
        //     phoneNumber: data.phoneNumber,
        //     address: data.address,
        //     roleId: "R3",
        //     gender: data.gender,
        //   },

        await db.History.create({
          doctorId: data.doctorId,
          patientId: data.patientId,
          timeType: data.timeType,
          date: data.date,
          image: data.image,
          reason: booking.reason,
          statusId: "S3",
        });

        // let history = await db.History.findOrCreate({
        //   where: {
        //     doctorId: data.doctorId,
        //     patientId: data.patientId,
        //     timeType: data.timeType,
        //     date: data.date,
        //   },
        //   default: {
        //     doctorId: data.doctorId,
        //     patientId: data.patientId,
        //     timeType: data.timeType,
        //     date: data.date,
        //     image: data.image,
        //     reason: booking.reason,
        //     statusId: "S3",
        //   },
        // });

        // if (history) {
        //   history.statusId = "S3";
        //   await history.save();
        // }

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

const getNumberPatientsByDoctorId = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          status: "error",
          message: "Missing required params",
        });
      } else {
        let bookings = await db.Booking.count({
          where: {
            doctorId: {
              [Op.eq]: doctorId,
            },
            statusId: {
              [Op.eq]: "S2",
            },
          },
        });

        let bookingsS3 = await db.History.count({
          where: {
            doctorId: {
              [Op.eq]: doctorId,
            },
            statusId: {
              [Op.eq]: "S3",
            },
          },
        });

        resolve({
          status: "ok",
          data: {
            numberOfPatients: bookings,
            numberOfPatientsDone: bookingsS3,
          },
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getListPatientHistory = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          status: "error",
          message: "Missing required params",
        });
      } else {
        let data = await db.History.findAll({
          where: {
            statusId: "S3",
            doctorId,
          },
          include: [
            {
              model: db.User,
              attributes: [
                "email",
                "fullname",
                "address",
                "phoneNumber",
                "gender",
              ],
              as: "patientDataHistory",
              include: [
                {
                  model: db.Allcode,
                  attributes: ["valueVi", "valueEn"],
                  as: "genderData",
                },
              ],
            },
            {
              model: db.Allcode,
              attributes: ["valueVi"],
              as: "timeTypeDataHistory",
            },
            {
              model: db.User,
              attributes: ["fullname"],
              as: "doctorDataScheduleHistory",
            },
          ],
          raw: false,
          nest: true,
        });
        if (data) {
          resolve({
            status: "ok",
            data,
          });
        } else {
          resolve({
            status: "ok",
            data: [],
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getListPatientHistoryDistinctByDoctorId = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          status: "error",
          message: "Missing required params",
        });
      } else {
        let dataDistinct = await db.History.aggregate("patientId", "DISTINCT", {
          plain: false,
          where: {
            doctorId,
          },
        });
        let patientIds = [];
        dataDistinct.map((item) => {
          patientIds.push(item.DISTINCT);
        });

        let data = [];
        for (let i = 0; i < patientIds.length; i++) {
          let data1 = await db.History.findOne({
            where: {
              statusId: "S3",
              patientId: patientIds[i],
            },
            attributes: {
              exclude: ["image"],
            },
            include: [
              {
                model: db.User,
                attributes: [
                  "email",
                  "fullname",
                  "address",
                  "phoneNumber",
                  "gender",
                ],
                as: "patientDataHistory",
                include: [
                  {
                    model: db.Allcode,
                    attributes: ["valueVi", "valueEn"],
                    as: "genderData",
                  },
                ],
              },
              {
                model: db.Allcode,
                attributes: ["valueVi"],
                as: "timeTypeDataHistory",
              },
            ],
            raw: true,
            nest: true,
          });
          data.push(data1);
        }

        if (data && data[0]) {
          resolve({
            status: "ok",
            data,
          });
        } else {
          resolve({
            status: "ok",
            data: [],
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getListPatientHistoryDetail = (doctorId, patientId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !patientId) {
        resolve({
          status: "error",
          message: "Missing required params",
        });
      } else {
        let data = await db.History.findAll({
          where: {
            doctorId,
            patientId,
            statusId: "S3",
          },
          include: [
            {
              model: db.Allcode,
              attributes: ["valueVi"],
              as: "timeTypeDataHistory",
            },
          ],
          raw: true,
          nest: true,
        });

        if (!data) {
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
  getDoctorsHome,
  getAllDoctors,
  createDoctorInfo,
  getDetailDoctorById,
  createSchedule,
  getScheduleByDate,
  getDetailDoctorExtraInfoById,
  getDoctorProfileById,
  getSchedulePatients,
  sendMedicalBill,
  getNumberPatientsByDoctorId,
  getListPatientHistory,
  getListPatientHistoryDistinctByDoctorId,
  getListPatientHistoryDetail,
};

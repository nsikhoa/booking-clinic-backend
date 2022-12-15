import db from "../models/index";
require("dotenv").config();
import emailService from "../services/emailService";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

let salt = bcrypt.genSaltSync(8);

let getUrlEmail = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify?token=${token}&doctorId=${doctorId}`;

  return result;
};

let getUrlEmailCancelBooking = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/cancel?token=${token}&doctorId=${doctorId}`;

  return result;
};

const bookingAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log(data);
      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType ||
        !data.date ||
        !data.fullname ||
        !data.reason
      ) {
        resolve({
          status: "error",
          message: "Missing input body",
        });
      } else {
        // patientName
        // time
        // doctorName
        let hashPassword = await bcrypt.hashSync("123456X!", salt);

        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            fullname: data.fullname,
            password: hashPassword,
            phoneNumber: data.phoneNumber,
            address: data.address,
            roleId: "R3",
            gender: data.gender,
          },
        });

        let token = uuidv4();

        await emailService.sendSimpleEmail({
          receiverEmail: data.email,
          patientName: data.fullname,
          time: data.timeString,
          doctorName: data.doctorName,
          redirectLink: getUrlEmail(data.doctorId, token),
          redirectLinkDelete: getUrlEmailCancelBooking(data.doctorId, token),
        });

        if (user && user[0]) {
          await db.Booking.create({
            where: { patientId: user[0].id },
            statusId: "S1",
            doctorId: data.doctorId,
            patientId: user[0].id,
            date: data.date,
            timeType: data.timeType,
            reason: data.reason,
            token,
          });
          // let booking = await db.Booking.findOne({
          //   where: { patientId: user[0].id },
          //   raw: false,
          // });

          // booking.doctorId = data.doctorId;
          // booking.statusId = "S1";
          // booking.date = data.date;
          // booking.timeType = data.timeType;
          // booking.reason = data.reason;
          // booking.token = token;

          // await booking.save();
        }

        await db.History.create({
          // statusId: "S1",
          doctorId: data.doctorId,
          patientId: user[0].id,
          date: data.date,
          timeType: data.timeType,
          reason: data.reason,
        });

        resolve({
          status: "ok",
          message: "Save success",
          data: user,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const verifyBookingAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          status: "error",
          message: "Missing input params",
        });
      } else {
        let booking = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: "S1",
          },
          raw: false,
        });

        if (booking) {
          booking.statusId = "S2";
          await booking.save();
          resolve({
            status: "ok",
            message: "Verify success! Status updated!",
          });
        } else {
          resolve({
            status: "active",
            message: "Appointment has been active or not exist!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const cancelBookingAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          status: "error",
          message: "Missing input params",
        });
      } else {
        let booking = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: "S1",
          },
          raw: false,
        });

        if (booking) {
          booking.statusId = "S4";
          await booking.save();

          await db.History.destroy({
            // statusId: "S1",
            where: {
              doctorId: booking.doctorId,
              patientId: booking.patientId,
              date: booking.date,
              timeType: booking.timeType,
              reason: booking.reason,
            },
          });
          resolve({
            status: "ok",
            message: "Cancel success! Status updated!",
          });
        } else {
          resolve({
            status: "active",
            message: "Appointment has been active or not exist!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllPatientHistory = (patientId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!patientId) {
        resolve({
          status: "error",
          message: "Missing required params",
        });
      } else {
        let data = await db.History.findAll({
          where: { patientId, statusId: "S3" },
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
  bookingAppointment,
  verifyBookingAppointment,
  cancelBookingAppointment,
  getAllPatientHistory,
};

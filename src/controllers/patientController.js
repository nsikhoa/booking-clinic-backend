import patientService from "../services/patientService";

const bookingAppointment = async (req, res) => {
  try {
    let data = await patientService.bookingAppointment(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "error",
      message: "Error from server",
    });
  }
};

const verifyBookingAppointment = async (req, res) => {
  try {
    let data = await patientService.verifyBookingAppointment(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "error",
      message: "Error from server",
    });
  }
};

const cancelBookingAppointment = async (req, res) => {
  try {
    let data = await patientService.cancelBookingAppointment(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "error",
      message: "Error from server",
    });
  }
};

const getAllPatientHistory = async (req, res) => {
  try {
    let data = await patientService.getAllPatientHistory(req.query.patientId);
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
  bookingAppointment,
  verifyBookingAppointment,
  cancelBookingAppointment,
  getAllPatientHistory,
};

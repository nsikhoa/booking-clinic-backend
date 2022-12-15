import doctorService from "../services/doctorService";

const getTopDoctorsHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;
  try {
    let doctors = await doctorService.getDoctorsHome(+limit);
    return res.status(200).json(doctors);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "error",
      message: "Error from server",
    });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    let doctors = await doctorService.getAllDoctors();
    return res.status(200).json(doctors);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "error",
      message: "Error from server",
    });
  }
};

const createDoctorInfo = async (req, res) => {
  try {
    let response = await doctorService.createDoctorInfo(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "error",
      message: "Error from server",
    });
  }
};

const getDetailDoctorById = async (req, res) => {
  try {
    let info = await doctorService.getDetailDoctorById(req.query.id);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "error",
      message: "Error from server",
    });
  }
};

const createDoctorSchedule = async (req, res) => {
  try {
    let schedules = await doctorService.createSchedule(req.body);
    return res.status(200).json(schedules);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "error",
      message: "Error from server",
    });
  }
};

const getScheduleByDate = async (req, res) => {
  try {
    let data = await doctorService.getScheduleByDate(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "error",
      message: "Error from server",
    });
  }
};

const getDetailDoctorExtraInfoById = async (req, res) => {
  try {
    let data = await doctorService.getDetailDoctorExtraInfoById(req.query.id);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "error",
      message: "Error from server",
    });
  }
};

const getDoctorProfileById = async (req, res) => {
  try {
    let data = await doctorService.getDoctorProfileById(req.query.id);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "error",
      message: "Error from server",
    });
  }
};

const getSchedulePatients = async (req, res) => {
  try {
    let data = await doctorService.getSchedulePatients(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "error",
      message: "Error from server",
    });
  }
};

const sendMedicalBill = async (req, res) => {
  try {
    let data = await doctorService.sendMedicalBill(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "error",
      message: "Error from server",
    });
  }
};

const getNumberPatientsByDoctorId = async (req, res) => {
  try {
    let data = await doctorService.getNumberPatientsByDoctorId(
      req.query.doctorId
    );
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "error",
      message: "Error from server",
    });
  }
};

const getListPatientHistory = async (req, res) => {
  try {
    let data = await doctorService.getListPatientHistory(req.query.doctorId);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "error",
      message: "Error from server",
    });
  }
};

const getListPatientHistoryDistinct = async (req, res) => {
  try {
    let data = await doctorService.getListPatientHistoryDistinctByDoctorId(
      req.query.doctorId
    );
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "error",
      message: "Error from server",
    });
  }
};

const getListPatientHistoryDetail = async (req, res) => {
  try {
    let data = await doctorService.getListPatientHistoryDetail(
      req.query.doctorId,
      req.query.patientId
    );
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
  getTopDoctorsHome,
  getAllDoctors,
  createDoctorInfo,
  getDetailDoctorById,
  createDoctorSchedule,
  getScheduleByDate,
  getDetailDoctorExtraInfoById,
  getDoctorProfileById,
  getSchedulePatients,
  sendMedicalBill,
  getNumberPatientsByDoctorId,
  getListPatientHistory,
  getListPatientHistoryDistinct,
  getListPatientHistoryDetail,
};

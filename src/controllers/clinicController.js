import clinicService from "../services/clinicService";

const createClinic = async (req, res) => {
  try {
    let data = await clinicService.createClinic(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      message: "Error from server",
    });
  }
};

const getAllClinic = async (req, res) => {
  try {
    let data = await clinicService.getAllClinic();
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      message: "Error from server",
    });
  }
};

const getClinicById = async (req, res) => {
  try {
    let data = await clinicService.getClinicById(req.params.id);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      message: "Error from server",
    });
  }
};

module.exports = {
  createClinic,
  getAllClinic,
  getClinicById,
};

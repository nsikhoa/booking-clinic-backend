import medicalSpecialtyService from "../services/medicalSpecialtyService";

const createSpecialty = async (req, res) => {
  try {
    let data = await medicalSpecialtyService.createSpecialty(req.body);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      message: "Error from server",
    });
  }
};

const getAllSpecialty = async (req, res) => {
  try {
    let data = await medicalSpecialtyService.getAllSpecialty();
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      message: "Error from server",
    });
  }
};

const getSpecialtyById = async (req, res) => {
  try {
    let data = await medicalSpecialtyService.getSpecialtyById(
      req.params.id,
      req.query.location
    );
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
  createSpecialty,
  getAllSpecialty,
  getSpecialtyById,
};

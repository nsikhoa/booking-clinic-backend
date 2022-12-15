import bookingService from "../services/bookingService";

const getBookingByDoctorIdDate = (req, res) => {
  try {
    // let data = bookingService.getBookingByDoctorIdDate(req)
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      message: "Error from server",
    });
  }
};

module.exports = {
  getBookingByDoctorIdDate,
};

import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import medicalSpecialtyController from "../controllers/medicalSpecialtyController";
import bookingController from "../controllers/bookingController";
import clinicController from "../controllers/clinicController";

const router = express.Router();

const initWebRoute = (app) => {
  // router.get("/", homeController.getHomePage);
  // router.get("/about", homeController.getAboutPage);
  // router.get("/crud", homeController.getCRUD);

  // router.post("/post-crud", homeController.postCRUD);
  // router.get("/get-crud", homeController.displayGetCRUD);
  // router.get("/edit-crud", homeController.getEditCRUD);
  // router.post("/put-crud", homeController.putCRUD);
  // router.get("/delete-crud", homeController.deleteCRUD);

  router.post("/api/login", userController.handleLogin);
  router.get("/api/users", userController.getAllUsers);
  router.get("/api/users/email", userController.getUserByEmail);
  router.post("/api/users", userController.createUser);
  router.put("/api/users", userController.updateUser);
  router.delete("/api/users", userController.deleteUser);
  router.get("/api/allcode", userController.getAllCode);

  router.get("/api/doctors-home", doctorController.getTopDoctorsHome);
  router.get("/api/doctors", doctorController.getAllDoctors);
  router.post("/api/doctors", doctorController.createDoctorInfo);
  router.get("/api/doctors/info", doctorController.getDetailDoctorById);
  router.post("/api/doctors/schedules", doctorController.createDoctorSchedule);
  router.get("/api/schedules_date", doctorController.getScheduleByDate);
  router.get(
    "/api/doctors-extrainfo",
    doctorController.getDetailDoctorExtraInfoById
  );
  router.get("/api/doctors/profile", doctorController.getDoctorProfileById);
  router.get("/api/doctors/patients", doctorController.getSchedulePatients);
  router.post(
    "/api/doctors/medicalBookingBill",
    doctorController.sendMedicalBill
  );
  router.get(
    "/api/doctors/patients/count",
    doctorController.getNumberPatientsByDoctorId
  );
  router.get(
    "/api/doctors/patients/history",
    doctorController.getListPatientHistory
  );

  router.get(
    "/api/doctors/patients/historydistinct",
    doctorController.getListPatientHistoryDistinct
  );

  router.get(
    "/api/doctors/patients/historydetail",
    doctorController.getListPatientHistoryDetail
  );

  router.post("/api/patient-booking", patientController.bookingAppointment);
  router.post(
    "/api/verify-booking",
    patientController.verifyBookingAppointment
  );
  router.post(
    "/api/cancel-booking",
    patientController.cancelBookingAppointment
  );
  router.get("/api/patient/history", patientController.getAllPatientHistory);

  router.post("/api/specialties", medicalSpecialtyController.createSpecialty);
  router.get("/api/specialties", medicalSpecialtyController.getAllSpecialty);
  router.get(
    "/api/specialties/:id",
    medicalSpecialtyController.getSpecialtyById
  );

  router.post("/api/clinics", clinicController.createClinic);
  router.get("/api/clinics", clinicController.getAllClinic);
  router.get("/api/clinics/:id", clinicController.getClinicById);

  router.get("/api/booking", bookingController.getBookingByDoctorIdDate);

  return app.use("/", router);
};

module.exports = initWebRoute;

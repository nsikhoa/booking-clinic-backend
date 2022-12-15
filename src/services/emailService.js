require("dotenv").config();
const nodemailer = require("nodemailer");

let sendSimpleEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP_USERNAME, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "Booking Clinic", // sender address
    to: dataSend.receiverEmail, // list of receivers
    subject: "Thông tin đặt lịch khám", // Subject line
    // text: "Hello world?", // plain text body
    html: `
    <h3>Xin chào ${dataSend.patientName}</h3>
    <p>Bạn đã đặt lịch khám trên website bookingclinic</p>
    <p>Thông tin đặt lịch khám: </p>
    <div><b>Thời gian: ${dataSend.time}</b></div>
    <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
    <p>Vui lòng xác nhận <a href="${dataSend.redirectLink}" target="_blank">tại đây</a> để hoàn tất thủ tục đặt lịch khám.
    Sau khi xác nhận bạn sẽ không hủy được lịch hẹn khám này.</p>
    
    <p>Nếu bạn muốn hủy lịch hẹn khám này, vui lòng xác nhận <span><a href="${dataSend.redirectLinkDelete}" target="_blank">Tại đây</a></span>.</p>
    
    <div>Xin chân thành cảm ơn</div>
    `, // html body
  });
};

let sendResponseEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP_USERNAME, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: "Booking Clinic", // sender address
    to: dataSend.email, // list of receivers
    subject: "Kết quả khám", // Subject line
    // text: "Hello world?", // plain text body
    html: `
    <h3>Xin chào ${dataSend.patientName}</h3>
    <p>Bạn đã hoàn tất khám bệnh với bác sĩ ${dataSend.doctorName}</p>
    <p>Thông tin đơn thuốc được gửi ở file đính kèm </p>
    <div>Xin chân thành cảm ơn</div>
    `, // html body
    attachments: [
      {
        filename: "donkham.jpg",
        content: dataSend.image.split("base64,")[1],
        encoding: "base64",
      },
    ],
  });
};

module.exports = {
  sendSimpleEmail,
  sendResponseEmail,
};

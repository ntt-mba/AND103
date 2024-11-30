var express = require('express');
var router = express.Router();

const userModel = require("../models/UserModel");
const sendMail = require("../util/mailConfig");
const JWT = require("jsonwebtoken");
const config = require("../util/tokenConfig");
const login = require("../util/tokenConfig");

//localhost:3000/users/all
//lấy danh sách user
router.get("/all", async function (req, res) {
  var list = await userModel.find({}, "username");
  res.json(list);
})

//Lấy thông tin chi tiết của một user
router.get("/detail/:id", async function (req, res) {
  try {
    const { id } = req.params;
    var detail = await userModel.findByID(id);
    if (detail) {
      res.status(200).json(detail);
    } else {
      res.status(400).json({ status: true, message: "khoong tìm thấy" });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "có lỗi xảy ra " })
  }
});

//lấy user có tuổi lớn hơn X
router.get("/get-ds", async function (req, res) {
  try {
    const { tuoi } = req.query;
    var list = await userModel.find({ old: { $gt: tuoi } });
    res.status(200).json(list);
  } catch (error) {
    res.status(400).json({ status: false, message: " có lỗi xảy ra" })
  }
})

//lấy user có tuổi từ nhỏ hơn x hoặc lớn hơn y
router.get("/get-ds2", async function (req, res) {
  try {
    const { miner, maxer } = req.query;
    var list = await userModel.find({ old: { $or: [{ $lt: miner }, { $gt: maxer }] } });
    res.status(200).json(list);
  } catch (error) {
    res.status(400).json({ status: false, message: " có lỗi xảy ra" })
  }
})

router.post("/send-mail", async function (req, res, next) {
  try {
    const { to, subject, content } = req.body;

    const mailOptions = {
      from: "tai <nrotramy28@gmail.com>",
      to: to,
      subject: subject,
      html: content
    };
    await sendMail.transporter.sendMail(mailOptions);
    res.json({ status: 1, message: "Gửi mail thành công" });
  } catch (err) {
    res.json({ status: 0, message: "Gửi mail thất bại" });
  }
});

//login
router.post("/login", async function (req, res) {
  try {
    const { user, pass } = req.body;
    const checkUser = await userModel.findOne({ username: user, password: pass });
    if (checkUser == null) {
      res.status(400).json({ status: false, message: "tên đăng nhập hoặc mật khẩu sai" });
    } else {
      var token = JWT.sign({ username: user }, config.SECRETKEY, { expiresIn: '30s' });
      var refreshToken = JWT.sign({ username: user }, config.SECRETKEY, { expiresIn: "1d" });
      res.status(200).json({ status: true, message: "đăng nhập thành công", token: token, refreshToken: refreshToken });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "đã có lỗi xảy ra" });
  }
});

module.exports = router;

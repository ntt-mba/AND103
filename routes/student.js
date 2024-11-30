const express = require('express');
const router = express.Router();
const Student = require('../models/studentModel');

//Lấy toàn bộ danh sách sinh viên
router.get('/all', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Lấy toàn bộ danh sách sinh viên thuộc khoa CNTT
router.get('/it', async (req, res) => {
  try {
    const students = await Student.find({ subject: 'Information Technology' });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Lấy danh sách sinh viên có điểm trung bình từ 6.5 đến 8.5
router.get('/gpa/6.5-8.5', async (req, res) => {
  try {
    const students = await Student.find({
      gpa: { $gte: 6.5, $lte: 8.5 },
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Tìm kiếm thông tin của sinh viên theo MSSV
router.get('/:studentID', async (req, res) => {

  try {
    const studentID = req.params.studentID;
    const student = await Student.findOne({ studentID: studentID });

    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Sinh viên không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Thêm mới một sinh viên
router.post('/add', async (req, res) => {
  const { studentID, fullName, gpa, subject, age } = req.body;
  const student = new Student({
    studentID,
    fullName,
    gpa,
    subject,
    age,
  });

  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Thay đổi thông tin sinh viên theo MSSV
router.put('/:studentID', async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { studentID: req.params.studentID },
      req.body,
      { new: true }
    );
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Sinh viên không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Xóa một sinh viên ra khỏi danh sách
router.delete('/:studentID', async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ studentID: req.params.studentID });

    if (student) {
      res.json({ message: 'Sinh viên đã được xóa' });
    } else {
      res.status(404).json({ message: 'Sinh viên không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Lấy danh sách sinh viên thuộc BM CNTT và có DTB từ 9.0
router.get('/it/gpa/9.0', async (req, res) => {
  try {
    const students = await Student.find({
      subject: 'Information Technology',
      gpa: { $gte: 9.0 },
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Lấy danh sách sinh viên có độ tuổi từ 18 đến 20 thuộc CNTT và có điểm trung bình từ 6.5
router.get('/it/age/18-20/gpa/6.5', async (req, res) => {
  try {
    const students = await Student.find({
      subject: 'Information Technology',
      age: { $gte: 18, $lte: 20 },
      gpa: { $gte: 6.5 },
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Sắp xếp danh sách sinh viên tăng dần theo điểm trung bình
router.get('/arrange/gpa', async (req, res) => {
  try {
    const students = await Student.find().sort({ gpa: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Tìm sinh viên có điểm trung bình cao nhất thuộc BM CNTT
router.get('/it/gpa/highest', async (req, res) => {
  try {
    const student = await Student.find({ subject: 'Information Technology' })
      .sort({ gpa: -1 })
      .limit(1);
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
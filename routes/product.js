var express = require('express');
var router = express.Router();
var upload = require("../util/uploadConfig");

const productModel = require("../models/productModel");
var JWT = require("jsonwebtoken");
var config = require("../util/tokenConfig");

//lấy danh sách tất cả các sản phẩm
router.get("/get-list", async function (req, res) {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if (err) {
                    res.status(403).json({ "status": 403, "err": err });
                } else {
                    var list = await productModel.find().populate("category");
                    res.status(200).json({ status: true, messenge: "Thành công", data: "list" });
                }
            });
        } else {
            res.status(401).json({ "status": 401 });
        }
    } catch (error) {
        res.status(400).json({ status: false, messenge: "Có lỗi xảy ra" });
    }
})

//lấy danh sách tất cả các sản phẩm có số lượng lớn hơn 20
router.get("/get-list-soluong", async function (req, res) {
    try {
        const { soluong } = req.query;
        var list = await productModel.find({ quantity: { $gt: soluong } });
        res.status(200).json(list);
    } catch (error) {
        res.status(400).json({ status: false, messenge: "Có lỗi xảy ra" });
    }
})

//lấy danh sách tất cả các sản phẩm có giá từ 20000 đến 50000
router.get("/get-list-trongkhoang", async function (req, res) {
    try {
        const { min, max } = req.query;
        var list = await productModel.find({ price: { $gte: min, $lte: max } });
        res.status(200).json(list);
    } catch (error) {
        res.status(400).json({ status: false, messenge: "Có lỗi xảy ra" });
    }
})

//lấy danh sachs tất cả sản phẩm có số lượng nhỏ hơn 10 hoặc có giá lớn hơn 15000
router.get("/", async function (req, res) {
    try {
        const { nhohon, lonhon } = req.query;
        var list = await productModel.find({ $or: [{ quantity: { $lt: nhohon } }, { price: { $gt: lonhon } }] });
        res.status(200).json(list);
    } catch (error) {
        res.status(400).json({ status: false, messenge: "Có lỗi xảy ra" });
    }
})

//lấy thông tin chi tiết của sản phẩm
router.get("/detail/:id", async function (req, res) {
    try {
        const { id } = req.params;
        var list = await productModel.findById(id);
        res.status(200).json(list);
    } catch (error) {
        res.status(400).json({ status: false, messenge: "Có lỗi xảy ra" });
    }
})

//thêm
router.post("/add", async function (req, res) {
    try {
        const { name, price, quantity } = req.body;
        const newItem = { name, price, quantity };
        await productModel.create(newItem);
        res.status(200).json({ status: true, messenge: "Thành công" });
    } catch (error) {
        res.status(400).json({ status: false, messenge: "Có lỗi xảy ra" });
    }
})

//sửa
router.put("/edit", async function (req, res) {
    try {
        const { id, name, price, quantity } = req.body;
        var itemUpdate = await productModel.findById(id);
        if (itemUpdate) {
            itemUpdate.name = name ? name : itemUpdate.name;
            itemUpdate.price = price ? price : itemUpdate.price;
            itemUpdate.quantity = quantity ? quantity : itemUpdate.quantity;
            await itemUpdate.save();
            res.status(200).json({ status: true, messenge: "Thành công" });
        } else {
            res.status(400).json({ status: false, messenge: "không tìm thấy" });
        }
    } catch (error) {
        res.status(400).json({ status: false, messenge: "Có lỗi xảy ra" });
    }
})

//xóa
router.delete("/delete/:id", async function (req, res) {
    try {
        const { id } = req.params;
        await productModel.findByIdAndDelete(id);
        res.status(200).json({ status: true, messenge: "Thành công" });
    } catch (error) {
        res.status(400).json({ status: false, messenge: "Có lỗi xảy ra" });
    }
})

//upload hình ảnh
//localhost:3000/product/upload-Image
router.post('/upload', [upload.single('Anh')], async (req, res, next) => {
    try {
        const { file } = req;
        if (!file) {
            return res.json({ status: 0, link: "" });
        } else {
            const url = `http://localhost:3000/images/${file.filename}`;
            return res.json({ status: 1, url: url });
        }
    } catch (error) {
        console.log('Upload image error: ', error);
        return res.json({ status: 0, link: "" });
    }
});

module.exports = router;
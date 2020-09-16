const express = require("express");
const multer = require("multer");
const router = express.Router();
// let upload = multer({ dest: '../uploads/' })//设置默认图片保存地址
let hostname = "http://192.168.43.73:88/"
//npm multer官方文档给的磁盘存储引擎，可以让你控制文件的存储位置与修改文件名称
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../uploads/')//接受文件的路径,__dirname代表当前文件的父级文件路径，这里指Controller文件路径
    },
    filename: function (req, file, cb) {//给上传的文件命名
        // cb(null, file.fieldname + '-' + Date.now())
        cb(null, new Date().valueOf() + "_" + Math.random().toString().substr(2, 6) + "." + file.originalname.split(".").pop())//文件命名规则，保证文件名称不能重复，需要加上后缀
    }
})

let upload = multer({ storage: storage })

router.post("/uploadImg", upload.single('avatar'), (req, res, next) => {
    let ob = { code: -1, msg: "上传失败", url: "" };
    if (req.file) {
        ob = { code: 1, msg: "上传成功", url: hostname + "uploads/" + req.file.filename };
        res.json(ob);
    } else {
        res.json(ob);
    }
})


module.exports = router;
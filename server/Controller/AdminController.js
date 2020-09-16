const express = require('express');
const AdminModel = require('../Model/AdminModel');
const router = express.Router();
const format = require('../conment/js/dateFormat/dateFormat')


//查询所有举报信息
router.get('/getMsgInfo', (req, res) => {
    // 需要对数据进行操作  Model 
    let adminModel = new AdminModel();
    adminModel.getMsgInfo((results) => {
        res.json(results);
    });
});

// 处理举报文章或商品或用户
router.post('/handle', (req, res) => {
    let adminModel = new AdminModel();
    adminModel.Handle(req.body,(results) => {
        res.json(results);
    });
});

//解禁文章或商品或用户
router.post('/untie', (req, res) => {
    let adminModel = new AdminModel();
    adminModel.Untie(req.body,(results) => {
        res.json(results);
    });
});

//删除投诉
router.post('/deleteComplaint', (req, res) => {
    let adminModel = new AdminModel();
    adminModel.deleteComplaint(req.body.rid,(results) => {
        res.json(results);
    });
});

//查询笔记或商品或用户
router.post('/selectMsg', (req, res) => {
    let adminModel = new AdminModel();
    adminModel.selectMsg(req.body.msg,(results) => {
        res.json(results);
    });
});




module.exports = router;

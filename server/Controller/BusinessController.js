const express = require('express');
const BusinessModel = require('../Model/BusinessModel');
const router = express.Router();
const format = require('../conment/js/dateFormat/dateFormat')


//查询所有举报信息
router.get('/getMsgInfo', (req, res) => {
    // 需要对数据进行操作  Model 
    let businessModel = new BusinessModel();
    businessModel.getMsgInfo(req.query.uid, (results) => {
        res.json(results);
    });
});

// 下架商品
router.post('/handle', (req, res) => {
    let businessModel = new BusinessModel();
    let date = new Date()
    req.body["lowerShelfTime"] = format.dateFormat("YYYY-mm-dd HH:MM:SS", date)//获取当前时间
    businessModel.Handle(req.body, (results) => {
        res.json(results);
    });
});

//上架商品户
router.post('/untie', (req, res) => {
    let businessModel = new BusinessModel();
    let date = new Date()
    req.body["shelfTime"] = format.dateFormat("YYYY-mm-dd HH:MM:SS", date)//获取当前时间
    businessModel.Untie(req.body, (results) => {
        res.json(results);
    });
});

//删除投诉
router.post('/deleteComplaint', (req, res) => {
    let businessModel = new BusinessModel();
    businessModel.deleteComplaint(req.body.rid, (results) => {
        res.json(results);
    });
});

//查询笔记或商品或用户
router.post('/selectMsg', (req, res) => {
    let businessModel = new BusinessModel();
    businessModel.selectMsg(req.body.msg, (results) => {
        res.json(results);
    });
});

//发表商品
router.post('/publishSP', (req, res) => {
    let businessModel = new BusinessModel();
    let date = new Date();
    req.body.thisdata["shelfTime"] = format.dateFormat("YYYY-mm-dd HH:MM:SS", date)//获取当前时间
    businessModel.publishSP(req.body.thisdata, (results) => {
        res.json(results);
    });
});

//拿去订单信息
router.get('/getOrder', (req, res) => {
    let businessModel = new BusinessModel();
    businessModel.getOrder(req.query.uid, (results) => {
        for (var i = 0, num = results.data.length; i < num; i++) {
            results.data[i].time = format.dateFormat("YYYY-mm-dd", results.data[i].time)
        }
        res.json(results);
    });
});

//发货
router.post('/deliverGoods', (req, res) => {
    let businessModel = new BusinessModel();
    businessModel.deliverGoods(req.body.oid, (results) => {
        res.json(results);
    });
});

//确认收货
router.post('/confirmReceipt', (req, res) => {
    let businessModel = new BusinessModel();
    businessModel.confirmReceipt(req.body.oid, (results) => {
        res.json(results);
    });
});



module.exports = router;

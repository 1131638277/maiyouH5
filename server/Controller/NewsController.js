const express = require('express');
const NewsModel = require('../Model/NewsModel');
const router = express.Router();

// 获取一个新闻信息
router.get('/newinfo', (req, res) => {
    // 需要对数据进行操作  Model 
    let newsModel = new NewsModel();
    // console.log('我传的值'+req.query);
    newsModel.getNews((results) => {
        res.json(results);
    });
});

module.exports = router;

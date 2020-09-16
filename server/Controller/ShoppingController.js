const express = require("express");
const ShoppingModel = require("../Model/ShoppingModel");
const router = express.Router();
const format = require('../conment/js/dateFormat/dateFormat')

//获取所有商品种类
router.get('/types', (req, res) => {
    let shoppingModel = new ShoppingModel();
    shoppingModel.getTypes((request) => {
        res.json(request);
    })
})

//根据查询条件查询商品的详情信息（可以一类或一个商品的详情）
router.get('/commodityinfo', (req, res) => {
    let keywords = req.query.keywords;
    let shoppingModel = new ShoppingModel();
    shoppingModel.getCommodityinfo(keywords, (request) => {
        for (let i = 0; i < request.data.length; i++) {//将详情图片，轮播图片，关键字，格式转化为数组
            if (request.data[i].detailedImgs) {
                request.data[i].detailedImgs = request.data[i].detailedImgs.split(";");
            }
            if (request.data[i].showImgs) {
                request.data[i].showImgs = request.data[i].showImgs.split(";");
            } else {
                request.data[i].showImgs = [];
            }
            if (request.data[i].keywords) {
                request.data[i].keywords = request.data[i].keywords.split(",");
            }
        }
        res.json(request);
    })
})

//查询商品的评论信息
router.get('/getcomments', (req, res) => {
    let keywords = req.query.cid;
    let shoppingModel = new ShoppingModel();
    shoppingModel.getComments(keywords, (request) => {
        res.json(request);
    })

})

//查询首页轮播推荐商品
router.get('/getrecommend', (req, res) => {
    let shoppingModel = new ShoppingModel();
    shoppingModel.getRecommend((request) => {
        res.json(request);
    })
})

//查询推荐商品
router.get('/getcommodity', (req, res) => {
    var kerword = req.query.keyw;
    let shoppingModel = new ShoppingModel();
    shoppingModel.getCommodity(kerword, (request) => {
        res.json(request);
    })
})

//收藏商品
router.post('/collection', (req, res) => {
    let shoppingModel = new ShoppingModel();
    let noedata = new Date();
    req.body['time'] = format.dateFormat("YYYY-mm-dd HH:MM:ss", noedata)//获取当前时间
    shoppingModel.collection(req.body, (request) => {
        res.json(request);
    })
})

//取消收藏
router.post('/cancelCollection', (req, res) => {
    let shoppingModel = new ShoppingModel();
    shoppingModel.cancelCollection(req.body, (request) => {
        res.json(request);
    })
})
//查询该商品是否已在购物车中
router.post('/getcardflag', (req, res) => {
    let shoppingModel = new ShoppingModel();
    shoppingModel.getcardflag(req.body, (request) => {
        res.json(request);
    })
})

//加入购物车
router.post('/addtoCart', (req, res) => {
    let shoppingModel = new ShoppingModel();
    let noedata = new Date();
    req.body['time'] = format.dateFormat("YYYY-mm-dd HH:MM:SS", noedata)//获取当前时间
    shoppingModel.addtoCart(req.body, (request) => {
        res.json(request);
    })
})

//获取某个用户的购物车信息
router.get('/getCartInfo', (req, res) => {
    let shoppingModel = new ShoppingModel();
    shoppingModel.getCartInfo(req.query.uid, (request) => {
        for (var i = 0, num = request.data.length; i < num; i++) {
            request.data[i].time = format.dateFormat("YYYY-mm-dd", request.data[i].time)
        }
        res.json(request);
    })
})

//获取某个用户的收藏商品信息
router.get('/getCollectionInfo', (req, res) => {
    let shoppingModel = new ShoppingModel();
    shoppingModel.getCollectionInfo(req.query.uid, (request) => {
        for (var i = 0, num = request.data.length; i < num; i++) {
            request.data[i].time = format.dateFormat("YYYY-mm-dd", request.data[i].time)
        }
        res.json(request);
    })
})

//看是否已收藏
router.post('/getconInfo', (req, res) => {
    let shoppingModel = new ShoppingModel();
    shoppingModel.getconInfo(req.body, (request) => {
        res.json(request);
    })
})

//直接购买
router.post('/purchase', (req, res) => {
    let shoppingModel = new ShoppingModel();
    let nowdata = new Date();
    req.body['time'] = format.dateFormat("YYYY-mm-dd HH:MM:ss", nowdata)//获取当前时间
    shoppingModel.purchase(req.body, (request) => {
        res.json(request);
    })
})

//删除某个购物车的东西
router.get('/todelete', (req, res) => {
    let shoppingModel = new ShoppingModel();
    shoppingModel.todelete(req.query.sid, (request) => {
        res.json(request);
    })
})

//拿去订单信息
router.get('/getOrder', (req, res) => {
    let shoppingModel = new ShoppingModel();
    shoppingModel.getOrder(req.query.uid, (results) => {
        for (var i = 0, num = results.data.length; i < num; i++) {
            results.data[i].time = format.dateFormat("YYYY-mm-dd", results.data[i].time)
        }
        res.json(results);
    });
});

module.exports = router;

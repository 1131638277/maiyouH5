//链接数据库
const DbBase = require('./DbBase');
class ShoppingModel extends DbBase {
    constructor() {
        super();
        this.table = 'commodityinfo';
    }

    //获取所有商品种类
    getTypes(callback) {
        let sql = `select commoditytype.* from commoditytype where 1`;
        this.mydb.query(sql, (err, results) => {
            let jg = {
                code: '',
                Msg: '',
                data: []
            };
            if (err) {
                jg.code = -1,
                    jg.Msg = '商品种类数据获取失败！';
                console.log(err);
            } else {
                jg.code = 1,
                    jg.Msg = '数据获取成功！',
                    jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //获取某类的所有商品
    getCommodityinfo(keywords, callback) {
        let sql = `select commodityinfo.* from commodityinfo where commodityinfo.status=1 and commodityinfo.category=? or commodityinfo.cid=? group by cid`;
        this.mydb.query(sql, [keywords, keywords], (err, results) => {
            let jg = {
                code: '',
                Msg: '',
                data: []
            };
            if (err) {
                jg.code = -1,
                    jg.Msg = '商品数据获取失败！';
                console.log(err);
            } else {
                jg.code = 1,
                    jg.Msg = '数据获取成功！',
                    jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //获取商品的评论信息
    getComments(keywords, callback) {
        let sql = `select commoditycomments.*,users.username,users.avatar from commoditycomments,users where commoditycomments.status=1 and commoditycomments.commodityId=? and commoditycomments.uid=users.uid group by cid`;
        this.mydb.query(sql, [keywords, keywords], (err, results) => {
            let jg = {
                code: '',
                Msg: '',
                data: []
            };
            if (err) {
                jg.code = -1,
                    jg.Msg = '评论数据获取失败！';
                console.log(err);
            } else {
                jg.code = 1,
                    jg.Msg = '数据获取成功！',
                    jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //获取首页轮播推荐商品
    getRecommend(callback) {
        let sql = `select commodityinfo.imgs,commodityinfo.cid from commodityinfo,recommend where commodityinfo.status=1 and commodityinfo.cid=recommend.cid group by cid`;
        this.mydb.query(sql, (err, results) => {
            let jg = {
                code: '',
                Msg: '',
                data: []
            };
            if (err) {
                jg.code = -1,
                    jg.Msg = '推荐商品数据获取失败！';
                console.log(err);
            } else {
                jg.code = 1,
                    jg.Msg = '数据获取成功！',
                    jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //获取推荐商品
    getCommodity(keyw, callback) {
        let sql = `select commodityinfo.cid,commodityinfo.nowPrice,commodityinfo.imgs,commodityinfo.name from commodityinfo where commodityinfo.status=1 and (category like CONCAT('%',?,'%') or keywords like CONCAT('%',?,'%') or name like CONCAT('%',?,'%')) group by shelfTime`;
        if (keyw == "全部") {
            sql = `select commodityinfo.cid,commodityinfo.nowPrice,commodityinfo.imgs,commodityinfo.name from commodityinfo where commodityinfo.status=1 group by shelfTime desc`;
        }
        this.mydb.query(sql, [keyw, keyw, keyw], (err, results) => {
            let jg = {
                code: '',
                Msg: '',
                data: []
            };
            if (err) {
                jg.code = -1,
                    jg.Msg = '推荐商品数据获取失败！';
                console.log(err);
            } else {
                jg.code = 1,
                    jg.Msg = '数据获取成功！',
                    jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //收藏商品
    collection(collectionInfo, callback) {
        let fieldstr = '', field = '';
        let data = [];
        let isFirst = true;
        for (const f in collectionInfo) {
            if (collectionInfo.hasOwnProperty(f)) {
                fieldstr += (isFirst ? '' : ', ') + f;    //组装字段  也可以组装成数组 最后JOIN
                field += (isFirst ? '' : ', ') + '?';         //组装字段
                data.push(collectionInfo[f]);                 //组装字段对应的值
            }
            isFirst = false;
        }
        let sql = `INSERT INTO collectioncommodity (${fieldstr}) VALUES (${field});
        update commodityinfo set collectionNum=collectionNum+1 where cid = ${collectionInfo.coid};`;
        this.mydb.query(sql, data, (err, results) => {
            let jg = { code: 1, Msg: '收藏成功！' };
            if (err) {
                jg.code = -1,
                    jg.Msg = '收藏失败！'
                console.log(err);
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //取消收藏
    cancelCollection(collectionInfo, callback) {
        let sql = `delete from collectioncommodity where uid=${collectionInfo.uid} and coid=${collectionInfo.coid};`
        this.mydb.query(sql, (err, results) => {
            let jg = { code: 1, Msg: '取消收藏成功！' };
            if (err) {
                jg.code = -1,
                    jg.Msg = '取消收藏失败！'
                console.log(err);
            }
            callback(jg);
            this.mydb.end();
        });
    }
    //查询该商品是否已在购物车中
    getcardflag(info, callback) {
        let sql = `select * from shoppingcart where uid=${info.uid} and cid=${info.cid}`
        this.mydb.query(sql, (err, results) => {
            let jg = { code: 1, Msg: '查询成功！', data: [] };
            if (err) {
                jg.code = -1,
                    jg.Msg = '查询失败！'
                console.log(err);
            } else {
                jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //加入购物车
    addtoCart(infos, callback) {
        let flag = infos.flag;
        if (flag) {
            let sql = `update shoppingcart set num=num+${infos.num} where uid=${infos.uid} and cid=${infos.cid}`;
            this.mydb.query(sql, (err, results) => {
                let jg = { code: 1, Msg: '加入购物车成功！' };
                if (err) {
                    jg.code = -1,
                        jg.Msg = '加入购物车失败！'
                    console.log(err);
                }
                callback(jg);
                this.mydb.end();
            });
        } else {
            delete infos.flag;
            let fieldstr = '', field = '';
            let data = [];
            let isFirst = true;
            for (const f in infos) {
                if (infos.hasOwnProperty(f)) {
                    fieldstr += (isFirst ? '' : ', ') + f;    //组装字段  也可以组装成数组 最后JOIN
                    field += (isFirst ? '' : ', ') + '?';         //组装字段
                    data.push(infos[f]);                 //组装字段对应的值
                }
                isFirst = false;
            }
            let sql = `INSERT INTO shoppingcart (${fieldstr}) VALUES (${field});`;
            this.mydb.query(sql, data, (err, results) => {
                let jg = { code: 1, Msg: '加入购物车成功！' };
                if (err) {
                    jg.code = -1,
                        jg.Msg = '加入购物车失败！'
                    console.log(err);
                }
                callback(jg);
                this.mydb.end();
            });
        }
    }

    //获取某个用户的购物车信息
    getCartInfo(uid, callback) {
        let sql = `select * from shoppingcart where uid=${uid} group by shoppingcart.time desc`;
        this.mydb.query(sql, (err, results) => {
            let jg = { code: 1, Msg: '获取信息成功！', data: [] };
            if (err) {
                jg.code = -1,
                    jg.Msg = '获取信息成功！'
                console.log(err);
            } else {
                jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //获取某个用户的收藏商品信息
    getCollectionInfo(uid, callback) {
        let sql = `SELECT collectioncommodity.time,commodityinfo.* FROM users a INNER JOIN collectioncommodity ON a.uid = collectioncommodity.uid LEFT JOIN commodityinfo ON collectioncommodity.coid = commodityinfo.cid WHERE a.uid = ${uid} group by collectioncommodity.time desc`;
        this.mydb.query(sql, (err, results) => {
            let jg = { code: 1, Msg: '获取信息成功！', data: [] };
            if (err) {
                jg.code = -1,
                    jg.Msg = '获取信息成功！'
                console.log(err);
            } else {
                jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //查看是否已收藏
    getconInfo(info, callback) {
        let sql = `SELECT * FROM collectioncommodity WHERE uid=${info.uid} and coid=${info.cid}`;
        this.mydb.query(sql, (err, results) => {
            let jg = { code: 1, Msg: '获取信息成功！', data: [] };
            if (err) {
                jg.code = -1,
                    jg.Msg = '获取信息失败！'
                console.log(err);
            } else {
                jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //直接购买
    purchase(infos, callback) {
        let fieldstr = '', field = '';
        let data = [];
        let isFirst = true;
        for (const f in infos) {
            if (infos.hasOwnProperty(f)) {
                fieldstr += (isFirst ? '' : ', ') + f;    //组装字段  也可以组装成数组 最后JOIN
                field += (isFirst ? '' : ', ') + '?';         //组装字段
                data.push(infos[f]);                 //组装字段对应的值
            }
            isFirst = false;
        }
        let sql = `INSERT INTO orderform (${fieldstr}) VALUES (${field});
            update commodityinfo set number=number-${infos.num} where ${infos.cid};
            update commodityinfo set soldNum=soldNum+${infos.num} where ${infos.cid};`;
        this.mydb.query(sql, data, (err, results) => {
            let jg = { code: 1, Msg: '购买成功！' };
            if (err) {
                jg.code = -1,
                    jg.Msg = '购买失败！'
                console.log(err);
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //删除某个购物车的东西
    todelete(sid, callback) {
        let sql = `delete from shoppingcart where sid=${sid}`;
        this.mydb.query(sql, (err, results) => {
            let jg = { code: 1, Msg: '删除成功！', data: [] };
            if (err) {
                jg.code = -1,
                    jg.Msg = '删除失败！'
                console.log(err);
            } else {
                jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //拿取订单信息
    getOrder(uid, callback) {
        let sql = `select * from orderform where kuid=? group by time desc;`;
        this.mydb.query(sql, [uid], (err, results) => {
            let jg = { code: 1, Msg: '获取信息成功！', data: [] };
            if (err) {
                jg.code = -1,
                    jg.Msg = '获取信息失败！'
                console.log(err);
            } else {
                jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });
    }

}

module.exports = ShoppingModel;
// 既然要对数据库的数据进行，必须要连接到数据库 
const DbBase = require('./DbBase');
const format = require('../conment/js/dateFormat/dateFormat');
class NoteModel extends DbBase {
    constructor() {
        super();
        this.table = 'order';
    }


    //获取我的商品
    getMsgInfo(uid, callback) {
        let sql = `select * from commodityinfo where uid=? group by shelfTime desc;`;
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

    // 下架商品
    Handle(handlemsg, callback) {
        let sql = `update commodityinfo set status=0,lowerShelfTime='${handlemsg.lowerShelfTime}' where cid=${handlemsg.cid};`
        this.mydb.query(sql, (err, results) => {
            let jg = { code: 1, Msg: '下架成功！', data: [] };
            if (err) {
                jg.code = -1,
                    jg.Msg = '下架失败！'
                console.log(err);
            } else {
                jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //上架商品
    Untie(untieMsg, callback) {
        let sql = `update commodityinfo set status=1,shelfTime='${untieMsg.shelfTime}' where cid=${untieMsg.cid};`
        this.mydb.query(sql, (err, results) => {
            let jg = { code: 1, Msg: '上架成功！', data: [] };
            if (err) {
                jg.code = -1,
                    jg.Msg = '上架失败！'
                console.log(err);
            } else {
                jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });

    }

    //删除投诉
    deleteComplaint(rid, callback) {
        let sql = `delete from reportinfo where rid=?;`;
        this.mydb.query(sql, [rid], (err, results) => {
            let jg = { code: 1, Msg: '删除投诉成功！', data: [] };
            if (err) {
                jg.code = -1,
                    jg.Msg = '删除投诉失败！'
                console.log(err);
            } else {
                jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //查询笔记或商品
    selectMsg(msg, callback) {
        let sql;
        if (msg.radio == "1") {
            sql = `select notes.*, users.username,users.avatar from notes,users where users.uid=notes.uid and (category like CONCAT('%',?,'%')  or title like CONCAT('%',?,'%') or keywords like CONCAT('%',?,'%') or info like CONCAT('%',?,'%') or uname like CONCAT('%',?,'%')) group by notes.releasetime desc`
            this.mydb.query(sql, [msg.keywords, msg.keywords, msg.keywords, msg.keywords, msg.keywords, msg.keywords], (err, results) => {
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
        } else if (msg.radio == "2") {
            sql = `select * from commodityinfo where (category like CONCAT('%',?,'%')  or name like CONCAT('%',?,'%') or keywords like CONCAT('%',?,'%')) group by commodityinfo.shelfTime desc`
            this.mydb.query(sql, [msg.keywords, msg.keywords, msg.keywords], (err, results) => {
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
        } else if (msg.radio == "3") {
            sql = `select * from users where (username like CONCAT('%',?,'%')  or tel=? or area like CONCAT('%',?,'%')) or uid=? group by uid desc`
            this.mydb.query(sql, [msg.keywords, msg.keywords, msg.keywords, msg.keywords], (err, results) => {
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
    }

    //发布商品
    publishSP(commodityInfo, callback) {
        let flagInfo = false;
        if (commodityInfo.cid == "") {
            delete commodityInfo.cid;
            flagInfo = true;
        }

        let fieldstr = '', field = '';
        let data = [];
        let isFirst = true;
        for (const f in commodityInfo) {
            if (commodityInfo.hasOwnProperty(f)) {
                fieldstr += (isFirst ? '' : ', ') + f;    //组装字段  也可以组装成数组 最后JOIN
                field += (isFirst ? '' : ', ') + '?';         //组装字段
                data.push(commodityInfo[f]);                 //组装字段对应的值
            }
            isFirst = false;
        }
        let sql;
        if (flagInfo) {
            console.log("发布：", commodityInfo);
            sql = `INSERT INTO commodityinfo (${fieldstr}) VALUES (${field}); `;
        } else {
            console.log("编辑：", commodityInfo);
            sql = `update commodityinfo set cid=?,uid=?,name=?,nowPrice=?,address=?,category=?,imgs=?,keywords=?,service=? where cid=${commodityInfo.cid}`
        }
        // let sql = `INSERT INTO commodityinfo (${fieldstr}) VALUES (${field}); `;
        this.mydb.query(sql, data, (err, results) => {
            let jg = { code: '', Msg: '' };
            if (err) {
                jg.code = -1,
                    jg.Msg = '发表失败！请重新发表'
                console.log(err);
            } else {
                jg.code = 1,
                    jg.Msg = '发表成功！';
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //拿取订单信息
    getOrder(uid, callback) {
        let sql = `select * from orderform where suid=? group by time desc;`;
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

    //发货
    deliverGoods(oid, callback) {
        let date = new Date();
        let nowTime = format.dateFormat("YYYY-mm-dd HH:MM:SS", date)//获取当前时间
        let sql = `update orderform set step=2,outtime='${nowTime}' where oid=${oid}`;
        this.mydb.query(sql, (err, results) => {
            let jg = { code: 1, Msg: '发货成功！', data: [] };
            if (err) {
                jg.code = -1,
                    jg.Msg = '发货失败！'
                console.log(err);
            } else {
                jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //确认收货
    confirmReceipt(oid, callback) {
        let date = new Date();
        let nowTime = format.dateFormat("YYYY-mm-dd HH:MM:SS", date)//获取当前时间
        let sql = `update orderform set step=4,gettime='${nowTime}' where oid=${oid}`;
        this.mydb.query(sql, (err, results) => {
            let jg = { code: 1, Msg: '收货成功！', data: [] };
            if (err) {
                jg.code = -1,
                    jg.Msg = '收货失败！'
                console.log(err);
            } else {
                jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });
    }

}

module.exports = NoteModel;
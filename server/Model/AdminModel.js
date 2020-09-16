// 既然要对数据库的数据进行，必须要连接到数据库 
const DbBase = require('./DbBase');
class NoteModel extends DbBase {
    constructor() {
        super();
        this.table = 'notes';
    }


    //获取所有的投诉信息
    getMsgInfo(callback) {
        let sql = `select * from reportinfo where status=1 group by time desc;`;
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

    // 禁用举报文章或商品
    Handle(handlemsg, callback) {
        let sql;
        if (handlemsg.type == "笔记") {
            sql = `update notes set status=0 where nid=${handlemsg.nid};delete from reportinfo where rid=${handlemsg.rid};`
        } else if (handlemsg.type == "商品") {
            sql = `update commodityinfo set status=2 where cid=${handlemsg.nid};delete from reportinfo where rid=${handlemsg.rid};`
        } else if (handlemsg.type == "1") {
            sql = `update notes set status=0 where nid=${handlemsg.nid};`
        } else if (handlemsg.type == "2") {
            sql = `update commodityinfo set status=0 where cid=${handlemsg.nid};`
        } else if (handlemsg.type == "3") {
            sql = `update users set status=0 where uid=${handlemsg.nid};`
        }

        this.mydb.query(sql, (err, results) => {
            let jg = { code: 1, Msg: '处理成功！', data: [] };
            if (err) {
                jg.code = -1,
                    jg.Msg = '处理失败！'
                console.log(err);
            } else {
                jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //解禁文章或商品
    Untie(untieMsg, callback) {
        let sql;
        if (untieMsg.type == "1") {
            sql = `update notes set status=1 where nid=${untieMsg.nid};`
        } else if (untieMsg.type == "2") {
            sql = `update commodityinfo set status=1 where cid=${untieMsg.nid};`
        } else if (untieMsg.type == "3") {
            sql = `update users set status=1 where uid=${untieMsg.nid};`
        }

        this.mydb.query(sql, (err, results) => {
            let jg = { code: 1, Msg: '解禁成功！', data: [] };
            if (err) {
                jg.code = -1,
                    jg.Msg = '解禁失败！'
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

}

module.exports = NoteModel;
// 既然要对数据库的数据进行，必须要连接到数据库 
const DbBase = require('./DbBase');
const format = require('../conment/js/dateFormat/dateFormat')

class ChatModel extends DbBase {
    constructor() {
        super();
        this.table = 'chatinfo';
    }

    //保存聊天信息
    setCharInfo(charInfo, nowData, callback) {
        charInfo = JSON.parse(charInfo);
        var textinfo = JSON.stringify(charInfo.textinfo);
        var oldinfo = JSON.stringify(charInfo.oldInfo);
        let flag = (textinfo == oldinfo);//将上一次的聊天数据与这一次的比较
        flag = new Boolean(flag);//转为Boolean型
        let sql;
        if (charInfo.cid == 0 && textinfo != '[]' && charInfo.textinfo.length <= 1) {
            console.log("进1");
            //第一次有聊天信息，新建数据
            sql = `INSERT INTO chatinfo(myuid,otheruid,textinfo,lastTime,mavatar,mname,yavatar,yname) VALUES (${charInfo.myuid},${charInfo.otheruid},'${textinfo}','${nowData}','${charInfo.mavatar}','${charInfo.mname}','${charInfo.yavatar}','${charInfo.yname}');
            select * from chatinfo where (chatinfo.myuid=${charInfo.myuid} and chatinfo.otheruid=${charInfo.otheruid}) or (chatinfo.myuid=${charInfo.otheruid} and chatinfo.otheruid=${charInfo.myuid});`;
        }
        // else if (flag == true) {
        //     //已存在聊天信息且当聊天信息不变
        //     sql = `update chatinfo set myuid='${charInfo.myuid}',otheruid='${charInfo.otheruid}', mavatar='${charInfo.mavatar}',mname='${charInfo.mname}',yavatar='${charInfo.yavatar}',yname='${charInfo.yname}' where cid=0;`//这条sql不进行任何操作
        // }
        else if (!charInfo.cid) {
            console.log("进2");
            sql = `update chatinfo set myuid='${charInfo.myuid}',otheruid='${charInfo.otheruid}', textinfo='${textinfo}',lastTime='${nowData}',mavatar='${charInfo.mavatar}',mname='${charInfo.mname}',yavatar='${charInfo.yavatar}',yname='${charInfo.yname}' where myuid=${charInfo.myuid} and otheruid='${charInfo.otheruid}`
        } else {
            console.log("进3");
            //已存在聊天信息且当聊天信息改变
            sql = `update chatinfo set myuid='${charInfo.myuid}',otheruid='${charInfo.otheruid}', textinfo='${textinfo}',lastTime='${nowData}',mavatar='${charInfo.mavatar}',mname='${charInfo.mname}',yavatar='${charInfo.yavatar}',yname='${charInfo.yname}' where cid=${charInfo.cid};`
        }
        this.mydb.query(sql, (err, results) => {
            let jg = {
                code: '',
                Msg: ''
            };
            if (err) {
                jg.code = -1,
                    jg.Msg = '发送失败！';
                console.log(err);
            } else {
                jg.code = 1,
                    jg.Msg = '发送成功！',
                    jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });
    }


    //获取聊天信息
    getChatInfo(chatinfos, callback) {
        let sql = `SELECT * FROM ${this.table} WHERE (chatinfo.myuid=${chatinfos.myuid} and chatinfo.otheruid=${chatinfos.otheruid}) or (chatinfo.myuid=${chatinfos.otheruid} and chatinfo.otheruid=${chatinfos.myuid}) group by cid;`;
        this.mydb.query(sql, (err, results) => {
            let jg = {
                code: '',
                Msg: '',
                data: []
            };
            if (err) {
                jg.code = -1,
                    jg.Msg = '获取聊天信息失败！'
                console.log(err);
            } else {
                jg.code = 1,
                    jg.Msg = '获取聊天信息成功！';
                jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        })
    }

    //获取关注人信息
    getInfos(uid, callback) {
        let sql = `SELECT * FROM follow WHERE suid=${uid} group by followtime desc;`;
        this.mydb.query(sql, (err, results) => {
            let jg = {
                code: '',
                Msg: '',
                data: []
            };
            if (err) {
                jg.code = -1,
                    jg.Msg = '获取关注人信息失败！'
                console.log(err);
            } else {
                jg.code = 1,
                    jg.Msg = '获取关注人信息成功！';
                jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        })
    }

    //获取聊天列表
    getChatList(uid, callback) {
        let sql = `SELECT * FROM chatinfo WHERE myuid=${uid} or otheruid=${uid} group by lastTime desc;`;
        this.mydb.query(sql, (err, results) => {
            let jg = {
                code: '',
                Msg: '',
                data: []
            };
            if (err) {
                jg.code = -1,
                    jg.Msg = '获取聊天列表失败！'
                console.log(err);
            } else {
                jg.code = 1,
                    jg.Msg = '获取聊天列表成功！';
                jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        })
    }
}

module.exports = ChatModel;

// 既然要对数据库的数据进行，必须要连接到数据库 
const DbBase = require('./DbBase');
const format = require('../conment/js/dateFormat/dateFormat')

class UserModel extends DbBase {
    constructor() {
        super();
        this.table = 'users';
    }

    //根据uid查询用户
    getUserInfo(uid, callback) {
        let sql = `SELECT * FROM ${this.table} WHERE users.uid = ? LIMIt 1;`;
        this.mydb.query(sql, [uid], (err, results) => {
            let jg = {
                code: '',
                Msg: '',
                data: []
            };
            if (err) {
                jg.code = -1,
                    jg.Msg = '查询用户信息失败！'
                console.log(err);
            } else {
                jg.code = 1,
                    jg.Msg = '查询用户信息成功！';
                jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //查询登录用户信息
    getUserByUid(kwd, callback) {
        let sql = `SELECT * FROM ${this.table} WHERE users.uid = ? or users.username=? LIMIt 1;`;
        this.mydb.query(sql, [kwd, kwd], (err, results) => {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                if (results.length != 0) {
                    results[0].regtimes = format.dateFormat("YYYY-mm-dd HH:MM:SS", results[0].regtimes);
                    results[0].lastlogin = format.dateFormat("YYYY-mm-dd HH:MM:SS", results[0].lastlogin);
                }
                callback(results);
            }
            this.mydb.end();
        });
    }

    //注册之前检查用户名是否已存在
    testingUsername(username, callback) {
        let sql = `SELECT * FROM ${this.table} WHERE username = ? group by uid;`;
        this.mydb.query(sql, [username], (err, results) => {
            let jg = {
                code: '',
                Msg: '',
                data: []
            };
            if (err) {
                jg.code = -1,
                    jg.Msg = '检测用户名合法性失败！'
                console.log(err);
            } else {
                jg.code = 1,
                    jg.Msg = '检测通过！';
                jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        })
    }

    //注册用户
    registerUser(userinfo, callback) {
        let fieldstr = '',
            field = '';
        let data = [];
        let isFirst = true;
        for (const f in userinfo) {
            if (userinfo.hasOwnProperty(f)) {
                fieldstr += (isFirst ? '' : ', ') + f; //组装字段  也可以组装成数组 最后JOIN
                field += (isFirst ? '' : ', ') + '?'; //组装字段
                data.push(userinfo[f]); //组装字段对应的值
            }
            isFirst = false;
        }
        let sql = `INSERT INTO ${this.table}(${fieldstr}) VALUES (${field}) `;
        this.mydb.query(sql, data, (err, results) => {
            let jg = {
                code: '',
                Msg: ''
            };
            if (err) {
                jg.code = -1,
                    jg.Msg = '注册失败！'
                console.log(err);
            } else {
                jg.code = 1,
                    jg.Msg = '注册成功！';
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //依靠用户名登录,记录登录时间和增加登录次数
    getUserByUsername(username, callback) {
        let lastlogin = format.dateFormat("YYYY-mm-dd HH:MM:SS", new Date());
        let sql = `SELECT * FROM ${this.table} WHERE username = ? and status=1 LIMIt 1;
        SELECT * FROM sessions WHERE 1;
        update users set nums=nums+1,lastlogin=? where users.username = ?;`;
        this.mydb.query(sql, [username, lastlogin, username], (err, results) => {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                if (results[0].length != 0) {
                    results[0][0].regtimes = format.dateFormat("YYYY-mm-dd HH:MM:SS", results[0][0].regtimes);
                    results[0][0].lastlogin = format.dateFormat("YYYY-mm-dd HH:MM:SS", results[0][0].lastlogin);
                }
                callback(results);
            }
            this.mydb.end();
        });
    }
    //获取session表的信息
    getSession(callback) {
        let sql = `select * from sessions where 1`;
        this.mydb.query(sql, (err, results) => {
            let jg = {
                code: '',
                Msg: ''
            };
            if (err) {
                jg.code = -1,
                    jg.Msg = '获取session信息失败！';
                console.log(err);
            } else {
                jg.code = 1,
                    jg.Msg = '获取session信息成功！',
                    jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //退出登录
    signOut(thisdata, callback) {
        thisdata=thisdata.toString();
    console.log("thisdata:",thisdata)
        let sql = `delete from sessions where session_id='${thisdata}'`;
        this.mydb.query(sql, (err, results) => {
            let jg = {
                code: '',
                Msg: ''
            };
            if (err) {
                jg.code = -1,
                    jg.Msg = '退出失败！';
                console.log(err);
            } else {
                jg.code = 1,
                    jg.Msg = '退出成功！',
                    jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //编辑个人信息
    updataUserInfo(userinfo, callback) {
        let fieldstr = '',
            field = '';
        let data = [];
        let isFirst = true;
        for (const f in userinfo) {
            if (userinfo.hasOwnProperty(f)) {
                fieldstr += (isFirst ? '' : ', ') + f; //组装字段  也可以组装成数组 最后JOIN
                field += (isFirst ? '' : ', ') + '?'; //组装字段
                data.push(userinfo[f]); //组装字段对应的值
            }
            isFirst = false;
        }
        let sql = `update ${this.table} set users.avatar=?,users.username=?,users.gender=?,users.synopsis=?,users.birthday=?,users.work=?,users.area=?,users.email=?,users.tel=? where uid=?`;
        this.mydb.query(sql, data, (err, results) => {
            let jg = {
                code: 1,
                Msg: '保存成功！'
            };
            if (err) {
                jg.code = -1,
                    jg.Msg = '保存失败！'
                console.log(err);
            }
            callback(jg);
            this.mydb.end();
        });
    }

}

module.exports = UserModel;
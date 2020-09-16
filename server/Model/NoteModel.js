// 既然要对数据库的数据进行，必须要连接到数据库 
const DbBase = require('./DbBase');
class NoteModel extends DbBase {
    constructor() {
        super();
        this.table = 'notes';
    }

    //获取所有的笔记
    getNotes(callback) {
        let sql = `select notes.*, users.username,users.avatar from notes,users where notes.status=1 and users.uid=notes.uid group by notes.releasetime desc;`;
        this.mydb.query(sql, (err, results) => {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                callback(results);
            }
            this.mydb.end();
        });
    }

    //获取所有笔记种类
    getTypes(callback) {
        let sql = `select types.* from types where 1;`;
        this.mydb.query(sql, (err, results) => {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                callback(results);
            }
            this.mydb.end();
        });
    }

    //根据用户id来查找笔记
    getNotesByUid(data, callback) {
        let sql;
        if (data.flag == '2') {
            sql = `SELECT a.username ,a.uid,b.username,b.avatar,notes.*,collectionnotes.collectiontime FROM users a INNER JOIN collectionnotes ON a.uid = collectionnotes.uid INNER JOIN notes on collectionnotes.nid = notes.nid LEFT JOIN users b ON b.uid = notes.uid WHERE a.uid = ${data.uid} and notes.status=1 group by collectionnotes.collectiontime desc`;
        } else if (data.flag == '3') {
            sql = `SELECT a.username ,a.uid,b.username,b.avatar,notes.*,supportnotes.supportTimes  FROM users a INNER JOIN supportnotes ON a.uid = supportnotes.uid INNER JOIN notes on supportnotes.nid = notes.nid LEFT JOIN users b ON b.uid = notes.uid WHERE a.uid = ${data.uid} and notes.status=1 group by supportnotes.supportTimes desc`
        } else {
            sql = `SELECT notes.*,users.username,users.avatar FROM notes,users WHERE notes.uid = users.uid and notes.uid =${data.uid} and notes.status=1 group by notes.releasetime desc`;
        }
        this.mydb.query(sql, [data.uid, data.uid], (err, results) => {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                callback(results);
            }
            this.mydb.end();
        });
    }

    // 根据关键字获取笔记
    getNotesByKey(keyw, callback) {
        let sql = `
        select notes.*, users.username,users.avatar from notes,users where notes.status=1 and users.uid=notes.uid and (category like CONCAT('%',?,'%')  or title like CONCAT('%',?,'%') or keywords like CONCAT('%',?,'%') or info like CONCAT('%',?,'%') or uname like CONCAT('%',?,'%') or users.position=?) group by notes.releasetime desc
        `;
        //当查询全部笔记时
        if (keyw == "全部") {
            sql = `select notes.*, users.username,users.avatar from notes,users where notes.status=1 and users.uid=notes.uid group by notes.releasetime desc;`;
        }
        this.mydb.query(sql, [keyw, keyw, keyw, keyw, keyw, keyw], (err, results) => {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                callback(results);
            }
            this.mydb.end();
        });
    }

    // 根据笔记id来获取笔记详情和作者信息
    getAllByNid(nid, callback) {
        let sql = `select notes.*, users.username,users.avatar,users.synopsis from notes,users where notes.status=1 and users.uid=notes.uid and nid=? group by nid`;
        this.mydb.query(sql, [nid], (err, results) => {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                callback(results);
            }
            this.mydb.end();
        });
    }

    //根据nid获取一个笔记的详情
    getNotesByNid(nid, callback) {
        let sql = `SELECT * FROM notes WHERE notes.status=1 and uid  = any(SELECT uid FROM notes WHERE nid = ?);
        SELECT * FROM users WHERE uid  = any(SELECT uid FROM notes WHERE nid = ?);
        SELECT * FROM notes WHERE notes.status=1 and nid = ?;
        SELECT * FROM comments WHERE nid =? && pid = 0;
        SELECT * FROM comments WHERE pid = 0;
        SELECT * FROM users WHERE uid = any(SELECT uid FROM comments WHERE nid = ?);`;
        this.mydb.query(sql, [nid, nid, nid, nid, nid], (err, results) => {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                callback(results);
            }
            this.mydb.end();
        });
    }

    //改变文章赞的数量
    support(supports, nid, callback) {
        let sql = `UPDATE ${this.table} SET support =?  WHERE nid=?;
        SELECT support FROM notes WHERE nid = ?;
        UPDATE users SET support = support+1 WHERE uid = (SELECT uid FROM notes WHERE nid = ?) `;
        this.mydb.query(sql, [supports, nid, nid], (err, results) => {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                callback(results);
            }
            this.mydb.end();
        });
    }

    //改变文章收藏的数量
    collection(collection, nid, callback) {
        let sql = `UPDATE ${this.table} SET collection =?  WHERE nid=?;
        SELECT collection FROM notes WHERE nid = ?; `;
        this.mydb.query(sql, [collection, nid, nid], (err, results) => {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                callback(results);
            }
            this.mydb.end();
        });
    }

    // 查询加载评论
    getCommentsByNid(nid, callback) {
        let sql = `select users.username,users.avatar,users.uid,comments.* from comments,users where comments.nid=? and comments.uid=users.uid group by comments.comtimes desc`;
        this.mydb.query(sql, [nid], (err, results) => {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                callback(results);
            }
            this.mydb.end();
        });
    }

    //查询更多评论
    getMoreComments(data, callback) {
        // 多表联查（多对多）
        let sql = `select comments.* from comments where comments.nid=? and comments.fcid=? group by cid;
        select users.uid,users.username from users where users.uid in ( select uid from comments where comments.nid=? and comments.fcid=? group by cid);
        `;
        this.mydb.query(sql, [data.nid, data.cid, data.nid, data.cid], (err, results) => {
            let jg = { code: '', Msg: '', data: [] };
            if (err) {
                jg.code = -1,
                    jg.Msg = '查询失败！'
                console.log(err);
            } else {
                jg.code = 1,
                    jg.Msg = '查询成功！';
                jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //查询当前登录用户所有支持过的评论
    getSuppportComments(uid, callback) {
        let sql = `select supportcomments.* from supportcomments where uid=? group by cid;`;
        this.mydb.query(sql, [uid], (err, results) => {
            let jg = { code: '', Msg: '', data: [] };
            if (err) {
                jg.code = -1,
                    jg.Msg = '查询失败！'
                console.log(err);
            } else {
                jg.code = 1,
                    jg.Msg = '查询成功！';
                jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //增加评论
    addComments(userinfo, callback) {
        let thiscid = 0;
        if (userinfo.fcid) {
            thiscid = userinfo.fcid;
        }
        let fieldstr = '', field = '';
        let data = [];
        let isFirst = true;
        for (const f in userinfo) {
            if (userinfo.hasOwnProperty(f)) {
                fieldstr += (isFirst ? '' : ', ') + f;    //组装字段  也可以组装成数组 最后JOIN
                field += (isFirst ? '' : ', ') + '?';         //组装字段
                data.push(userinfo[f]);                 //组装字段对应的值
            }
            isFirst = false;
        }
        let sql = `INSERT INTO comments (${fieldstr}) VALUES (${field});
        UPDATE comments SET sonflag =1  WHERE cid=${thiscid};`;
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

    //发表笔记
    addNote(noteinfo, callback) {
        let fieldstr = '', field = '';
        let data = [];
        let isFirst = true;
        for (const f in noteinfo) {
            if (noteinfo.hasOwnProperty(f)) {
                fieldstr += (isFirst ? '' : ', ') + f;    //组装字段  也可以组装成数组 最后JOIN
                field += (isFirst ? '' : ', ') + '?';         //组装字段
                data.push(noteinfo[f]);                 //组装字段对应的值
            }
            isFirst = false;
        }
        let sql = `INSERT INTO notes (${fieldstr}) VALUES (${field}); `;
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

    //点赞笔记
    supportNote(supportInfo, callback) {
        let fieldstr = '', field = '';
        let data = [];
        let isFirst = true;
        for (const f in supportInfo) {
            if (supportInfo.hasOwnProperty(f)) {
                fieldstr += (isFirst ? '' : ', ') + f;    //组装字段  也可以组装成数组 最后JOIN
                field += (isFirst ? '' : ', ') + '?';         //组装字段
                data.push(supportInfo[f]);                 //组装字段对应的值
            }
            isFirst = false;
        }
        let sql = `INSERT INTO supportnotes (${fieldstr}) VALUES (${field});
        update users set support=support+1 where uid = ${supportInfo.nuid};
        update notes set support=support+1 where nid = ${supportInfo.nid};`;
        this.mydb.query(sql, data, (err, results) => {
            let jg = { code: 1, Msg: '点赞成功！' };
            if (err) {
                jg.code = -1,
                    jg.Msg = '点赞失败！'
                console.log(err);
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //取消点赞笔记
    cancelSupport(data, callback) {
        let sql = `DELETE FROM supportnotes WHERE nid = ? and uid=?;
        update users set support=support-1 where uid = ?;
        update notes set support=support-1 where nid =?;`;
        this.mydb.query(sql, [data.nid, data.uid, data.nuid, data.nid], (err, results) => {
            let jg = { code: 1, Msg: '已取消点赞' };
            if (err) {
                jg.code = -1,
                    jg.Msg = '取消点赞失败！'
                console.log(err);
            }
            callback(jg);
            this.mydb.end();
        });
    }


    //收藏笔记
    collectionNote(collectionInfo, callback) {
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
        let sql = `INSERT INTO collectionnotes (${fieldstr}) VALUES (${field});
        update users set collection=collection+1 where uid = ${collectionInfo.uid};
        update notes set collection=collection+1 where nid = ${collectionInfo.nid};`;
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
    cancelCollection(data, callback) {
        let sql = `DELETE FROM collectionnotes WHERE nid = ? and uid=?;
        update users set collection=collection-1 where uid = ?;
        update notes set collection=collection-1 where nid = ?;`;
        this.mydb.query(sql, [data.nid, data.uid, data.uid, data.nid], (err, results) => {
            let jg = { code: 1, Msg: '已取消收藏' };
            if (err) {
                jg.code = -1,
                    jg.Msg = '取消收藏失败！'
                console.log(err);
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //关注
    Follow(followInfo, callback) {
        let fieldstr = '', field = '';
        let data = [];
        let isFirst = true;
        for (const f in followInfo) {
            if (followInfo.hasOwnProperty(f)) {
                fieldstr += (isFirst ? '' : ', ') + f;    //组装字段  也可以组装成数组 最后JOIN
                field += (isFirst ? '' : ', ') + '?';         //组装字段
                data.push(followInfo[f]);                 //组装字段对应的值
            }
            isFirst = false;
        }
        let sql = `INSERT INTO follow (${fieldstr}) VALUES (${field});
        update users set fans=fans+1 where uid = ${followInfo.fuid};
        update users set follow=follow+1 where uid = ${followInfo.suid};`;
        this.mydb.query(sql, data, (err, results) => {
            let jg = { code: 1, Msg: '关注成功！' };
            if (err) {
                jg.code = -1,
                    jg.Msg = '关注失败！'
                console.log(err);
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //取消关注
    cancelFollow(data, callback) {
        let sql = `DELETE FROM follow WHERE fuid = ? and suid=?;
        update users set fans=fans-1 where uid = ?;
        update users set follow=follow-1 where uid = ?;`;//update FROM set fuid=fid-1 where fid>=@xid
        this.mydb.query(sql, [data.fuid, data.suid, data.fuid, data.suid], (err, results) => {
            let jg = { code: 1, Msg: '已取消关注' };
            if (err) {
                jg.code = -1,
                    jg.Msg = '取消关注失败！'
                console.log(err);
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //检测 是否已点赞/关注/收藏
    Testing(data, callback) {
        let sql = `SELECT collectionnotes.* FROM collectionnotes WHERE nid = ? and uid= ?;
        SELECT follow.* FROM follow WHERE fuid = ? and suid= ?;
        SELECT supportnotes.* FROM supportnotes WHERE nid = ? and uid= ?;`;
        this.mydb.query(sql, [data.nid, data.uid, data.nuid, data.uid, data.nid, data.uid,], (err, results) => {
            let jg = { code: 1, Msg: '点赞/关注/收藏查询成功！', data: [] };
            if (err) {
                jg.code = -1,
                    jg.Msg = '点赞/关注/收藏查询失败！'
                console.log(err);
            } else {
                jg.data = results;
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //删除笔记
    Delete(nid, callback) {
        let sql = `delete from notes where nid=?`;
        this.mydb.query(sql, [nid], (err, results) => {
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

    //点赞评论
    supportComments(supportInfo, callback) {
        let fieldstr = '', field = '';
        let data = [];
        let isFirst = true;
        for (const f in supportInfo) {
            if (supportInfo.hasOwnProperty(f)) {
                fieldstr += (isFirst ? '' : ', ') + f;    //组装字段  也可以组装成数组 最后JOIN
                field += (isFirst ? '' : ', ') + '?';         //组装字段
                data.push(supportInfo[f]);                 //组装字段对应的值
            }
            isFirst = false;
        }
        let sql = `INSERT INTO supportcomments (${fieldstr}) VALUES (${field});
        update users set support=support+1 where uid = ${supportInfo.cuid};
        update comments set support=support+1 where cid = ${supportInfo.cid};`;
        this.mydb.query(sql, data, (err, results) => {
            let jg = { code: 1, Msg: '点赞成功！' };
            if (err) {
                jg.code = -1,
                    jg.Msg = '点赞失败！'
                console.log(err);
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //取消点赞评论
    cancelSptComments(data, callback) {
        let sql = `DELETE FROM supportcomments WHERE cid = ? and uid=?;
        update users set support=support-1 where uid = ?;
        update comments set support=support-1 where cid = ?;`;
        this.mydb.query(sql, [data.cid, data.uid, data.cuid, data.cid], (err, results) => {
            let jg = { code: 1, Msg: '已取消点赞' };
            if (err) {
                jg.code = -1,
                    jg.Msg = '取消点赞失败！'
                console.log(err);
            }
            callback(jg);
            this.mydb.end();
        });
    }

    //投诉举报
    reportInfo(reportInfo, callback) {
        let fieldstr = '', field = '';
        let data = [];
        let isFirst = true;
        for (const f in reportInfo) {
            if (reportInfo.hasOwnProperty(f)) {
                fieldstr += (isFirst ? '' : ', ') + f;    //组装字段  也可以组装成数组 最后JOIN
                field += (isFirst ? '' : ', ') + '?';         //组装字段
                data.push(reportInfo[f]);                 //组装字段对应的值
            }
            isFirst = false;
        }
        let sql = `INSERT INTO reportInfo (${fieldstr}) VALUES (${field});`;
        this.mydb.query(sql, data, (err, results) => {
            let jg = { code: 1, Msg: '投诉成功！' };
            if (err) {
                jg.code = -1,
                    jg.Msg = '投诉失败！'
                console.log(err);
            }
            callback(jg);
            this.mydb.end();
        });
    }

}

module.exports = NoteModel;
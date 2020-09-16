const express = require('express');
const UserModel = require('../Model/UserModel');
const router = express.Router();
const format = require('../conment/js/dateFormat/dateFormat')
const CryptoJS = require('crypto-js');

router.get("/loginInfo", (req, res) => {
    // 判断是否登录
    if (!req.session.uid || !req.session.username) {
        res.json({ code: -100, Msg: '请先登录' });
    } else {
        res.json({ code: 100, Msg: '已登录' });
    }
})

//根据用户uid获取信息
router.get('/getuserinfo', (req, res) => {
    let userModel = new UserModel();
    let otheruid = req.query.otherUid;
    userModel.getUserInfo(otheruid, (results) => {
        res.json(results);
    })
})


// 获取一个用户详情信息(同时检测是否登录)
router.get('/userinfo', (req, res) => {
    let userModel = new UserModel();
    var keywd = req.query.uid;
    userModel.getUserByUid(keywd, (results) => {
        let ob = {
            code: 1,
            Msg: '数据查询成功！',
            data: []
        };
        if (results.length == 0) {
            ob.code = -1;
            ob.Msg = '数据库数据不存在此用户，请重新登录！';
        } else {
            delete results[0].passwd;
        }
        ob.data = results;
        res.json(ob);
    });
});


//登录查询
router.post('/login', (req, res) => {
    let userModel = new UserModel();
    let username = req.body.username;
    //解密
    let passwdV = CryptoJS.AES.decrypt(req.body.password, 'mypasswd123');
    let mypasswd = passwdV.toString(CryptoJS.enc.Utf8);
    userModel.getUserByUsername(username, (results) => {
        let ob = {
            code: 1,
            Msg: '登录成功'
        };
        if (results[0].length == 0) {
            ob = {
                code: -1,
                Msg: '用户不存在'
            };
        } else if (results[0][0].passwd != mypasswd) {
            ob = {
                code: 0,
                Msg: '密码错误'
            };
        } else {
            // 登录成功  记录session,将查出的user信息存入session
            let sessionFlag = true;
            for (let i = 0; i < results[1].length; i++) {
                var sessiondata = JSON.parse(results[1][i].data);
                if (sessiondata.uid == results[0][0].uid) {//检查session表中是否已存在登录信息
                    sessionFlag = false;
                    break;
                }
            }
            if (sessionFlag) {//session表中没有登陆人信息就存一份
                for (var key in results[0][0]) {
                    req.session[key] = results[0][0][key];
                }
            }
            ob.userInfo = results[0][0];
            delete ob.userInfo.passwd;//将密码删除
            // req.session.username = username;//将用户名存入session表中
        }
        res.json(ob);
    });
});

//注册之前检查用户名是否已存在
router.get('/testingUsername', (req, res) => {
    let userModel = new UserModel();
    userModel.testingUsername(req.query.username, (results) => {
        res.json(results);
    });
})



//注册添加用户
router.post('/register', (req, res) => {
    // 需要对数据进行操作  Model 
    let userModel = new UserModel();
    let registerInfo = req.body.registerInfo;
    //密码解密
    let passwdC = CryptoJS.AES.decrypt(registerInfo.passwd, 'mypasswd123');
    registerInfo.passwd = passwdC.toString(CryptoJS.enc.Utf8);
    registerInfo.regtimes = format.dateFormat("YYYY-mm-dd HH:MM:SS", new Date())//记录注册时间
    registerInfo.lastlogin = format.dateFormat("YYYY-mm-dd HH:MM:SS", new Date())//记录登录时间
    registerInfo.nums = 1;//记录登录次数
    //默认登录头像
    registerInfo.avatar = 'http://localhost:88/uploads/1584550045623_026464.png';
    userModel.registerUser(registerInfo, (results) => {
        if (results.code == 1) {
            // 注册成功  记录session,将查出的user信息存入session
            for (var key in registerInfo) {
                req.session[key] = registerInfo[key];
            }
        }
        res.json(results);
    });
});

//退出登录
router.get('/signOut', (req, res) => {
    let userModel = new UserModel();
    userModel.signOut(req.query.thisdata, (results) => {
        res.json(results);
    });
});

//获取session表中信息
router.get('/getsession', (req, res) => {
    let userModel = new UserModel();
    var myuid = req.query.uid;
    userModel.getSession((results) => {
        if (results.code == 1) {
            var flagg = true;
            for (let i = 0; i < results.data.length; i++) {
                var sessiondata = JSON.parse(results.data[i].data);
                if (sessiondata.uid == myuid) {//检查session表中是否已存在登录信息
                    flagg=false;
                    let obj = {
                        code: 1,
                        Msg: '获取sessionId成功！',
                        data: results.data[i].session_id
                    };
                    res.json(obj);
                    break;
                }
            }
            if (flagg) {
                res.json(results);
            }
        } else {
            res.json(results);
        }
    });
});


//编辑用户信息
router.post('/updatauserinfo', (req, res) => {
    // 需要对数据进行操作  Model 
    let userModel = new UserModel();
    let userinfo = req.body.userinfo;
    userModel.updataUserInfo(userinfo, (results) => {
        if (results.code == 1) {
            // 编辑成功  更新session中的数据
            for (var key in userinfo) {
                req.session[key] = userinfo[key];
            }
        }
        res.json(results);
    });
});

//获取session
router.use(require('./session').session);
router.get('/getsession', (req, res) => {
    res.json(req.session);
});

module.exports = router;
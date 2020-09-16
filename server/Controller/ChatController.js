const express = require('express');
const ChatModel = require('../Model/ChatModel');
const router = express.Router();
const format = require('../conment/js/dateFormat/dateFormat')
var ws = require("nodejs-websocket");

var gws;
var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 8001 });
var AllUserData = new Array();
wss.on('connection', function (ws) {
    gws = ws;
    ws.on('message', function (message) {
        var guodu = message;
        var thiscid = JSON.parse(guodu).cid;
        let Temp = JSON.parse(message);
        if (CheckIsNew(Temp)) {
            AllUserData.push({
                'id': Temp.myuid,
                'ws': ws
            });
            // console.log("才来:")
        } else {
            console.log("已加入:"+message);
            let date = new Date();
            let nowData = format.dateFormat("YYYY-mm-dd HH:MM:SS", date)//获取当前时间
            let chatModel = new ChatModel();
            chatModel.setCharInfo(message,nowData, (results) => {
                for (var i = 0; i < AllUserData.length; i++) {
                    if (Temp.otheruid == AllUserData[i]['id']) {
                        if (results.code == 1 && thiscid != 0) {
                            let myobj = {
                                code: 2,
                                Msg: '发送成功！',
                                data: message
                            };
                            myobj = JSON.stringify(myobj);
                            // console.log("第二条以后数据反参:");
                            AllUserData[i]['ws'].send(myobj);
                        } else {
                            results = JSON.stringify(results);
                            // console.log("第一条数据反参");
                            AllUserData[i]['ws'].send(results);
                        }
                        break;
                    }
                }
            });
        }
    });
});

//将新上线的用户信息存储起来
function CheckIsNew(Temp) {
    for (var i = 0; i < AllUserData.length; i++) {
        if (Temp.myuid == AllUserData[i]['id']) {
            return false;
        }
    }
    return true;
}

//获取关注人列表
router.get('/getInfos', (req, res) => {
    // 需要对数据进行操作  Model
    let chatModel = new ChatModel();
    chatModel.getInfos(req.query.uid, (results) => {
        res.json(results);
    });
});

//获取聊天列表
router.get('/getChatList', (req, res) => {
    // 需要对数据进行操作  Model
    let chatModel = new ChatModel();
    chatModel.getChatList(req.query.uid, (results) => {
        if(results.code==1){
            for(let i=0,num=results.data.length;i<num;i++){
                let obj=JSON.parse(results.data[i].textinfo);
                results.data[i].lastTime=format.dateFormat("YYYY-mm-dd HH:MM", results.data[i].lastTime);//拿取最后聊天时间
                if(obj.length!=0){
                    results.data[i].chatInfo=obj[obj.length-1].text;//拿取聊天信息最后一条
                }
            }
        }
        res.json(results);
    });
});


//获取聊天信息
router.post('/getchatInfo', (req, res) => {
    // 需要对数据进行操作  Model
    let chatModel = new ChatModel();
    chatModel.getChatInfo(req.body, (results) => {
        res.json(results);
    });
});


module.exports = router;

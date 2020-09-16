const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// 跨域处理
app.use(require('./Tools/cors').cors);
// 启用cookie和session
app.use(require('./author').cookie);
app.use(require('./author').session);
// app.get('/ww', (req, res) => {
//     console.log(req.cookies);
//     console.log(req.cookies);
//     res.cookie('username', 'dddd');
//     // console.log();
//     res.send('cookiesss');
// })

//parse content-type   application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//content-type   application/json
app.use(bodyParser.json());

// 启用子路由-用户模块
app.use('/user', require('./Controller/UserController'));//用户信息
app.use('/note', require('./Controller/NoteController'));//笔记信息
app.use('/news', require('./Controller/NewsController'));//新闻
app.use('/chat', require('./Controller/ChatController'));//聊天
app.use('/shopping', require('./Controller/ShoppingController'));//购物商城
app.use('/administrators', require('./Controller/AdminController'));//管理员
app.use('/business', require('./Controller/BusinessController'));//商家
app.use('/upload', require('./Controller/UploadController'));//图片文件上传
app.use('/uploads',express.static("./uploads"));//静态资源托管

app.listen(88, () => {
    console.log('Example app listening on port 88!');
});

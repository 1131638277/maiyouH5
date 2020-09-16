exports.cors = (req, res, next)=>{
    // http://localhost:8080
    // http://192.168.43.73:8080
    //http://192.168.1.4:8080/
    res.header("Access-Control-Allow-Origin", "http://localhost:8080"); //允许的域名不能使用*
    res.header("Access-Control-Allow-Headers", "content-type,X-Requested-With");
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("Access-Control-Allow-Credentials",true); //带cookies
    // 表示路由继续往下匹配
    next();
}
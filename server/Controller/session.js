exports.session = function(req, res, next){
    if(!req.session.uid || !req.session.username){
        res.json({ code: -100, Msg: '请登录' });
        return ;
    }else{
        console.log(req.session.uid);
        next();
    }
}


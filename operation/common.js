require('../global');

var init = function (req, res, cb) {
    if(mySession[req.body.sessionId]){
        cb();
    }else{
        res.json({
            status: -3000,
            msg: '登陆失效'
        })
    }
}

module.exports = init;
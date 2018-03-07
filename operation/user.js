const db = require('../db/basic')
const request = require('request')
require('../global')

function User(req,res,next){
    this.req = req;
    this.res = res;
    console.log('init')
    // this.user = req.session.user;
}

User.prototype.sendCode = function () {
    let data = this.req.body;
    console.log(data);
    this.res.send('2333');
}
User.prototype.setPhone = function () {
    let data = this.req.body;
    console.log(data)
    console.log(data)
    console.log(mySession[data.sessionId])
    this.res.json({
        status: 1,
        msg: '手机号录入成功'
    })
}
User.prototype.setWxCode = function () {
    let data = this.req.body;
    var self = this;
    console.log(data);
    var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=wx59c05e76cbc960a7&secret=214c3a0ce6ed2068935991bef066cce8&js_code=' + data.code + '&grant_type=authorization_code';
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            console.log(body) // 请求成功的处理逻辑
            db(function(con){
                var sql = 'select * from user where openid = \'' + body.openid + '\''
                con.query(sql, (err,result) => {
                    if(err) throw err;
                    if(result.length !== 0){
                        console.log('用户已录入');
                        //生成sessionId
                        var sessionId = 'sessionId=' + Date.parse(new Date()) + parseInt(999*Math.random());
                        mySession[sessionId] = result[0].id;

                        self.res.json({
                            status: 2,
                            data: {
                                'sessionId' : sessionId
                            },
                            msg: '用户已录入'
                        })
                    }else{
                        var date = Date.parse(new Date());
                        sql = 'insert into user (username, head, openid, createAt) values(\'' + data.nickName + '\', \'' + data.head + '\', \'' + body.openid + '\', \'' + date + '\');'
                        con.query(sql, (err,result) => {
                            if(err) throw err;
                            console.log('用户录入成功');
                            //生成sessionId
                            var sessionId = 'sessionId=' + Date.parse(new Date()) + parseInt(999*Math.random());
                            mySession[sessionId] = result.insertid;
                            //自动生成默认手账本
                            sql = 'insert into note (title, user, createAt) values(\'默认手账本\', \'' + result.insertid + '\', \'' + date + '\')'
                            con.query(sql, (err, result) => {
                                if(err) throw err;
                                console.log('生成默认手账成功');
                                self.res.json({
                                    status: 1,
                                    data: {
                                        'sessionId' : sessionId
                                    },
                                    msg: '用户录入成功'
                                })
                            })
                        })
                    }
                });
            },'Tips')
        }
    })
}

module.exports = User;
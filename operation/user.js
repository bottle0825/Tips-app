const db = require('../db/basic')
const request = require('request')
const check = require('./common')
const async = require('async')
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
            db((con) => {
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
                            console.log(result);
                            mySession[sessionId] = result.insertId;
                            //自动生成默认手账本
                            sql = 'insert into note (title, user, createAt) values(\'默认手账本\', \'' + result.insertId + '\', \'' + date + '\')'
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

User.prototype.following = function () {
    check(this.req, this.res, () => {
        let data = this.req.body;
        // console.log(data)
        var id = mySession[data.sessionId];
        db(con => {
            var sql = 'insert into following (user, other) values(\''+ id +'\', \''+ data.id +'\');'
            con.query(sql, (err, result) => {
                if(err) console.log(err);
                console.log('插入关注成功')
                sql = 'insert into follower (user, other) values(\''+ data.id +'\', \''+ id +'\');'
                con.query(sql, (err, result) => {
                    if(err) console.log(err);
                    console.log('插入被关注成功')
                    this.res.json({
                        status: 1,
                        msg: '关注成功'
                    })
                })
            })
        },'Tips')
    })
}

User.prototype.unfollow = function () {
    check(this.req, this.res, () => {
        let data = this.req.body;
        // console.log(data)
        var id = mySession[data.sessionId];
        db(con => {
            var sql = 'delete from following where user=\'' + id + '\' and other=\'' + data.id + '\' ;'
            con.query(sql, (err, result) => {
                if(err) console.log(err);
                console.log('删除关注成功')
                sql = 'delete from follower where user=\'' + data.id + '\' and other=\'' + id + '\' ;'
                con.query(sql, (err, result) => {
                    if(err) console.log(err);
                    console.log('删除被关注成功')
                    this.res.json({
                        status: 1,
                        msg: '取消关注成功'
                    })
                })
            })
        },'Tips')
    })
}

User.prototype.getFollowing = function () {
    check(this.req, this.res, () => {
        let data = this.req.body;
        let reqData = {
            status: 1,
            msg: '查询成功',
            data: []
        }
        var id = mySession[data.sessionId];
        db(con => {
            var sql = 'select other from following where user=\'' + id + '\' ;'
            con.query(sql, (err, result) => {
            if(err) console.log(err);
            console.log(result)
                if(result.length != 0){
                    async.each(result,(following,callback) => {
                        console.log('-----------+++++')
                        console.log(following);
                        sql = 'select * from user where id=\'' + following.other + '\';'
                        con.query(sql, (err, result) => {
                            if(err) console.log(err);
                            console.log('-----------')
                            console.log(result)
                            console.log('查找关注信息成功')
                            var addNote = {
                                id: result[0].id,
                                username: result[0].username,
                                head: result[0].head,
                            }
                            reqData.data.push(addNote);
                            callback();
                        })
                    },(err) => {
                        if(err){
                          console.log('读取失败');
                        }else{
                          console.log('关注全部读取成功');
                          this.res.send(reqData);
                        }
                    });
                } else {
                    this.res.send({
                        status: 0,
                        msg: '你还没有关注用户～'
                    });
                }
            })
        },'Tips')
    })
}

User.prototype.getFollower = function () {
    check(this.req, this.res, () => {
        let data = this.req.body;
        let reqData = {
            status: 1,
            msg: '查询成功',
            data: []
        }
        var id = mySession[data.sessionId];
        db(con => {
            var sql = 'select other from follower where user=\'' + id + '\' ;'
            con.query(sql, (err, result) => {
            if(err) console.log(err);
                if(result.length != 0){
                    async.each(result,(follower,callback) => {
                        sql = 'select * from user where id=\'' + follower.other + '\';'
                        con.query(sql, (err, result) => {
                            if(err) console.log(err);
                            console.log('查找关注信息成功');
                            var newRes = result[0];
                            sql = 'select id from following where other=\'' + newRes.id + '\';'
                            con.query(sql, (err, result) => {
                                var flag = false;
                                if(result.length != 0){
                                    flag = true;
                                }
                                var addNote = {
                                    id: newRes.id,
                                    username: newRes.username,
                                    head: newRes.head,
                                    follow: flag
                                }
                                reqData.data.push(addNote);
                                callback();
                            })
                        })
                    },(err) => {
                        if(err){
                          console.log('读取失败');
                        }else{
                          console.log('关注全部读取成功');
                          this.res.send(reqData);
                        }
                    });
                } else {
                    this.res.send({
                        status: 0,
                        msg: '你还没有粉丝～'
                    });
                }
            })
        },'Tips')
    })
}
module.exports = User;
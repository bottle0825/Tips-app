const db = require('../db/basic')
require('../global')
const check = require('./common')
const async = require('async');

function Account(req,res,next){
    this.req = req;
    this.res = res;
    console.log('init')
    // this.user = req.session.user;
}

Account.prototype.add = function () {
    let data = this.req.body;
    check(this.req, this.res, () => {
        var id = mySession[data.sessionId];
        var date = Date.parse(new Date());
        db(con => {
            var sql = 'insert into record (user, in_out, money, type, createAt) values(\'' + id + '\',\''+ data.in_out +'\',\''+ (data.money*100) +'\',  \''+ data.type +'\', \'' + date + '\');'
            con.query(sql,(err, result) => {
                if(err) throw err;
                console.log('插入成功')
                this.res.json({
                    status: 1,
                    msg: '记录插入成功'
                })
            })
        },'Tips')
    })
}
Account.prototype.getDayMsg = function () {
    let data = this.req.body;
    check(this.req, this.res, () => {
        let reqData = {
            status: 1,
            msg: '查询成功',
            data: {
                dayIn: 0,
                dayOut: 0,
                list: []
            }
        }
        var id = mySession[data.sessionId];
        db(con => {
            var sql = 'select * from record where user = \'' + id + '\' order by createAt desc;';
            con.query(sql,(err, result) => {
                if(err) throw err;
                var date = new Date();
                dayflag = date.getDate();
                async.each(result,(accountmsg,callback) => {
                    var ddate = new Date(accountmsg.createAt);
                    day = ddate.getDate();
                    if(day == dayflag){
                        newdaylist = {
                            in_out: accountmsg.in_out,
                            type: accountmsg.type,
                            money: (accountmsg.money/100),
                        }
                        reqData.data.list.push(newdaylist)
                        if(accountmsg.in_out == 1){
                            reqData.data.dayIn += (accountmsg.money/100);
                        } else {
                            reqData.data.dayOut += (accountmsg.money/100);
                        }
                    }
                    callback();
                },(err) => {
                    if(err){
                      console.log('读取失败');
                    }else{
                      console.log('daylist读取成功');
                      this.res.send(reqData);
                    }
                });
            })
        },'Tips')
    })
}

module.exports = Account;
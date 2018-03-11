const db = require('../db/basic')
require('../global')
const check = require('./common')
const async = require('async');

function Basket(req,res,next){
    this.req = req;
    this.res = res;
    console.log('init')
    // this.user = req.session.user;
}

Basket.prototype.getMsg = function () {
    let data = this.req.body;
    check(this.req, this.res, () => {
        let reqData = {
            status: 1,
            msg: '查询成功',
            data: []
        }
        var id = mySession[data.sessionId];
        db(con => {
            var sql = 'select * from waste where user = \'' + id + '\' order by wasteAt desc;';
            con.query(sql,(err, result) => {
                if(err) throw err;
                console.log('查询成功')
                async.each(result,(wasteMsg,callback) => {
                    var ddate = new Date(wasteMsg.createAt)
                    var addNote = {
                        id: wasteMsg.id,
                        oldId: wasteMsg.oldId,
                        title: wasteMsg.title,
                        img: wasteMsg.img,
                        date: ddate.getFullYear() + '/' + ddate.getMonth() + '/' + ddate.getDate(),
                    }
                    reqData.data.push(addNote);
                    callback();
                },(err) => {
                    if(err){
                      console.log('读取失败');
                    }else{
                      console.log('废纸篓全部读取成功');
                      this.res.send(reqData);
                    }
                });
            })
        },'Tips')
    })
}

Basket.prototype.recover = function () {
    let data = this.req.body;
    var id = mySession[data.sessionId];
    var date = Date.parse(new Date());
    check(this.req, this.res, () => {
        db(con => {
            var sql = 'select * from waste where id=\'' + data.id + '\';';
            con.query(sql, (err, result) => {
                console.log('查询成功')
                if(err) throw err;
                var resData = result[0];
                sql = 'insert into tip (id, title, note, img, address, createAt) values(\'' + data.oldId + '\', \'' + resData.title + '\', \'' + resData.note + '\', \'' + resData.img + '\', \'' + resData.address + '\', \'' + resData.createAt + '\');'
                con.query(sql, (err, result) => {
                    console.log('插入成功')
                    if(err) throw err;
                    sql = 'delete from waste where id = \'' + data.id + '\';'
                    con.query(sql, (err, result) => {
                        console.log('删除成功')
                        if(err) throw err;
                        this.res.json({
                            status: 1,
                            msg: '手账恢复成功'
                        })
                    })
                })
            })
        },'Tips')
    })
}

Basket.prototype.delete = function () {
    let data = this.req.body;
    var id = mySession[data.sessionId];
    var date = Date.parse(new Date());
    check(this.req, this.res, () => {
        db(con => {
            var sql = 'delete from waste where id = \'' + data.id + '\';'
            con.query(sql, (err, result) => {
                console.log('删除成功')
                if(err) throw err;
                this.res.json({
                    status: 1,
                    msg: '手账永久删除成功恢复成功'
                })
            })
        },'Tips')
    })
}

module.exports = Basket;
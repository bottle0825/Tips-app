const db = require('../db/basic')
require('../global')
const check = require('./common')
const async = require('async');

function Note(req,res,next){
    this.req = req;
    this.res = res;
    console.log('init')
    // this.user = req.session.user;
}

Note.prototype.getMsg = function () {
    let data = this.req.body;
    check(this.req, this.res, () => {
        let reqData = {
            status: 1,
            msg: '查询成功',
            data: []
        }
        var id = mySession[data.sessionId];
        db(con => {
            var sql = 'select * from note where user = \'' + id + '\';';
            con.query(sql,(err, result) => {
                if(err) throw err;
                async.each(result,(notemsg,callback) => {
                    var addNote = {
                        id: notemsg.id,
                        title: notemsg.title,
                    }
                    sql = 'select count(*) from tip where note = \'' + notemsg.id + '\';';
                    con.query(sql,(err, result) => {
                        if(err) throw err;
                        console.log('手账'+notemsg.id+'查询成功')
                        console.log(result)
                        addNote.count = result[0]['count(*)'];
                        reqData.data.push(addNote);
                        callback();
                    })
                },(err) => {
                    if(err){
                      console.log('读取失败');
                    }else{
                      console.log('手账全部读取成功');
                      this.res.send(reqData);
                    }
                });
            })
        },'Tips')
    })
}

Note.prototype.create = function () {
    let data = this.req.body;
    var id = mySession[data.sessionId];
    var date = Date.parse(new Date());
    check(this.req, this.res, () => {
        db(con => {
            var sql = 'insert into note (title, user, createAt) values(\''+ data.title +'\', \'' + id + '\', \'' + date + '\');'
            con.query(sql, (err, result) => {
                if(err) throw err;
                this.res.json({
                    status: 1,
                    msg: '手账本新建成功'
                })
            })
        },'Tips')
    })
}

Note.prototype.delete = function () {
    let data = this.req.body;
    var id = mySession[data.sessionId];
    check(this.req, this.res, () => {
        db(con => {
            var sql = 'delete from note where user = \'' + id + '\' and id = \'' + data.id + '\';'
            con.query(sql, (err, result) => {
                if(err) throw err;
                sql = 'delete from tip where note = \'' + data.id + '\';'
                con.query(sql, (err, result) => {
                    if(err) throw err;
                    this.res.json({
                        status: 1,
                        msg: '手账本删除成功'
                    })
                })
            })
        },'Tips')
    })
}
module.exports = Note;
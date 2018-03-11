const db = require('../db/basic')
require('../global')
const check = require('./common')
const async = require('async')
const fs = require('fs')

function Said(req,res,next){
    this.req = req;
    this.res = res;
    console.log('init')
    // this.user = req.session.user;
}

Said.prototype.getMsg = function () {
    let data = this.req.body;
    check(this.req, this.res, () => {
        let reqData = {
            status: 1,
            msg: '查询成功',
            data: []
        }
        var id = mySession[data.sessionId];
        db(con => {
            var sql = 'select * from said order by createAt desc;';
            con.query(sql,(err, result) => {
                if(err) throw err;
                console.log(result)
                async.each(result,(tipsmsg,callback) => {
                    sql = 'select * from user where id=\'' + tipsmsg.user + '\';' 
                    con.query(sql, (err, result) => {
                        var ddate = new Date(tipsmsg.createAt);
                        timeD = ddate.getFullYear() + '.' + (ddate.getMonth() + 1) + '.' + ddate.getDate();
                        timeT = ddate.getHours() + ':' + ddate.getMinutes();
                        var addNote = {
                            id: tipsmsg.id,
                            user: tipsmsg.user,
                            nickname: result[0].username,
                            head: result[0].head,
                            detail: tipsmsg.detail,
                            img: tipsmsg.img,
                            date: timeD,
                            time: timeT,
                        }
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

Said.prototype.getMsgOther = function () {
    let data = this.req.body;
    check(this.req, this.res, () => {
        let reqData = {
            status: 1,
            msg: '查询成功',
            data: {
                username: '',
                head: '',
                followFlag: false,
                list: []
            }
        }
        var id = mySession[data.sessionId];
        db(con => {
            var sql = 'select * from user where id=\'' + data.id + '\';' 
            con.query(sql, (err, result) => {
                reqData.data.username = result[0].username;
                reqData.data.head = result[0].head;
                sql = 'select * from following where user=\'' + id + '\' and other=\'' + data.id + '\';'
                con.query(sql, (err,result) => {
                    if(err) throw err;
                    if(result.length != 0){
                        reqData.data.followFlag = true;
                    }
                    sql = 'select * from said where user=\'' + data.id + '\' order by createAt desc;';
                    con.query(sql,(err, result) => {
                        if(err) throw err;
                        async.each(result,(tipsmsg,callback) => {
                            var ddate = new Date(tipsmsg.createAt);
                            timeD = ddate.getFullYear() + '.' + (ddate.getMonth()+1) + '.' + ddate.getDate();
                            timeT = ddate.getHours() + ':' + ddate.getMinutes();
                            var addNote = {
                                id: tipsmsg.id,
                                user: tipsmsg.user,
                                detail: tipsmsg.detail,
                                img: tipsmsg.img,
                                date: timeD,
                                time: timeT,
                            }
                            reqData.data.list.push(addNote);
                            callback();
                        },(err) => {
                            if(err){
                            console.log('读取失败');
                            }else{
                            console.log('手账全部读取成功');
                            this.res.send(reqData);
                            }
                        });
                    })  
                })    
            })
            
        },'Tips')
    })
}

Said.prototype.create = function () {
    check(this.req, this.res, () => {
        let data = this.req.body;
        // console.log(data)
        var id = mySession[data.sessionId];
        var date = Date.parse(new Date());
        console.log(date);
        var name = this.req.file.path;
        var houzhui = this.req.file.originalname.split('.');
        houzhui = houzhui[houzhui.length - 1];
        newPath = name + '.' +  houzhui;
        newName = newPath.split('/');
        fs.rename(name, newPath, err => {
            console.log('文件名修改成功')
            db(con => {
                var sql = 'insert into said (user, img, detail, createAt) values(\''+ id +'\',\''+ newName +'\',\'' + data.detail + '\', \'' + date + '\');'
                con.query(sql, (err, result) => {
                    if(err) console.log(err);
                    console.log('说说新建成功')
                    this.res.json('success')
                })
            },'Tips')
        });
        
    })
}

Said.prototype.delete = function () {
    let data = this.req.body;
    var id = mySession[data.sessionId];
    var date = Date.parse(new Date());
    check(this.req, this.res, () => {
        db(con => {
            var sql = 'select * from tip where id=\'' + data.id + '\';';
            con.query(sql, (err, result) => {
                console.log('查询成功')
                if(err) throw err;
                var resData = result[0];
                sql = 'insert into waste (oldId, title, note, img, address, createAt, wasteAt, user) values(\'' + resData.id + '\', \'' + resData.title + '\', \'' + resData.note + '\', \'' + resData.img + '\', \'' + resData.address + '\', \'' + resData.createAt + '\', \'' + date + '\', \'' + id + '\');'
                con.query(sql, (err, result) => {
                    console.log('插入成功')
                    if(err) throw err;
                    sql = 'delete from tip where note = \'' + data.note + '\' and id = \'' + data.id + '\';'
                    con.query(sql, (err, result) => {
                        console.log('删除成功')
                        if(err) throw err;
                        this.res.json({
                            status: 1,
                            msg: '手账删除成功'
                        })
                    })
                })
            })
        },'Tips')
    })
}
module.exports = Said;
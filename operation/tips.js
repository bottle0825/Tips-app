const db = require('../db/basic')
require('../global')
const check = require('./common')
const async = require('async')
const fs = require('fs')

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
            var sql = 'select * from tip where note = \'' + data.id + '\' order by createAt desc;';
            con.query(sql,(err, result) => {
                if(err) throw err;
                async.each(result,(tipsmsg,callback) => {
                    var ddate = new Date(tipsmsg.createAt);
                    time = ddate.getFullYear() + '/' + (ddate.getMonth()+1) + '/' + ddate.getDate();
                    var addNote = {
                        id: tipsmsg.id,
                        title: tipsmsg.title,
                        date: time,
                        img: tipsmsg.img
                    }
                    reqData.data.push(addNote);
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
        },'Tips')
    })
}

Note.prototype.getDetail = function () {
    let data = this.req.body;
    check(this.req, this.res, () => {
        let reqData = {
            status: 1,
            msg: '查询成功',
            data: []
        }
        var id = mySession[data.sessionId];
        db(con => {
            var sql = 'select * from tip where id = \'' + data.id + '\';';
            con.query(sql,(err, result) => {
                if(err) throw err;
                var ddate = new Date(result[0].createAt);
                var addNote = {
                    id: result[0].id,
                    title: result[0].title,
                    content: result[0].content,
                    date: ddate.getFullYear() + '.' + (ddate.getMonth()+1) + '.' + ddate.getDate(),
                    time: ddate.getHours() + ':' + ddate.getMinutes(),
                    img: result[0].img,
                    address: result[0].address,
                }
                reqData.data = addNote;
                console.log(reqData);
                this.res.json(reqData)
            })
        },'Tips')
    })
}

Note.prototype.create = function () {
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
        newName = newPath.split('/')[1];
        fs.rename(name, newPath, err => {
            console.log('文件名修改成功')
            db(con => {
                var sql = 'insert into tip (title, note, img, content, address, createAt) values(\''+ data.title +'\', \''+ data.note +'\',\''+ newName +'\',\'' + data.content + '\', \'' + data.address + '\', \'' + date + '\');'
                con.query(sql, (err, result) => {
                    if(err) console.log(err);
                    console.log('手账新建成功')
                    this.res.json('success')
                })
            },'Tips')
        });
        
    })
}

// Note.prototype.edit = function () {
//     check(this.req, this.res, () => {
//         let data = this.req.body;
//         // console.log(data)
//         var id = mySession[data.sessionId];
//         var date = Date.parse(new Date());
//         console.log(date);
//         var name = this.req.file.path;
//         var houzhui = this.req.file.originalname.split('.');
//         houzhui = houzhui[houzhui.length - 1];
//         newPath = name + '.' +  houzhui;
//         newName = newPath.split('/');
//         fs.rename(name, newPath, err => {
//             console.log('文件名修改成功')
//             db(con => {
//                 var sql = 'insert into tip (title, note, img, address, createAt) values(\''+ data.title +'\', \''+ data.note +'\',\''+ newName +'\', \'' + data.address + '\', \'' + date + '\');'
//                 con.query(sql, (err, result) => {
//                     if(err) console.log(err);
//                     console.log('手账新建成功')
//                     this.res.json('success')
//                 })
//             },'Tips')
//         });
        
//     })
// }

Note.prototype.delete = function () {
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
module.exports = Note;
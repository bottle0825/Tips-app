const db = require('../db/basic')
require('../global')
const check = require('./common')
const async = require('async');

function Word(req,res,next){
    this.req = req;
    this.res = res;
    console.log('init')
    // this.user = req.session.user;
}

Word.prototype.add = function () {
    let data = this.req.body;
    check(this.req, this.res, () => {
        var id = mySession[data.sessionId];
        var date = Date.parse(new Date());
        db(con => {
            var sql = 'insert into word (user, chinese, english, type, status) values(\'' + id + '\',\''+ data.chinese +'\',\''+ data.english +'\',  \''+ data.type +'\',0);'
            con.query(sql,(err, result) => {
                if(err) throw err;
                console.log('插入成功')
                this.res.json({
                    status: 1,
                    msg: '单词插入成功'
                })
            })
        },'Tips')
    })
}
Word.prototype.getMsg = function () {
    let data = this.req.body;
    check(this.req, this.res, () => {
        let reqData = {
            status: 1,
            msg: '查询成功',
            data: {
                wordlist: [],
                sentencelist: [],
            }
        }
        var id = mySession[data.sessionId];
        db(con => {
            var sql = 'select * from word where user = \'' + id + '\' order by status;';
            con.query(sql,(err, result) => {
                if(err) throw err;
                async.each(result,(wordtmsg,callback) => {
                    console.log(wordtmsg.type)
                    if(wordtmsg.type == 0){
                        newWordList = {
                            id: wordtmsg.id,
                            english: wordtmsg.english,
                            chinese: wordtmsg.chinese,
                            status: wordtmsg.status
                        }
                        reqData.data.wordlist.push(newWordList)
                    } else {
                        newSentenceList = {
                            id: wordtmsg.id,
                            english: wordtmsg.english,
                            chinese: wordtmsg.chinese,
                            status: wordtmsg.status
                        }
                        reqData.data.sentencelist.push(newSentenceList)
                    }
                    callback();
                },(err) => {
                    if(err){
                      console.log('读取失败');
                    }else{
                      console.log('word读取成功');
                      this.res.send(reqData);
                    }
                });
            })
        },'Tips')
    })
}

Word.prototype.changeStatus = function () {
    let data = this.req.body;
    check(this.req, this.res, () => {
        var id = mySession[data.sessionId];
        var date = Date.parse(new Date());
        db(con => {
            var sql = 'update word set status = 1 where id = \'' + data.id + '\';'
            con.query(sql,(err, result) => {
                if(err) throw err;
                console.log('更新成功')
                this.res.json({
                    status: 1,
                    msg: '单词状态更新成功'
                })
            })
        },'Tips')
    })
}
module.exports = Word;
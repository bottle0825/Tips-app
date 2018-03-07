const db = require('../db/basic')
require('../global')

function Note(req,res,next){
    this.req = req;
    this.res = res;
    console.log('init')
    // this.user = req.session.user;
}

Note.prototype.getMsg = function () {
    let data = this.req.body;
    let reqData = {
        status: 1,
        msg: '查询成功',
        data: []
    }
    console.log(mySession[data.sessionId]);
    if(mySession[data.sessionId]){
        var id = mySession[data.sessionId];
        db(con => {
            var sql = 'select * from note where user = \'' + id + '\';';
            con.query(sql,(err, result) => {
                if(err) throw err;
                for(let i = 0;i < result.length;i ++){
                    reqData.data[i] = {
                        id: result[i].id,
                        title: result[i].title,
                    }
                    sql = 'select count(*) from tip where note = \'' + result[i].id + '\';';
                    con.query(sql,(err, result) => {
                        if(err) throw err;
                        reqData.data[i].count = result[i]['count(*)'];
                        this.res.json(reqData);
                    })
                }
            })
        },'Tips')
    }
}

Note.prototype.create = function () {
    let data = this.req.body;
    
}

module.exports = Note;
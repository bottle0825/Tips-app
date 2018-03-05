const db = require('../db/basic')

function User(req,res,next){
    this.req = req;
    this.res = res;
    this.user = req.session.user;
}

User.prototype.sendCode = function () {
    let data = this.req.body;
    console.log(data);
    this.res.send('2333');
}
User.prototype.setPhone = function () {
    let data = this.req.body;
    console.log()
}
User.prototype.setWxCode = function () {
    let data = this.req.body;
    console.log()
}
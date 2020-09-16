//引入数据库操作模块
const mysql = require('mysql');
class DbBase{
    constructor(){
        this.mydb = mysql.createConnection(require('../Config/dbConfig'));
        this.mydb.connect();
    }
    end(){
        this.mydb.end();
    }
}
module.exports = DbBase;
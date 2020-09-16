// 既然要对数据库的数据进行，必须要连接到数据库 
const DbBase = require('./DbBase');
class NewsModel extends DbBase {
    constructor() {
        super();
        this.table = 'news';
    }

    //获取所有的笔记
    getNews(callback) {
        let sql = `SELECT * FROM ${this.table} WHERE 1  LIMIT 0,5`;
        this.mydb.query(sql, (err, results) => {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                callback(results);
            }
            this.mydb.end();
        });
    }
}
module.exports = NewsModel;

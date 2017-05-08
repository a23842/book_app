//引入express
const express = require('express');
//实例化
const app = express();

//引入art-template模版引擎
var template = require('art-template');
template.config('base', '');
template.config('extname', '.html');
app.engine('.html', template.__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use('/static', express.static('./views'));

//引入mongoose
const db = require('mongoose');
//连接MongoDB数据库
db.connect('mongodb://localhost/DDBook');
//创建数据库集合
// var Schema = db.Schema;

var bookSchema = db.Schema({
    name: String,
    author: String,
    link: String,
    publisher: String,
    price: Number,
    type: String
});
//模块映射
var Book = db.model('Book', bookSchema);



app.use(express.static('./public'));
//获取存储当前所有页面数量的数组
function getPages(current, total) {
    var pages = [current];
    var left = current - 1;
    var right = current + 1;
    while (pages.length < 11 && (left > 0 || right <= total)) {
        if (left>0) {
            pages.unshift(left--);
        }
        if (right <= total) {
            pages.push(right++);
        }
    }
    return pages;
}

//书籍列表路由
app.get('/list/:page?',(req,res)=>{
    var currentPage = 1;
    if(req.params.page){
        currentPage = req.params.page*1;
    }
    //定义存储总页数
    var totalPage = 0;
    //每一页展示的书籍数
    var perPage = 10;
   Book.count({},function(err,total){
    totalPage = Math.ceil(total/perPage);
    //获取存储页面的数组
    var pages = getPages(currentPage,totalPage); 
    Book.find({},function(err,data){
        if(err){
            console.log(err);
        }else{
            res.render('list',{books:data,cPage:currentPage,totalPage:totalPage,pages:pages});
        }
    })
   }) .limit(10).skip(currentPage*10);
});



app.get('/api/v1/book_data/:page', (req, res) => {
    //获取页数
    var currentPage = req.params.page * 1;
    //分页查询
    Book.find({}, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.json({ status: 200, books: data, page: currentPage + 1 });
        }
    }).limit(10).skip(currentPage * 10);//限制显示条数
});

app.listen(3000, () => {
    console.log('Service running at port 3000.....')
});
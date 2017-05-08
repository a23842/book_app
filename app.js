//引入express
const express = require('express');
//实例化
const app = express();

//引入art-template模版引擎
var	template	=	require('art-template');
template.config('base','');
template.config('extname','.html');
app.engine('.html',template.__express);
app.set('view engine','html');
app.set('views',__dirname + '/views');
app.use('/static',express.static('./views'));

//引入mongoose
const db = require('mongoose');
//连接MongoDB数据库
db.connect('mongodb://localhost/DDBook');
//创建数据库集合
// var Schema = db.Schema;

var bookSchema = db.Schema({
    name: String,
    image: String,
    author: String,
    link: String,
    publisher: String,
    price: Number,
    type: String
});
//模块映射
var Book = db.model('Book',bookSchema);



app.use(express.static('./public'));
//书籍列表路由
app.get('/list',(req,res)=>{
    res.render('list');
})
app.get('/api/v1/book_data/:page',(req,res)=>{
    //获取页数
    var currentPage = req.params.page * 1;
    //分页查询
    Book.find({},function(err,data){
        if(err){
            console.log(err);
        }else{
            res.json({status:200,books:data,page:currentPage+1});
        }
    }).limit(10).skip(currentPage*10);//限制显示条数
});

app.listen(3000,()=>{
    console.log('Service running at port 3000.....')
});
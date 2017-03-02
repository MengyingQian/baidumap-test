'use strict'

var express = require("express");
var bodyParser = require('body-parser');
var tt = require('./lib/DBOperation');
//var cmd = require('./lib/cmdOperation');
var matlab = require('./lib/MATLAB');
var query = require('./lib/querySet');
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public'));
//运行mongodb数据库
//cmd.startDB();

//初始页面
app.get('/',function(req,res){
	res.setHeader('Cache-Control','max-age=5');
//	res.setHeader('Last-Modified','Thu, 12 Jan 2017 08:32:32 GMT');
	res.sendFile(__dirname+"/views/map_rectangle.html");
});
//屏蔽错误请求
app.get('/favicon.ico',function(req,res){
	res.end();
});
//属性查询
app.post('/attrQuery',function(req,res){
	tt.attrQuery(req.body.refer,req.body.props||[])
	.then(function(data){res.send(data);console.log('send');})
	.catch(function (reason) {res.end();console.log('失败：' + reason);})
	.finally(function(){res.end();console.log('finally');});
});

//资源利用率处理
app.post('/resourceRate',function(req,res){
	tt.attrQuery(req.body.refer,req.body.props||[])
	.then(matlab.MATLAB_rate)
	.then(function(data){res.send(data);console.log('send');})
	.catch(function (reason) {res.end();console.log('失败：' + reason);})
	.finally(function(){res.end();console.log('finally');});
});
//干扰分析处理
app.post('/interference',function(req,res){
	tt.attrQuery(req.body.refer,req.body.props||[])
	.then(function(data){
		//console.log(data[0]["业务时间"]);
		return query.NIBS(data,req.body.refer_2,data.length-1)
		.then(function(data1){
			return  {
						station1 : data,
						station2 : data1
					};
		})
	})
	.then(matlab.MATLAB_interference)
	.then(function(data){res.send(data);console.log('send');})
	.catch(function (reason) {res.end();console.log('失败：' + reason);})
	.finally(function(){res.end();console.log('finally');});
});
//热力图请求
app.post('/hotMap',function(req,res){
	tt.attrQuery(req.body.refer,req.body.props||[])
	.then(function(data){
		return query.NBS(data,req.body.searchBox);
	})
	.then(matlab.MATLAB_hotMap)
	.then(function(data){res.send(data);console.log('send');})
	.catch(function (reason) {res.end();console.log('失败：' + reason);})
	.finally(function(){res.end();console.log('finally');});
});
//网络布局请求
app.post('/layout',function(req,res){
	tt.attrQuery(req.body.refer,req.body.props||[])
	.then(function(data){
		//console.log(data[0]);
		return query.NIBS(data,req.body.refer_2,data.length-1)
		.then(function(data1){
			return  {
						station1 : data,
						station2 : data1
					};
		})
	})
	.then(matlab.MATLAB_layout)
	.then(function(data){res.send(data);console.log('send');})
	.catch(function (reason) {res.end();console.log('失败：' + reason);})
	.finally(function(){res.end();console.log('finally');});
});
//聚合查询请求
app.post('/aggregate',function(req,res){
	tt.aggrQuery(req.body)
	.then(function(data){res.send(data);console.log('send');})
	.catch(function (reason) {res.end();console.log('失败：' + reason);})
	.finally(function(){res.end();console.log('finally');});
});
//发送请求页面
app.get('/:fileName',function(req,res){
	res.sendFile(__dirname+'/views/'+req.params.fileName+'.html');
});

//捕捉系统异常，防止错误引发宕机
/*process.on('uncaughtException', function(e) {
　　console.log('uncaughtException'+e);
});*/
//错误处理
app.use(function(err, req, res, next) {  
    console.error(err.stack);  
    res.status(404).send('Resource Not Found!');  
    res.status(500).send('System Error!');  
    next();  
});
//监听8080端口
app.listen(8080, function(){
    console.log("Express server listening 8080");
});
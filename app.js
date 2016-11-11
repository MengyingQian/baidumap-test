'use strict'

var express = require("express");
var bodyParser = require('body-parser');
var tt = require('./lib/DBOperation');
//var cmd = require('./lib/cmdOperation');
var matlab = require('./lib/MATLAB');
var query = require('./lib/querySet');
var EventEmitter = require('events').EventEmitter;  
var ee = new EventEmitter();
//var routes = require('./routes');
var path = require('path');
var app = express();

//定义发送文件扩展名
app.engine('.html', require('ejs').__express);  
app.set('view engine', 'html'); 
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));
ee.setMaxListeners(20);//最大监听数目设置，0代表无穷
//运行mongodb数据库
//cmd.startDB();

//初始页面
app.get('/',function(req,res){
	res.render("BS_basic_data",{"layout":false});
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
//空间查询
/*app.post('/drawQuery',function(req,res){
	tt.drawQuery(req.body.refer,req.body.props||{})
	.then(function(data){res.send(data);console.log('send');})
	.finally(function(){console.log('finally');});
});*/
//邻域查询
/*app.post('/nearQuery',function(req,res){
	tt.nearQuery(req.body)
	.then(function(data){res.send(data);console.log('send');})
	.finally(function(){console.log('finally');});
});*/
//发送请求页面
app.get('/:fileName',function(req,res){
	res.sendFile(__dirname+'/views/'+req.params.fileName+'.html');
});

//监听8080端口
app.listen(8080, function(){
    console.log("Express server listening 8080");
});
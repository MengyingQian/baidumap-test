'use strict'
var tt = require('./DBOperation');

//near interference base station
//递归大法好
function NIBS(data1,condition,i){
	var refer={
		'运营商类型':condition["运营商类型"],
		'制式类型':condition["制式类型"],
		'业务时间':condition["业务时间"],
		"对象标识" : {'$ne':data1[i]['对象标识']},
		"geom.coordinates":{//临近点查询
			$near:data1[i].geom.coordinates,//坐标数组
			spherical:true,
			distanceMultiplier: 6378137,
			//maxDistance:5000/6378137//最大查找范围
		},
	};
	if(condition['载波频点(MHz)']){
		refer['载波频点(MHz)'] = {
			"$gt":data1[i]['载波频点(MHz)']-500,
			"$lt":data1[i]['载波频点(MHz)']+500
		};
	}
	//console.log(refer);
	//查询数目限制只能使用nearquery
	return tt.nearQuery(refer,[],parseInt(condition.number))
		.then(function(data){
			//console.log(i);
			if(i-- == 0){//递归结束条件
				return [data];
			}
			return NIBS(data1,condition,i)
				.then(function(nextData){
					return [].concat(nextData,[data]);//合并递归内容，注意前后两者之间的顺序
				});
		});
};

//near base station
function NBS(points,condition,i){
//	console.log(i);
	var refer={
		'运营商类型':condition["运营商类型"],
		'制式类型':condition["制式类型"],
		'业务时间':condition["业务时间"],
		"geom.coordinates":{//临近点查询
			$near:points[i],//坐标数组
			spherical:true,
			//distanceMultiplier: 6378137,
			$maxDistance:1/111.12//一度是约111.12公里
		},
	};
	//查询数目限制只能使用nearquery
	return tt.nearQuery(refer,[],1)
		.then(function(data){
			//console.log(data instanceof Array);
			if(i-- == 0){//递归结束条件
				return [data];
			}
			return NBS(points,condition,i)
				.then(function(nextData){
					return [].concat(nextData,[data]);//合并递归内容,注意前后两者之间的顺序
				});
		});
};

module.exports = {
	NIBS:NIBS,
	NBS : NBS
};



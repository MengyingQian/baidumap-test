'use strict'
var tt = require('./DBOperation');
var q = require('q');

//near interference base station
//递归大法好
function NIBS(data1,condition,i){
	//console.log("邻近查询"+i);
	var refer={
		'运营商类型':condition["运营商类型"],
		'制式类型':condition["制式类型"],
		'业务时间':data1[i]["业务时间"],
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
			i++;
			//console.log(data instanceof Array);
			if(i == data1.length){//递归结束条件
				return [data];
			}
			return NIBS(data1,condition,i)
				.then(function(nextData){
					return [].concat([data],nextData);//合并递归内容
				});
		});
};

//near base station
function NBS(point,min,startLng,endPoint,refer){
	//console.log("邻近查询"+i);
	refer["geom.coordinates"]={//临近点查询
			$near:point,//坐标数组
			spherical:true,
			distanceMultiplier: 6378137,
			//maxDistance:5000/6378137//最大查找范围
		};
	//console.log('1  '+startLng+'  '+point);
	//查询数目限制只能使用nearquery
	return tt.nearQuery(refer,[],1)
		.then(function(data){
			point[0] = point[0]+min[0];
			//console.log(data instanceof Array);
			if(point[0]>endPoint[0]){
				point[0] = startLng;
				if(point[1]>endPoint[1])//递归结束条件
					return [data];
				else point[1] = point[1] + min[1];
			}
			//console.log(point);
			return NBS(point,min,startLng,endPoint,refer)
				.then(function(nextData){
					return [].concat([data],nextData);//合并递归内容
				});
		});
};

module.exports = {
//	NIBS:NIBS
	NIBS : NIBS,
	NBS : NBS
};



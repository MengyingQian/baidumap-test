 function hotMap_2(){
 	var t1 = new Date().getTime();
	var corporation = $("#corporation").val();//目标运营商类型
	var system = $("#system").val();//目标制式类型	
	var bs = map.getBounds();   //获取可视区域
	var bssw = bs.getSouthWest();   //可视区域左下角
	var bsne = bs.getNorthEast();   //可视区域右上角
/*	var minLng = 0.0117;//每公里经纬度变化量
	var minLat = 0.009;*/
	var startLng = bssw.lng;
	var startLat = bssw.lat;
	var endLng = bsne.lng;
	var endLat = bsne.lat;
	var n1 = 100;//经度轴方格数
	var n2 = 100;//纬度轴方格数
	var minLng = parseFloat(bs.toSpan().lng/n1);//网格经度変化
	var minLat = parseFloat(bs.toSpan().lat/n2);//网格纬度变化
	var numLng = Math.ceil(0.0117/minLng);//向上取整
	var numLat = Math.ceil(0.009/minLat);
	//查询条件设置
	var condition = {
		refer:{
			'运营商类型':corporation,
			'制式类型':system,
			//'业务类型':systemData.service,//暂无数据
			'业务时间':{"$gt":Maxtime.split('-')[0],"$lt":Maxtime.split('-')[1]},
			searchBox:[startLng,startLat,endLng,endLat]
		},
		props : []
	};
	//获取全部台站点
	getdata('/attrQuery',condition)
	.then(function(data){
		var length = data.length;
		console.log('台站数目'+length);
		var array = [];
//		var points = [];
		for(var i=0;i<n1*n2;i++){
			array.push([]);
		}
		//将台站点置于对应的栅格内
		for(var i=0;i<length;i++){
			var x = parseInt((data[i].geom.coordinates[0]-startLng)/minLng);
			var y = parseInt((data[i].geom.coordinates[1]-startLat)/minLat);
			array[x*n2+y].push(data[i]);
			//console.log(array[x*20+y]);
		}
		//生成所有的待查询点并查询
		(function(){
			for(var i=0;(lng=startLng+minLng*i)<endLng;i++){
				var points = [];
				var minX = (i-numLng<0)?0:(i-numLng);
				var maxX = (i+numLng>n1)?n1:(i+numLng);
				//console.log(i);
				for(var j=0;(lat=startLat+minLat*j)<endLat;j++){
					//console.log(j);
					var distance = 1;//初始化最远距离,单位公里
					var BSpoint = new Object();
					//查询临近基站
					var minY = (j-numLat<0)?0:(j-numLat);
					var maxY = (j+numLat>n2)?n2:(j+numLat);
					//console.log(minY+'  '+maxY);
					//计算每个点与附近基站距离
					for(var x=minX;x<maxX;x++){
						for(var y=minY;y<maxY;y++){
							//得到附近栅格内基站与给定点距离
							//console.log(x+'  '+y);
							for(var m=0;m<array[x*n2+y].length;m++){
								var newdistance = getLength(lng,lat,array[x*n2+y][m].geom.coordinates[0],array[x*n2+y][m].geom.coordinates[1]);
								//得出最近基站
								//console.log(newlength);
								if(newdistance<distance){
									distance = newdistance;
									BSpoint = array[x*n2+y][m];
									//console.log(distance);
								}
							}
						}
					}
					//计算该点接收功率
					var power = Math.ceil(Math.pow(1-distance,2)*100);
					//检查BSpoint
					points.push([lng,lat,power,BSpoint]);
				}
				createHotTangle(minLng,minLat,points);
			}
			console.log('最终长度'+points.length);
			console.log(Date.now()-t1);
		})();
	});
}
function getLength(lng1,lat1,lng2,lat2){
	var length1 = Math.abs(lng1-lng2)/0.0117;//单位公里
	var length2 = Math.abs(lat1-lat2)/0.009;
	return  Math.sqrt(Math.pow(length1,2)+ Math.pow(length2,2));
}
//闭包函数
//下一步任务，查看覆盖物类polygon
function createHotTangle(minLng,minLat,points){
	for(var i=0;i<points.length;i++){
		var color = setColor(points[i][2]);
		var rectangle = new BMap.Polygon([
			new BMap.Point(points[i][0],points[i][1]),
			new BMap.Point(points[i][0],points[i][1]+minLat),
			new BMap.Point(points[i][0]+minLng,points[i][1]+minLat),
			new BMap.Point(points[i][0]+minLng,points[i][1])
		], {strokeColor:'white', strokeWeight:0.001, strokeOpacity:0});
		//console.log(rectangle);
		rectangle.setFillOpacity(0.5);
		rectangle.setFillColor(color); 
		rectangle.addEventListener("click", function(){
			if(oldTangle) {
				oldTangle.setFillColor(oldColor);
				oldTangle.setFillOpacity(0.5);
			}
			oldTangle = this;
			oldColor = this.getFillColor();
			this.setFillColor("#00BFFF");
			this.setFillOpacity(0.1);
			//setMapTangleMessage(1);
		}); 
		rectangle.addEventListener("rightclick", function() {  
	    	this.setFillColor(oldColor);
			this.setFillOpacity(0.5);  
	    });
		map.addOverlay(rectangle);//增加矩形
		rectangle = null; //减少引用数，减少内存占用
	}
}

//由绿到红的渐变色值,百分比 value 取值 1...100  
function setColor(value){
	//最大值为100，防止过大出现错误
	if(value > 100) value = 100;
	//var 百分之一 = (单色值范围) / 50;  单颜色的变化范围只在50%之内  
    var one = (255+255) / 100;    
    var r=0;  
    var g=0;  
    var b=0;  
    if ( value < 50 ) {   
        // 比例小于50的时候红色是越来越多的,直到红色为255时(红+绿)变为黄色.  
        r = one * value;  
        g=255;  
    }  
    if ( value >= 50 ) {  
        // 比例大于50的时候绿色是越来越少的,直到0 变为纯红  
        g =  255 - ( (value - 50 ) * one) ;  
        r = 255;  
    }  
    r = parseInt(r);// 取整  
    g = parseInt(g);// 取整  
    b = parseInt(b);// 取整  
    //console.log("#"+r.toString(16,2)+g.toString(16,2)+b.toString(16,2));  
    //return "#"+r.toString(16,2)+g.toString(16,2)+b.toString(16,2);  
    //console.log("rgb("+r+","+g+","+b+")" );  
    return "rgb("+r+","+g+","+b+")";  
}
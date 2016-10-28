function hotMap(){
	var corporation = $("#corporation").val();//目标运营商类型
	var system = $("#system").val();//目标制式类型
	var corporation_2 = $("#corporation_2").val();//目标运营商类型
	var system_2 = $("#system_2").val();//目标制式类型	
	var bs = map.getBounds();   //获取可视区域
	var bssw = bs.getSouthWest();   //可视区域左下角
	var bsne = bs.getNorthEast();   //可视区域右上角
/*	var minLng = 0.0117;//每公里经纬度变化量
	var minLat = 0.009;*/
	var startLng = bssw.lng;
	var startLat = bssw.lat;
	var minLng = parseFloat(bs.toSpan().lng/50);//网格经度変化
	var minLat = parseFloat(bs.toSpan().lat/20);//网格纬度变化
	var endLng = bsne.lng;
	var endLat = startLat + minLat*2;//100个点
	//查询条件设置
	while(startLat < bsne.lat){
		var condition = {
			refer : {
				'载波频点(MHz)' : 0,//标识是否需要检测频率
				'运营商类型':corporation,
				'制式类型':system,	
				'业务时间':{"$gt":Maxtime.split('-')[0],"$lt":Maxtime.split('-')[1]},
				startGeom:[startLng,startLat],
				endGeom:[endLng,endLat],
				minGeom:[minLng,minLat],
				},				
			props : []
		};
		/*查询及后续promise操作*/
		getdata('/hotMap',condition).then(function(dbdata){createHotTangle(minLng,minLat,dbdata);});//使用闭包
		startLat = endLat;
		endLat =  startLat + minLat*2;
	}
}
//闭包函数
//下一步任务，查看覆盖物类polygon
var createHotTangle = function(minLng,minLat,points){
	for(var i=0;i<points.length;i++){
		var rectangle = new BMap.Polygon([
			new BMap.Point(points[i][0],points[i][1]),
			new BMap.Point(points[i][0],points[i][1]+minLat),
			new BMap.Point(points[i][0]+minLng,points[i][1]+minLat),
			new BMap.Point(points[i][0]+minLng,points[i][1])
		], {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});
		//console.log(rectangle);
		rectangle.setFillOpacity(0.1);
		rectangle.addEventListener("click", function(){
			if(oldTangle) {
				oldTangle.setFillColor("#FFFFFF");
				oldTangle.setFillOpacity(0.1);
			}
			oldTangle = this;
			this.setFillColor("#00BFFF");
			this.setFillOpacity(0.5);
			//setMapTangleMessage(1);
		}); 
		rectangle.addEventListener("rightclick", function() {  
	    	this.setFillColor();
			this.setFillOpacity(0.1);  
	    }); 
		map.addOverlay(rectangle);//增加矩形
		rectangle = null; //减少引用数，减少内存占用
	}
}
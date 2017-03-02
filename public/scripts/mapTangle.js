
function mapTangle(){
	var bs = map.getBounds();   //获取可视区域
	var bssw = bs.getSouthWest();   //可视区域左下角
	var bsne = bs.getNorthEast();   //可视区域右上角
	var minLng = 0.0117;//每公里经纬度变化量
	var minLat = 0.009;
	var sideLength = Number($("#sideLength").val());
	var dl = $("#dl").val()||$("#dl").attr("placeholder");//起止时间
	var tl = $("#tl").val()||$("#tl").attr("placeholder");
	var dh = $("#dh").val()||$("#dh").attr("placeholder");
	var th = $("#th").val()||$("#th").attr("placeholder");
	try{
		dl = checkDate(dl);
		dh = checkDate(dh);
		tl = checkHour(tl);
		th = checkHour(th);
	}
	catch(err){
		alert(err);
		return;
	}
	//判断时间区间是否合理
	if((dl+tl)>=(dh+th)){
		alert("业务时段设置错误，请重新设置");
		return;
	}
	var corporation = $("#corporation").val();//运营商类型
	var system = $("#system").val();//制式类型
	var service = $("#service").val();//业务类型
//	console.log(sideLength);
//	console.log(bssw.lng);
	var column = parseInt((bsne.lng-bssw.lng)/(minLng*sideLength));//列数目
	var row = parseInt((bsne.lat-bssw.lat)/(minLat*sideLength));//行数目
	console.log(row+','+column);
	if(column<1||row<1){
		alert("当前地图可视范围过小请重新选择网格大小");
		return;
	}
	if(column>10||row>5){
		alert("当前地图方格过多请重新选择网格大小");
		return;
	}
	var props = [];
	switch($("#service").val()){
		case 'all':
			props.push('LTE上行总流量(MByte)','LTE下行总流量(MByte)','语音数据(分钟)','短信数据(条数)');
			break;
		case 'voice':
			props.push('语音数据(分钟)');
			break;
		case 'note':
			props.push('短信数据(条数)');
			break;
		case 'dataTraffic':
			props.push('LTE上行总流量(MByte)','LTE下行总流量(MByte)');
			break;
	}
	//console.log($("#service").val());
	var systemData = {
		startTime : dl+' '+tl,
		endTime : dh+' '+th,
		corporation : corporation,
		system : system,
		service : service,
		props : props
	};
	for(var i=0;i<=row;i++){
		var startLat = bssw.lat+i*minLat*sideLength;
		var endLat = startLat+minLat*sideLength;
		for(var j=0;j<=column;j++){
			var startLng = bssw.lng+j*minLng*sideLength;
			var endLng = startLng+minLng*sideLength;
			createTangle(startLng,startLat,endLng,endLat,systemData);//使用闭包

		}
	}

}
//闭包函数
//下一步任务，查看覆盖物类polygon
var createTangle = function(startLng,startLat,endLng,endLat,systemData){

	var condition = {
		refer:{
			'运营商类型':systemData.corporation,
			'制式类型':systemData.system,
			//'业务类型':systemData.service,//暂无数据
			'业务时间':{"$gt":systemData.startTime,"$lt":systemData.endTime},
			searchBox:[startLng,startLat,endLng,endLat]
		},
		props : systemData.props
	};
				
	
//	debugger;
	//console.log(condition.refer);
	var dbdata;
	getdata('/attrQuery',condition)
	.then(function(data){$('.loading').hide();drawpoint(data);dbdata = data;});
	var rectangle = new BMap.Polygon([
		new BMap.Point(startLng,startLat),
		new BMap.Point(startLng,endLat),
		new BMap.Point(endLng,endLat),
		new BMap.Point(endLng,startLat)
	], {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});
	rectangle.setFillOpacity(0.1);
	rectangle.addEventListener("click", function(){
		if(oldTangle) {
			oldTangle.setFillColor("#FFFFFF");
			oldTangle.setFillOpacity(0.1);
		}
		oldTangle = this;
		this.setFillColor("#00BFFF");
		this.setFillOpacity(0.5);
		setMapTangleMessage(dbdata);
	}); 
	rectangle.addEventListener("rightclick", function() {  
    	this.setFillColor();
		this.setFillOpacity(0.1);  
    }); 
	map.addOverlay(rectangle);//增加矩形
	rectangle = null; //减少引用数，减少内存占用
}
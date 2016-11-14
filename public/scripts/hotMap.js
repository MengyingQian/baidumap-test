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
	var endLng = bsne.lng;
	var endLat = bsne.lat;
	var recLength = 80;//单位栅格边长（m）
	var minLng = 0.0000117*recLength;//单位栅格的经度跨度
	var minLat = 0.000009*recLength;//单位栅格的纬度跨度

	//查询条件设置
	var condition = {
		refer : {
			'运营商类型':corporation,
			'制式类型':system,	
			'业务时间':{"$gt":Maxtime.split('-')[0],"$lt":Maxtime.split('-')[1]},
			searchBox:[bssw.lng,bssw.lat,bsne.lng,bsne.lat]
		},	
		searchBox:{
			startPoint : [bssw.lng,bssw.lat],
			endPoint : [bsne.lng,bsne.lat],
			maxDistance : recLength
		},		
		props : []
	};
	/*查询及后续promise操作*/
	getdata('/hotMap',condition).then(function(dbdata){createHotTangle(minLng,minLat,dbdata);});//使用闭包
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
	//最大值为100，防止过大出现错误\
	value = parseInt(value);
	if(value!=0) value += 120;
	if(value > 100) value = 100; 
	if(value < 0) value = 0; 
	//console.log(value);
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
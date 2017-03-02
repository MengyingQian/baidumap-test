/*向地图添加标记点*/
function addMarker(point,myIcon){
  	var marker = new BMap.Marker(point,{icon:myIcon});
  	map.addOverlay(marker);
    //设置文字标签
  	var label = new BMap.Label(point.lng+","+point.lat,{offset:new BMap.Size(20,-10)});
	marker.setLabel(label);
}
function addReMarker(data){
    if(oldReMarker.length){
        oldReMarker.map(function(marker){map.removeOverlay(marker);})
        map.removeOverlay(oldReMarker);
        oldReMarker = [];
    } 
    for(var i=0;i<data.rePoints.length;i=i+2){
        if(data.rePoints[i]==0) break;
        var myIcon = new BMap.Icon("img/markers.png", new BMap.Size(23, 25), {  
                        offset: new BMap.Size(10, 25), // 指定定位位置  
                        imageOffset: new BMap.Size(0, 0-10*25 ) // 设置图片偏移  
                    });
        var marker = new BMap.Marker(new BMap.Point(data.rePoints[i], data.rePoints[i+1]),{icon:myIcon});
        oldReMarker.push(marker);
        map.addOverlay(marker);
        //设置文字标签
        var label = new BMap.Label(data.rePoints[i]+","+data.rePoints[i+1],{offset:new BMap.Size(20,-10)});
        marker.setLabel(label);
    }

}
//绘制六边形
function hexagon(data){
    var lng = data.geom.coordinates[0];
    var lat = data.geom.coordinates[1];
    var L = data['小区半径'];
    if(oldHexagon){
        map.removeOverlay(oldHexagon);
    } 
    var polygon = new BMap.Polygon([
    new BMap.Point(lng-0.0000117*L,lat),
    new BMap.Point(lng-0.0000117*L/2,lat+0.000009*L*Math.sqrt(3)/2),
    new BMap.Point(lng+0.0000117*L/2,lat+0.000009*L*Math.sqrt(3)/2),  
    new BMap.Point(lng+0.0000117*L,lat),

    new BMap.Point(lng+0.0000117*L/2,lat-0.000009*L*Math.sqrt(3)/2),

    new BMap.Point(lng-0.0000117*L/2,lat-0.000009*L*Math.sqrt(3)/2),

    new BMap.Point(lng-0.0000117*L,lat),
    ], {strokeColor:"red", strokeWeight:2, strokeOpacity:0.5});   //创建正六边形
    map.addOverlay(polygon);
    oldHexagon = polygon;
}
/*根据数据绘制点图*/
function drawpoint(data,callback){
//	remove_overlay();
    callback = callback||function(){};
	for (var i = 0; i < data.length; i ++) {
		createMark(data[i],callback);//闭包方法
	}
}
var createMark = function(data,callback) {  
	//设置标记样式
	var color = parseInt(data['干扰系数']/0.1)||0;
    if(color!=0) console.log(color);
	//console.log(color);
	var myIcon = new BMap.Icon("img/markers1.png", new BMap.Size(23, 25), {  
                    offset: new BMap.Size(10, 25), // 指定定位位置  
                    imageOffset: new BMap.Size(0, 0-color*25 ) // 设置图片偏移  
                }); 
    var _marker = new BMap.Marker(new BMap.Point(data.geom.coordinates[0], data.geom.coordinates[1]),{icon:myIcon});
    map.addOverlay(_marker);//添加标注  
    _marker.addEventListener("click", function(e) {  
        if(oldMarker) oldMarker.setAnimation();
		oldMarker = this;
		this.setAnimation(BMAP_ANIMATION_BOUNCE); 
        if(data['小区半径']!=undefined) hexagon(data,oldHexagon);
        callback(data);
		setPointMessage(data);
    });  
    _marker.addEventListener("rightclick", function() {  
        this.setAnimation();  
    });  
    _marker = null;  //减少引用数，减少内存占用
};
/*清除所有标记*/
function remove_overlay(){
	map.clearOverlays();        
}
  
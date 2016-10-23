/*获取公共头部*/
$.get("html/head.html ",function(data){
	$("#head").html(data);
});
/*获取公共尾部*/
$.get("html/end.html ",function(data){
	$("#end").html(data);
});

/*$('#clearAllDrawing').click(function(){
	clearAll();
	});*/
/*信息弹框关闭按钮触发*/
$('#shut').click(function(){
	$('#tabMessage').hide();
	if(oldMarker) oldMarker.setAnimation();
});

/*加载全部台站点*/
/*addLoadEvent(function(){
	getdata('/attrQuery',{search:"{}"})
	.then(function(dbdata){drawpoint(dbdata);});
});*/
/*设置信息弹框*/
addLoadEvent(setTab);
$("#getPoint").click(function(){
	map.addEventListener("click", findNearPoint);
})
function findNearPoint(e){
	//alert(e.point.lng + ", " + e.point.lat);
	var myIcon = new BMap.Icon("img/markers.png", new BMap.Size(23, 25), {  
                        offset: new BMap.Size(10, 25), // 指定定位位置  
                        imageOffset: new BMap.Size(0, 0-10*25 ) // 设置图片偏移  
                    });   
	//查询距离最近的台站
	var condition = {
					lng:e.point.lng,
					lat:e.point.lat};
	getdata('/nearQuery',condition).then(function(dbdata){drawpoint(dbdata);addMarker(e.point,myIcon);});
    
/*    var marker = new BMap.Marker(e.point);//创建标注
	map.addOverlay(marker);*/

	//解绑click函数
	map.removeEventListener("click", findNearPoint);	
}
$("#getBounds").click(function(){
	var bs = map.getBounds();   //获取可视区域
	var bssw = bs.getSouthWest();   //可视区域左下角
	var bsne = bs.getNorthEast();   //可视区域右上角
	alert("当前地图可视范围是：" + bssw.lng + "," + bssw.lat + "到" + bsne.lng + "," + bsne.lat);
})
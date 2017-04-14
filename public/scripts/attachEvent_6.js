
/*地图显示设置*/
	var map = new BMap.Map("allmap",{enableMapClick:false});
	var point = new BMap.Point(106.76355,26.634111);
	map.centerAndZoom(point, 15);
	map.enableScrollWheelZoom(true);
	var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，添加默认缩放平移控件     
	map.addControl(top_right_navigation); 
	var top_right_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_RIGHT });// 左下角，添加比例尺
	map.addControl(top_right_control); 
	var oldTangle;
	var oldColor;
/*加载全部台站点*/
/*addLoadEvent(function(){
	getdata('/attrQuery',{search:"{}"})
	.then(function(dbdata){remove_overlay();drawpoint(dbdata);});
});*/
//获取时间跨度
addLoadEvent(function(){
	
	getdata('/aggregate',{system:'LTE',attr:'业务时间'})
	.then(function(dbdata){
		Maxtime = dbdata.Maxtime;
		Mintime = dbdata.Mintime;
	});
	var bs = map.getBounds();   //获取可视区域
	var bssw = bs.getSouthWest();   //可视区域左下角
	var bsne = bs.getNorthEast();   //可视区域右上角
	var allmap = document.getElementById('allmap');
	console.log(allmap.clientHeight+","+allmap.clientWidth);
	console.log('总像素'+(bsne.lat-bssw.lat)/0.0009*14);
});
/*设置信息弹框*/
addLoadEvent(setTab);

/*属性查询触发*/
$('#submit').click(function(){
	$('.loading').show();
	remove_overlay();
	$('#shut').click();
	hotMap();
});

/*信息弹框关闭按钮触发*/
$('#shut').click(function(){
	$('#tabMessage').hide();
	//if(oldMarker) oldMarker.setAnimation();
});


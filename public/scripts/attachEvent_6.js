
/*获取公共头部*/
$.get("html/head.html ",function(data){
	$("#head").html(data);
});
/*获取公共尾部*/
$.get("html/end.html ",function(data){
	$("#end").html(data);
});

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
});
/*设置信息弹框*/
addLoadEvent(setTab);

/*属性查询触发*/
$('#hotMap').click(function(){
	remove_overlay();
	$('#shut').click();
	var corporation = $("#corporation").val();//目标运营商类型
	var system = $("#system").val();//目标制式类型
	var corporation_2 = $("#corporation_2").val();//目标运营商类型
	var system_2 = $("#system_2").val();//目标制式类型	
	var bs = map.getBounds();   //获取可视区域
	var bssw = bs.getSouthWest();   //可视区域左下角
	var bsne = bs.getNorthEast();   //可视区域右上角
/*	var minLng = 0.0117;//每公里经纬度变化量
	var minLat = 0.009;*/
	var minLng = parseFloat(bs.toSpan().lng/10);//网格经度変化
	var minLat = parseFloat(bs.toSpan().lat/20);//网格纬度变化
	//console.log(bssw);
	//遍历地图设置查询点
	var points = [];
	for(var i=0;i<50;i++){
		for(var j=0;j<20;j++){
			points.push([bssw.lng+minLng*i,bssw.lat+minLat*j]);
		}
	}
	//查询条件设置
	var condition = {
		refer : {
			'运营商类型':corporation,
			'制式类型':system,	
			'业务时间':{"$gt":Maxtime.split('-')[0],"$lt":Maxtime.split('-')[1]},
			startGeom:[bssw.lng,bssw.lat],
			endGeom:[bsne.lng,bsne.lat],
			minGeom:[minLng,minLat],
			//number : 6//取临近6个台站点
		},				
		props : []
	};
					
	console.log(condition);
	/*查询及后续promise操作*/
	getdata('/hotMap',condition).then(function(dbdata){remove_overlay();drawpoint(dbdata,addMarker);setAttrQueryMessage(dbdata);});
});

/*信息弹框关闭按钮触发*/
$('#shut').click(function(){
	$('#tabMessage').hide();
	if(oldMarker) oldMarker.setAnimation();
});


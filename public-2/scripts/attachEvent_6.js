
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
/*	var bs = map.getBounds();   //获取可视区域
	var bssw = bs.getSouthWest();   //可视区域左下角
	var bsne = bs.getNorthEast();   //可视区域右上角
	var allmap = document.getElementById('allmap');
	console.log(allmap.clientHeight+","+allmap.clientWidth);
	console.log('总像素'+(bsne.lat-bssw.lat)/0.0009*14);*/
});
/*设置信息弹框*/
addLoadEvent(setTab);

/*属性查询触发*/
$('#hotMap').click(function(){
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


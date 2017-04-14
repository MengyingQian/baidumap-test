/*地图显示设置*/
	var map = new BMap.Map("allmap",{enableMapClick:false});
    var point = new BMap.Point(106.76355,26.634111);
    map.centerAndZoom(point, 15);
    map.enableScrollWheelZoom(true);
    var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); 
    //右上角，添加默认缩放平移控件     
    map.addControl(top_right_navigation); 
    var oldMarker;
    var oldTangle;
    var Maxtime;
    var Mintime;
/*设置信息弹框*/
addLoadEvent(setTab);
//获取时间跨度，设置默认时间
addLoadEvent(function(){
	getdata('/aggregate',{system:'LTE',attr:'业务时间'})
	.then(function(dbdata){
		Maxtime = dbdata.Maxtime;
		Mintime = dbdata.Mintime;
		$("#dl").attr("placeholder",Mintime.split('-')[0].split(' ')[0]);
		$("#tl").attr("placeholder",Mintime.split('-')[0].split(' ')[1]);
		$("#dh").attr("placeholder",Maxtime.split('-')[1].split(' ')[0]);
		$("#th").attr("placeholder",Maxtime.split('-')[1].split(' ')[1]);
	});
});

/*$('#clearAllDrawing').click(function(){
	clearAll();
	});*/
/*信息弹框关闭按钮触发*/
$('#shut').click(function(){
	$('#tabMessage').hide();
	if(oldMarker) oldMarker.setAnimation();
});
$("#submit").click(function(){
	$('.loading').show();//show函数改变display特性
	remove_overlay();
	$('#shut').click();
	mapTangle();
})
/*$("#submit").submit(function(event){
	event.preventDefault();
})*/

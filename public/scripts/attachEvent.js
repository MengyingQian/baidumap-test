/*获取公共头部*/
$.get("html/head.html ",function(data){
	$("#head").html(data);
});
/*获取公共尾部*/
$.get("html/end.html ",function(data){
	$("#end").html(data);
});
/*属性查询触发*/
$('#attrQuery').click(function(){
	var fl = $("#fl").val()||$("#fl").attr("placeholder");
	var fh = $("#fh").val()||$("#fh").attr("placeholder");
	var dl = $("#dl").val()||$("#dl").attr("placeholder");
	var dh = $("#dh").val()||$("#dh").attr("placeholder");
	var system = $('#system').val();
	//查询条件设置
	var centerFre = '"中心频率":{"$gte":'+fl+',"$lte":'+fh+'}';
	var startDay = '"台站使用起始日期":{"$gte":"'+dl+'","$lte":"'+dh+'"}';
	var systemType = '"系统类型":"'+system+'"';
	if(system ==='All') 
		var refer = '{'+centerFre+','+startDay+'}';
	else
		var refer = '{'+centerFre+','+startDay+','+systemType+'}';
	var condition = {search:refer};
	/*查询及后续promise操作*/
	getdata('/attrQuery',condition).then(function(dbdata){remove_overlay();drawpoint(dbdata);setAttrQueryMessage(dbdata);});
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
	.then(function(dbdata){remove_overlay();drawpoint(dbdata);});
});*/
/*设置信息弹框*/
addLoadEvent(setTab);

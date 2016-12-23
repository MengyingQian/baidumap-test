document.write('<script src="scripts/time.js"></script>');
/*获取公共头部*/
$.get("html/head.html ",function(data){
	$("#head").html(data);
});
/*获取公共尾部*/
$.get("html/end.html ",function(data){
	$("#end").html(data);
});

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

/*属性查询触发*/
$('#resourceRate').click(function(){
	$('.loading').show();
	remove_overlay();
	$('#shut').click();
	var corporation = $("#corporation").val();//运营商类型
	var system = $("#system").val();//制式类型
	var dl = $("#dl").val()||$("#dl").attr("placeholder");//起止时间
	var tl = $("#tl").val()||$("#tl").attr("placeholder");
	var dh = $("#dh").val()||$("#dh").attr("placeholder");
	var th = $("#th").val()||$("#th").attr("placeholder");
	//查询条件设置
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
	
	var condition = {
		refer : {
			'运营商类型':corporation,
			'制式类型':system,
			'业务时间':{"$gt":dl+' '+tl,"$lt":dh+' '+th}
		},
		props : ['LTE_无线利用率(新)(%)',"LTE_上行PRB平均利用率(新)(%)","LTE_下行PRB平均利用率(新)(%)"]
					
	};
	/*查询及后续promise操作*/
	getdata('/resourceRate',condition).then(function(dbdata){$('.loading').hide();remove_overlay();drawpoint(dbdata);setAttrQueryMessage(dbdata);});
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


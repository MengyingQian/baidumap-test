document.write('<script src="scripts/time.js"></script>');
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
$('#analyse').click(function(){
	$('.loading').show();
	remove_overlay();
	$('#shut').click();
	influence();
});

/*信息弹框关闭按钮触发*/
$('#shut').click(function(){
	$('#tabMessage').hide();
	if(oldMarker) oldMarker.setAnimation();
});

function influence(){
	var corporation = $("#corporation").val();//目标运营商类型
	var system = $("#system").val();//目标制式类型
	//中心频率获取
	var fl = $("#fl").val()||$("#fl").attr("placeholder");
	var fh = $("#fh").val()||$("#fh").attr("placeholder");
	var corporation_2 = $("#corporation_2").val();//目标运营商类型
	var system_2 = $("#system_2").val();//目标制式类型	
	var bs = map.getBounds();   //获取可视区域
	var bssw = bs.getSouthWest();   //可视区域左下角
	var bsne = bs.getNorthEast();   //可视区域右上角
	//console.log(bssw);
	//查询条件设置
	var condition = {
		refer : {
			'运营商类型':corporation,
			'制式类型':system,
			'业务时间':{"$gt":Maxtime.split('-')[0],"$lt":Maxtime.split('-')[1]},
			frequence:[fl,fh],
			searchBox:[bssw.lng,bssw.lat,bsne.lng,bsne.lat]
		},					
		props : [],
		refer_2 : {
			'载波频点(MHz)' : 1,//标识是否需要检测频率
			'运营商类型' : corporation_2,
			'制式类型' : system_2,
			'业务时间':{"$gt":Maxtime.split('-')[0],"$lt":Maxtime.split('-')[1]},
			number : 1//取临近1个台站点
		}
	};
					
	//console.log(condition);
	/*查询及后续promise操作*/
	getdata('/interference',condition).then(function(dbdata){$('.loading').hide();remove_overlay();drawpoint(dbdata,addReMarker);setAttrQueryMessage(dbdata);});
}
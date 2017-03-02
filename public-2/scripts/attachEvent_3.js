
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
$("#mapTangle").click(function(){
	$('.loading').show();//show函数改变display特性
	remove_overlay();
	$('#shut').click();
	mapTangle();
})

$(".nav-roundslide a.show").click(function(){
    $(".nav-roundslide a.show").css('display','none');
    $(".nav-roundslide a.hide").css('display','block');
    $("#leftMenu").animate({left:'0px'});
})
$(".nav-roundslide a.hide").click(function(){
    $(".nav-roundslide a.hide").css('display','none');
    $(".nav-roundslide a.show").css('display','block');
    $("#leftMenu").animate({left:'-275px'});
})

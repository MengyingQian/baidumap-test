function hotMap(){
	var corporation = $("#corporation").val();//目标运营商类型
	var system = $("#system").val();//目标制式类型
	var corporation_2 = $("#corporation_2").val();//目标运营商类型
	var system_2 = $("#system_2").val();//目标制式类型	
	var bs = map.getBounds();   //获取可视区域
	var bssw = bs.getSouthWest();   //可视区域左下角
	var bsne = bs.getNorthEast();   //可视区域右上角
	var zoom = map.getZoom();//获取当前地图缩放等级
/*	var minLng = 0.0117;//每公里经纬度变化量
	var minLat = 0.009;*/
	var maxDistance = 1000;//单个点搜索范围（m）
	var startLng = bssw.lng-0.0000117*maxDistance;//搜索区域，非显示区域
	var startLat = bssw.lat-0.000009*maxDistance;
	var endLng = bsne.lng+0.0000117*maxDistance;
	var endLat = bsne.lat+0.000009*maxDistance;
	var recLength = 12.5*Math.pow(2,18-zoom);//单位栅格边长（m）
	//console.log(recLength);
	var minLng = 0.0000117*recLength;//单位栅格的经度跨度
	var minLat = 0.000009*recLength;//单位栅格的纬度跨度
	//查询条件设置
	var condition = {
		refer : {
			'运营商类型':corporation,
			'制式类型':system,	
			'业务时间':{"$gt":Maxtime.split('-')[0],"$lt":Maxtime.split('-')[1]},
			//扩大搜索区域
			searchBox:[startLng,startLat,endLng,endLat]
		},	
		searchBox:{
			startPoint : [startLng,startLat],
			endPoint : [endLng,endLat],
			recLength : recLength,
			maxDistance : maxDistance
		},		
		props : []
	};
	/*查询及后续promise操作*/
	getdata('/hotMap',condition).then(function(dbdata){
		$('.loading').hide();
		for(var i=0,len=dbdata.length;i<len;i++){
			createHotTangle(minLng,minLat,dbdata[i]);
		}
		//数组分块，减小单个函数运行时间
//		chunk(dbdata.concat(),createHotTangle);
		var allmap = document.getElementById("allmap")
		var div_svg = allmap.firstChild.children[1].lastChild;
		console.log(div_svg);
		//click事件冒泡
		div_svg.addEventListener("click", function(event){//事件委托
			var ipath = event.target;//获取click事件目标

			if(oldTangle) {
				oldTangle.setAttribute("fill",oldColor);
				oldTangle.setAttribute("fill-opacity",0.5);
			}
			oldTangle = ipath;
			oldColor = ipath.getAttribute("fill");
			var d = ipath.getAttribute("d");
			ipath.setAttribute("fill","#00BFFF");
			ipath.setAttribute("fill-opacity",0.1);
			setHotMapMessage(getPoint(oldColor,d));
		});
/*		var ipath = isvg.getElementsByTagName("path")[0];
		console.log(ipath.getAttribute("d"));//可取出相应栅格参数*/
	});//使用闭包
}
//闭包函数
//下一步任务，查看覆盖物类polygon
function createHotTangle(minLng,minLat,point){
	var color = setColor(point[2]);
	var rectangle = new BMap.Polygon([
		new BMap.Point(point[0],point[1]),
		new BMap.Point(point[0],point[1]+minLat),
		new BMap.Point(point[0]+minLng,point[1]+minLat),
		new BMap.Point(point[0]+minLng,point[1])
	], {strokeColor:'white', strokeWeight:0.001, strokeOpacity:0});
	//console.log(rectangle);
	rectangle.setFillOpacity(0.5);
	rectangle.setFillColor(color); 
/*	rectangle.addEventListener("click", function(){
		if(oldTangle) {
			oldTangle.setFillColor(oldColor);
			oldTangle.setFillOpacity(0.5);
		}
		oldTangle = this;
		oldColor = this.getFillColor();
		this.setFillColor("#00BFFF");
		this.setFillOpacity(0.1);
		//console.log(point);
		setHotMapMessage(point);
	}); 
	rectangle.addEventListener("rightclick", function() {  
    	this.setFillColor(oldColor);
		this.setFillOpacity(0.5);  
    });*/
	map.addOverlay(rectangle);//增加矩形
	rectangle = null; //减少引用数，减少内存占用
}
//反向计算value与坐标
function getPoint(color,d){
	var re1 = /\d{1,3}/g;
	var r = parseInt(re1.exec(color));
	var g = parseInt(re1.exec(color));
	var b = parseInt(re1.exec(color));
	var re2 = /\d{1,4}/g;
	var x = parseInt(re2.exec(d));
	var y = parseInt(re2.exec(d));
	var one = (255+255) / 100;
	var value;
	var lng;
	var lat;
	if(r == 255){
		value = (255-g)/one+50-120;
	}
	else{
		value = r/one-120;
	}
	var bs = map.getBounds();   //获取可视区域
	var bssw = bs.getSouthWest();   //可视区域左下角
	var bsne = bs.getNorthEast();   //可视区域右上角
	lng = (bsne.lng-bssw.lng)/1440*x+bssw.lng;
	lat = (bsne.lat-bssw.lat)/767*y+bssw.lat;
	console.log([lng,lat,value]);
	return [lng,lat,value];
}
//由绿到红的渐变色值,百分比 value 取值 1...100  
function setColor(value){
	//最大值为100，防止过大出现错误
	value = parseInt(value);
	if(value!=0) value += 120;
	if(value > 100) value = 100; 
	if(value < 0) value = 0; 
	//console.log(value);
	//var 百分之一 = (单色值范围) / 50;  单颜色的变化范围只在50%之内 
    var one = (255+255) / 100;    
    var r=0;  
    var g=0;  
    var b=0;  
    if ( value < 50 ) {   
        // 比例小于50的时候红色是越来越多的,直到红色为255时(红+绿)变为黄色.  
        r = one * value; 
        g=255; 
    }  
    if ( value >= 50 ) {  
        // 比例大于50的时候绿色是越来越少的,直到0 变为纯红  
        g =  255 - ( (value - 50 ) * one) ;  
        r = 255;  
    }  
    r = parseInt(r);// 取整  
    g = parseInt(g);// 取整  
    b = parseInt(b);// 取整  
    //console.log("#"+r.toString(16,2)+g.toString(16,2)+b.toString(16,2));  
    //return "#"+r.toString(16,2)+g.toString(16,2)+b.toString(16,2);  
    //console.log("rgb("+r+","+g+","+b+")" );  
    return "rgb("+r+","+g+","+b+")";  
}

function chunk(data,callback){
	setTimeout(function(){
		var item = data.shift();
		callback(minLng,minLat,item);
	},100);
	if(data.length>0){
		setTimeout(arguments.callee,100);
	}
}
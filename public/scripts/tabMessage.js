
//右侧台站信息框触发设置
function setTab(){
    var oTab = document.getElementById("tab");
    var aH3 = oTab.getElementsByTagName("h3");
    var aDiv = document.getElementsByName("tag");
    for (var i = 0; i < aH3.length; i++) {
        aH3[i].index = i;
        /*点击选项卡触发操作*/
        aH3[i].onclick = function() {
            for (var j = 0; j < aH3.length; j++) {
                aH3[j].className = "";
                aDiv[j].style.display = "none";
            }
            if(this.index === 1 && aDiv[this.index].getElementsByClassName('echarts').length)
                $('#tabMessage').animate({width:'600px'});
            else
                $("#tabMessage").animate({width:'300px'});
            aDiv[this.index].className = "";
            aDiv[this.index].className = "content";
            this.className = "active";
            aDiv[this.index].style.display = "block";
        };
    }
    aH3[0].click();
};


/*单点显示状态*/
function setPointMessage(point){
    console.log(point['对象标识']);
    var oTab = document.getElementById("tab");
    var aDiv = document.getElementsByName("tag");
    //各选项卡内容设置
    aDiv[0].innerHTML = contentMake(point);
    aDiv[1].firstChild.nodeValue = resultMake(point);
    aDiv[2].innerHTML = "其他";
    $("div").remove('.echarts');
    //aDiv[1].getElementsByTagName("p")[0].innerHTML = "频率信息";
    //制作echarts图表
    if($("#dl").val()||$("#dl").attr("placeholder")){
        // 制作数据
        var pointKeys = Object.keys(point);
        pointKeys = pointKeys.sort();
        var dl = $("#dl").val()||$("#dl").attr("placeholder");//起止时间
        var tl = $("#tl").val()||$("#tl").attr("placeholder");
        var dh = $("#dh").val()||$("#dh").attr("placeholder");
        var th = $("#th").val()||$("#th").attr("placeholder");
        var startTime = dl+' '+tl;
        var endTime = dh+' '+th;
        //console.log(startTime+'        '+endTime);
        var time = [];
        do{
            startTime = changeTime(startTime);
            time.push(startTime);
        }while(startTime<endTime);
        //console.log(time);

        for(var i=0;i<pointKeys.length;i++){
            key = pointKeys[i];
            if(!Array.isArray(point[key]))
                continue;
            var number = point[key];
            echartsMake(time,number,echartsAbbr(key));
        }
    }
    
    //setMessage();
    $('#tabMessage').show();
};


/*属性查询显示状态*/
function setAttrQueryMessage(data){
    var oTab = document.getElementById("tab");
    var aDiv = document.getElementsByName("tag");
    var content = "依据属性共查询到"+data.length+"个台站";
        //各选项卡内容设置
        aDiv[0].innerHTML = content;
        aDiv[1].firstChild.nodeValue = oTab.getElementsByTagName("h3")[1].innerHTML;
        $("div").remove('.echarts');
        //document.getElementById('echarts').innerHTML = "";
        aDiv[2].innerHTML = "其他";
        $('#tabMessage').show();
};

/*地图栅格显示状态*/
function setMapTangleMessage(data){
        var oTab = document.getElementById("tab");
        var aDiv = document.getElementsByName("tag");
        var content = "此栅格内共"+data.length+"个台站"+"<br />";
        //各选项卡内容设置
        aDiv[0].innerHTML = content;
        aDiv[1].firstChild.nodeValue = "";
        aDiv[2].innerHTML = "其他";
        var abbrs = [];
        var number = {};
        for(var key in data[0]){
            if(!Array.isArray(data[0][key])) continue;
            abbrs.push(key);
            number[key] = [];
            //number[key] = data[0][key];
            //以上赋值为地址传递
            do{
                number[key].push(0);
            }while(number[key].length<data[0][key].length);
        }
        
        for(var i=0;i<data.length;i++){
            abbrs.forEach(function(item,index,array){
                number[item] = arrAdd(number[item],data[i][item]);
            });
        }
        console.log(number);
        $("div").remove('.echarts');
        var time = [];
        var dl = $("#dl").val()||$("#dl").attr("placeholder");//起止时间
        var tl = $("#tl").val()||$("#tl").attr("placeholder");
        var dh = $("#dh").val()||$("#dh").attr("placeholder");
        var th = $("#th").val()||$("#th").attr("placeholder");
        var startTime = dl+' '+tl;
        var endTime = dh+' '+th;
        do{
            startTime = changeTime(startTime);
            time.push(startTime);
        }while(startTime<endTime);

        for(var key in number){
            if($("input[type='checkbox']").is(':checked')){
                number[key] = number[key].map(function(item,index,array){
                    return item/data.length;
                });
            }
            echartsMake(time,number[key],echartsAbbr(key));
        }
    $('#tabMessage').show();
};

function setHotMapMessage(data){
        var oTab = document.getElementById("tab");
        var aDiv = document.getElementsByName("tag");
        var content = 
                    "测量点："+"<br />"+
                    "经度："+data[0]+"<br />"+
                    "纬度："+data[1]+"<br />"+
                    "接收功率："+data[2]+"dbm"+"<br />";
        //各选项卡内容设置
        aDiv[0].innerHTML = content;
        aDiv[1].firstChild.nodeValue = "热力图";
        aDiv[2].innerHTML = "其他";
        $('#tabMessage').show();
}
function arrAdd(arr1,arr2){
        if(arr1.length != arr2.length) {
                alert('数组长度不相等');
                return;
        }
        var arrSum = arr1;
        for(var i=0,len=arr1.length;i<len;i++){
                arrSum[i] = arr1[i] + arr2[i];                                        
        }
        return arrSum;
}

function contentMake(point){
/*    var content = '';
    for(var key in point){
        if(Array.isArray(point[key])) continue;
        if(key == 'geom'){
            content +="台站经度 : "+point.geom.coordinates[0]+"<br />";
            content +="台站纬度 : "+point.geom.coordinates[1]+"<br />";
            continue;
        }
        content += key.split('(')[0]+' : '+point[key];
        var re = /.*\((.*)\)/;
        if(re.exec(key)) content += re.exec(key).pop();
        content += "<br />";
    }*/
    var content = 
                "运营商类型 : "+point["运营商类型"]+"<br />"+
                "制式类型 : "+point["制式类型"]+"<br />"+
                "方位角 : "+point["Azimuth(度)"]+'度'+"<br />"+
                "站高 : "+point["站高(m)"]+'m'+"<br />"+
                "下倾角 : "+point["DownTilt(度)"]+'度'+"<br />"+
                "载波频点 : "+point["载波频点(MHz)"]+'MHz'+"<br />"+
                "台站经度 : "+point.geom.coordinates[0]+"<br />"+
                "台站纬度 : "+point.geom.coordinates[1]+"<br />"+
                "基站发射功率："+point["基站发射功率(dBm)"]+'dBm'+"<br />"+
                "共站情况 : "+point["共站情况"]+"<br />";
    return content;
}

function resultMake(point){
    var content = '';
    //定义属性数组
    var props = ['对象标识','运营商类型',"制式类型","Azimuth(度)","站高(m)","DownTilt(度)","载波频点(MHz)","基站发射功率(dBm)",'geom',"共站情况","业务时间"];
    for(var key in point){
        if(props.indexOf(key)>=0) continue;
        if(typeof point[key]=='object'||Array.isArray(point[key])) continue;
        //console.log(key);
        content += key.split('(')[0]+' : '+point[key];
        var re = /.*\((.*)\)/;
        if(re.exec(key)) content += re.exec(key).pop();
    }
    return content;
}

function echartsMake(xData,yData,abbr){
    // 基于准备好的dom，初始化echarts实例
    var createDiv = document.createElement('div');
    createDiv.classList.add('echarts');
    $("#tab div#echarts").append(createDiv);
    var myChart = echarts.init(createDiv);
    //指定图表的配置项
    //console.log(time);
    var option = {
            title: {
                    text: abbr.titled,
                    x: 'center'
            },
            tooltip: {
                    trigger: abbr.trigger
            },
            legend: {
                    //data:[abbr.titled],
                    left:'left'
            },
            xAxis: {
                    name : abbr.xName,
                    type : 'category',
                    boundaryGap : false,
                    data: xData
            },
            yAxis: {
                    type : 'value',
                    name: abbr.yName,
                    scale: true 
            },
            series: [
            {
                    name: abbr.titled,
                    type: abbr.typed,
                    data: yData,
                    areaStyle: {normal: {}},
            }
            ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    
}

function echartsAbbr(name){
    switch(name){
        case 'LTE下行总流量(MByte)':
            var abbr = {
                titled : name.split('(')[0],
                trigger : 'axis',
                xName : '时间(h)',
                yName : '流量(MByte)',
                typed : 'line'
            };
            break;
            case 'LTE上行总流量(MByte)':
            var abbr = {
                titled : name.split('(')[0],
                trigger : 'axis',
                xName : '时间(h)',
                yName : '流量(MByte)',
                typed : 'line'
            };
            break;
        case "无线接通率(%)":
            var abbr = {
                titled : name.split('(')[0],
                trigger : 'axis',
                xName : '时间(h)',
                yName : '百分比(%)',
                typed : 'line'
            };
            break;
        default:
        var abbr = {
                titled : name.split('(')[0],
                trigger : 'axis',
                xName : '',
                yName : /.*\((.*)\)/.exec(name).pop(),
                typed : 'line'
            };
    }
    return abbr;
}
/*空间查询显示状态*/
/*function setDrawQueryMessage(data){
        var oTab = document.getElementById("tab");
        var aDiv = document.getElementsByName("tag");
        var content = "框选共查询到"+data.length+"个台站"+"<br />";
        //各选项卡内容设置
        aDiv[0].innerHTML = content;
        aDiv[1].getElementsByTagName("p")[0].innerHTML = "";
        aDiv[2].innerHTML = "其他";
        //echarts绘图
        // 基于准备好的dom，初始化echarts实例
        $("div").remove('.echarts');
        var createDiv = document.createElement('div');
        createDiv.classList.add('echarts');
        $("#tab div.echarts").append(createDiv);
        var myChart = echarts.init(createDiv);
        // 指定图表的配置项和数据
        var number = [0,0,0,0,0];
        for(var i=0;i<data.length;i++){
            switch(data[i]["系统类型"]){
                case "GSM":
                    number[0]++;
                    break;
                case "CDMA-2000":
                    number[1]++;
                    break;
                case "TD-SCDMA":
                    number[2]++;
                    break;
                case "WCDMA":
                    number[3]++;
                    break;
                case "LTE":
                    number[4]++;
                    break;
                default:
                    alert(" The type is wrong");
            }
        }
        var option = {
                title: {
                        text: '系统类型'
                },
                tooltip: {},
                legend: {
                        data:['各类型数目']
                },
                xAxis: {
                    axisLabel: {
                        interval:0 ,
                rotate: 30
                },
                        data: ["GSM","CDMA-2000","TD-SCDMA","WCDMA","LTE"]
                },
                yAxis: {},
                series: [{
                        name: '各类型数目',
                        type: 'bar',
                        data: number,
                        barWidth: '60%'
                        itemStyle: {
                            barMaxWidth:
                        }
                }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        console.log(option);
    $('#tabMessage').show();
};*/
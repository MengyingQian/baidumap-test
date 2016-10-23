var overlays = [];//用于包含绘制图形
//绘制完毕触发函数
var overlaycomplete = function(e){
    overlays.push(e.overlay);
    console.log(e.overlay.Mu.De);//获取方框地理坐标
    drawingManager.close();//自动关闭绘制状态
    var condition = {
                startLng : e.overlay.Mu.Je,
                startLat : e.overlay.Mu.De,
                endLng : e.overlay.Mu.Ee,
                endLat : e.overlay.Mu.Ie
                };
    getdata('/drawQuery',condition)
    .then(function(dbdata){remove_overlay();drawpoint(dbdata);setDrawQueryMessage(dbdata);});
};
//设置绘制样式
var styleOptions = {
    strokeColor:"red",    //边线颜色。
    //fillColor:"red",      
    strokeWeight: 3,       //边线的宽度，以像素为单位。
    strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
    fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
    strokeStyle: 'solid' //边线的样式，solid或dashed。
}
//实例化鼠标绘制工具
var drawingManager = new BMapLib.DrawingManager(map, {
    isOpen: false, //是否开启绘制模式
    enableDrawingTool: true, //是否显示工具栏
    drawingToolOptions: {
        anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
        offset: new BMap.Size(80, 20), //偏离值
        drawingModes : [
        //BMAP_DRAWING_POLYGON,
        BMAP_DRAWING_RECTANGLE 
     ]
    },
    polygonOptions: styleOptions, //多边形的样式
    rectangleOptions: styleOptions //矩形的样式
});  
//清除所有绘制图案
function clearAll() {
        for(var i = 0; i < overlays.length; i++){
            map.removeOverlay(overlays[i]);
        }
    }
 //添加鼠标绘制工具监听事件，用于获取绘制结果执行overlaycomplete函数
drawingManager.addEventListener('overlaycomplete', overlaycomplete);
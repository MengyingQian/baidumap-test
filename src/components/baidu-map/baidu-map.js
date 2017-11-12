import $$EventBus from "../../script/EventBus.js"
import $$model from "../../script/model.js"

export default {
    data () {
        return {
            map: {},
            rectangleArr: [],
            selectRectangle: null,
            selectPoint: null,
            oldHexagon: null,
            oldRePoint: []
        }
    },
    computed: {
        getBounds () {//计算属性与watch配合监听显示范围的改变
            return this.map.getBounds?this.map.getBounds():{};
        },
        getZoom () {//监听地图缩放等级
            return this.map.getZoom?this.map.getZoom():0;
        }
    },
    watch: {
        getBounds (newVal) {
            this.$store.commit('setBounds',newVal)
        },
        getZoom (newVal) {
            this.$store.commit('setZoom',newVal)
        }
    },
    methods: {
        //初始化地图
        init (state) {
            var self = this;
            /*地图显示设置*/
            var _map = new BMap.Map("baiduMap",{enableMapClick:false});
            var point = new BMap.Point(106.76355,26.634111);
            _map.centerAndZoom(point, 15);
            _map.enableScrollWheelZoom(true);
            //右上角，添加默认缩放平移控件     
            var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); 
            _map.addControl(top_right_navigation);
            // 左下角，添加比例尺
            var top_right_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_RIGHT });
            _map.addControl(top_right_control); 
            // _map.addEventListener("click",function(e){
            //     console.log(e.point.lng + "," + e.point.lat);
            // });
            this.map = _map;
        },
        //清除所有标记
        remove_overlay (){
            this.map.clearOverlays();        
        },
        mapRectangle (data) { // mapRactangle页面调用
            var that = this;
            that.drawRectangle(data.searchBox,"mapRectangle");//绘制矩形
            that.drawPoint(data.baseInfo,"mapRectangle");
        },
        coverage (data) {
            // do something
            var step = this.$store.state.searchParams.step;
            var startLat = data[0].lat;
            var minLng = step/(1000*111*Math.cos(startLat*Math.PI/180));// 单个栅格经度变化
            var minLat = step/(1000*111);// 单个栅格维度变化
            this.drawHotTangle(data,minLng,minLat);
            this.clickHotTangle("coverage");
        },
        resourceRate (data) {
            var that = this;
            that.drawPoint(data.baseInfo,"resourceRate");
        },
        interference (data) {
            var that = this;
            that.drawPoint(data.baseInfo,"interference");
        },
        networkLayout (data) {
            var that = this;
            that.drawPoint(data.baseInfo,"networkLayout");
        },
        clickHotTangle (page) {
            var that = this;
            var baiduMap = that.$refs.baiduMap;
            //click事件冒泡
            baiduMap.addEventListener("click", function(event){//事件委托
                var ipath = event.target;//获取click事件目标
                // console.log(ipath)
                var color = ipath.getAttribute("fill");
                var d = ipath.getAttribute("d");
                var point = that.getHotCount(color,d);
                $$EventBus.$emit("showMsg",{
                    data: point,
                    type: "rectangle",
                    page: page
                })//设置消息弹窗
            });
        },
        drawHotTangle (points,minLng,minLat) {
            for (let i=0,len=points.length;i < len;i++) {
                var color = this.setHotColor(points[i].count);
                var rectangle = new BMap.Polygon([
                    new BMap.Point(points[i].lng,points[i].lat),
                    new BMap.Point(points[i].lng,points[i].lat+minLat),
                    new BMap.Point(points[i].lng+minLng,points[i].lat+minLat),
                    new BMap.Point(points[i].lng+minLng,points[i].lat)
                ], {strokeColor:'white', strokeWeight:0.001, strokeOpacity:0});
                rectangle.setFillOpacity(0.5);
                rectangle.setFillColor(color); 
                this.map.addOverlay(rectangle);//增加矩形
                rectangle = null; //减少引用数，减少内存占用
            }
            // heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
            // this.map.addOverlay(heatmapOverlay);
            // heatmapOverlay.setDataSet({data:points,max:-20});
        },
        drawRectangle (searchBox,page) {
            var that = this;
            //绘制矩形
            for (let i=0,len=searchBox.length;i < len;i++) {
                let rectangle = new BMap.Polygon([
                    new BMap.Point(searchBox[i][0],searchBox[i][1]),
                    new BMap.Point(searchBox[i][0],searchBox[i][3]),
                    new BMap.Point(searchBox[i][2],searchBox[i][3]),
                    new BMap.Point(searchBox[i][2],searchBox[i][1])
                ], {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});
                rectangle.setFillOpacity(0.1);
                rectangle["data-index"] = i;//为栅格定义index属性，表明其在数据中的位置
                rectangle.addEventListener("click",function(){
                    if (that.selectRectangle) {
                        that.selectRectangle.setFillColor("#FFFFFF");//取消上一个被选中栅格的特效
                        that.selectRectangle.setFillOpacity(0.1); 
                    }

                    if (that.selectPoint) {
                        that.selectPoint.setAnimation();
                    }
                    that.selectRectangle = this;
                    that.selectRectangle.setFillColor("#00FFFF");//为本次选中的栅格增加特效
                    that.selectRectangle.setFillOpacity(0.5);
                    $$EventBus.$emit("showMsg",{
                        data: that.selectRectangle["data-index"],
                        type: "rectangle",
                        page: page
                    })//设置消息弹窗
                })
                that.map.addOverlay(rectangle);//增加矩形
                rectangle = null;
            }
        },
        drawPoint (baseInfo,page) {// 绘制基站点
            var that = this;
            for (var i = 0,len = baseInfo.length;i < len; i++) {
                // http://api.map.baidu.com/img/markers.png
                var color = 0;
                if (page === "interference") {
                    color = parseInt(baseInfo[i]['干扰系数']/0.1)
                } else if (page === "networkLayout") {
                    color = (baseInfo[i]["基站布局"] + baseInfo[i]["基站站高"])*2;// 此两部分取值为0或1，0为正常，1为异常
                }
                var myIcon = new BMap.Icon("static/markers.png", new BMap.Size(23, 25), {  
                                offset: new BMap.Size(10, 25), // 指定定位位置  
                                imageOffset: new BMap.Size(0, 0-color*25 ) // 设置图片偏移  
                            }); 
                var _marker = new BMap.Marker(new BMap.Point(baseInfo[i].geom.coordinates[0], baseInfo[i].geom.coordinates[1]),{icon:myIcon});
                that.map.addOverlay(_marker);//添加标注
                _marker["data-index"] = i;//为Mark定义index属性，表明其在数据中的位置
                _marker.addEventListener("click", function(e) {
                    // console.log(this["data-index"])
                    if (that.selectRectangle) {
                        that.selectRectangle.setFillColor("#FFFFFF");//取消上一个被选中栅格的特效
                        that.selectRectangle.setFillOpacity(0.1); 
                    }
                    if (that.selectPoint) {
                        that.selectPoint.setAnimation();
                    }
                    that.selectPoint = this;
                    that.selectPoint.setAnimation(BMAP_ANIMATION_BOUNCE);
                    if (page === "interference") {
                        that.addReMarker(that.selectPoint["data-index"]);
                    }
                    if (page === "networkLayout") {
                        that.addReMarker(that.selectPoint["data-index"]);
                        that.hexagon(that.selectPoint["data-index"]);
                    }
                    $$EventBus.$emit("showMsg",{
                        data: that.selectPoint["data-index"],
                        type: "point",
                        page: page
                    })//设置消息弹窗
                });
                _marker = null;  //减少引用数，减少内存占用
            }
        },
        setHotColor (value) {//由绿到红的渐变色值,百分比 value 取值 1...100  
            if(!value) value = 0
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
        },
        // 纬度计算偏差较大
        getHotCount (color,d) {
            var re1 = /\d{1,3}/g;
            var r = parseInt(re1.exec(color));
            var g = parseInt(re1.exec(color));
            var b = parseInt(re1.exec(color));
            var arr = d.split(" ");
            var x = parseInt(arr[1]);
            var y = parseInt(arr[2]);
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
            var bs = this.map.getBounds();   //获取可视区域
            var bssw = bs.getSouthWest();   //可视区域左下角
            var bsne = bs.getNorthEast();   //可视区域右上角

            var mapwidth = this.$refs.baiduMap.clientWidth;
            var mapHeight = this.$refs.baiduMap.clientHeight;

            lng = (bsne.lng-bssw.lng)/mapwidth*x+bssw.lng;
            lat = (bsne.lat-bssw.lat)/mapHeight*y+bssw.lat;
            // console.log(x,y)
            // console.log(lng,lat)
            return {
                lng: lng,
                lat: lat,
                count: value
            };
        },
        // 设置关联基站点样式
        addReMarker(index){
            var that = this;
            var data = that.$store.state.searchData.baseInfo[index];
            if(that.oldRePoint.length){
                that.oldRePoint.map(function(marker){
                    that.map.removeOverlay(marker);
                })
                that.map.removeOverlay(that.oldRePoint);
                that.oldRePoint = [];
            } 
            for(var i=0;i<data.rePoints.length;i=i+2){
                if(data.rePoints[i] === 0) break;
                var myIcon = new BMap.Icon("static/markers.png", new BMap.Size(23, 25), {  
                                offset: new BMap.Size(10, 25), // 指定定位位置  
                                imageOffset: new BMap.Size(0, 0-10*25 ) // 设置图片偏移  
                            });
                var marker = new BMap.Marker(new BMap.Point(data.rePoints[i], data.rePoints[i+1]),{icon:myIcon});
                that.oldRePoint.push(marker);
                that.map.addOverlay(marker);
                //设置文字标签
                var label = new BMap.Label(data.rePoints[i]+","+data.rePoints[i+1],{offset:new BMap.Size(20,-10)});
                marker.setLabel(label);
            }
        },
        hexagon (index) {
            var that = this;
            var data = that.$store.state.searchData.baseInfo[index];
            var lng = data.geom.coordinates[0];
            var lat = data.geom.coordinates[1];
            var L = data['小区半径'];
            if(that.oldHexagon){
                that.map.removeOverlay(that.oldHexagon);
            } 
            var polygon = new BMap.Polygon([
            new BMap.Point(lng-0.0000117*L,lat),
            new BMap.Point(lng-0.0000117*L/2,lat+0.000009*L*Math.sqrt(3)/2),
            new BMap.Point(lng+0.0000117*L/2,lat+0.000009*L*Math.sqrt(3)/2),  
            new BMap.Point(lng+0.0000117*L,lat),

            new BMap.Point(lng+0.0000117*L/2,lat-0.000009*L*Math.sqrt(3)/2),

            new BMap.Point(lng-0.0000117*L/2,lat-0.000009*L*Math.sqrt(3)/2),

            new BMap.Point(lng-0.0000117*L,lat),
            ], {strokeColor:"red", strokeWeight:2, strokeOpacity:0.5});   //创建正六边形
            that.map.addOverlay(polygon);
            that.oldHexagon = polygon;
        }
    },
    mounted () {
        this.init();
    },
    beforeMount () {
        let that = this;
        // 清除地图覆盖物
        $$EventBus.$on("clearOverlays",function(){
            that.map.clearOverlays();
        });
        // 清除栅格和基站的选中效果
        $$EventBus.$on("clearSelect",function(){
            if (that.selectRectangle) {
                that.selectRectangle.setFillColor("#FFFFFF");//清除选中栅格特效
                that.selectRectangle.setFillOpacity(0.1);
            }
            if (that.selectPoint) {
                that.selectPoint.setAnimation();//清除选中点特效
            }
        });
        // 监听栅格
        $$EventBus.$on("mapRectangle",function(data){
            that.mapRectangle.call(that,data)
        });
        // 监听覆盖分析
        $$EventBus.$on("coverage",function(data){
            that.coverage.call(that,data)
        });
        // 监听干扰分析
        $$EventBus.$on("interference",function(data){
            that.interference.call(that,data)
        });
        // 监听资源利用率分析
        $$EventBus.$on("resourceRate",function(data){
            that.resourceRate.call(that,data)
        });
        // 监听资源利用率分析
        $$EventBus.$on("networkLayout",function(data){
            that.networkLayout.call(that,data)
        });
    }
}
import $$EventBus from "../../script/EventBus.js"
import $$model from "../../script/model.js"

export default {
    data () {
        return {
            map: {},
            rectangleArr: [],
            selectRectangle: null,
            selectPoint: null
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
            this.map = _map;
        },
        //清除所有标记
        remove_overlay (){
            this.map.clearOverlays();        
        },
        mapRectangle (data) { // mapRactangle页面调用
            var that = this;
            that.drawRectangle(data.searchBox,"mapRectangle");//绘制矩形
            that.drawPoint(data.baseInfo,"mapRectangle")
        },
        coverage (data) {
            // do something
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
                        index: that.selectRectangle["data-index"],
                        type: "rectangle",
                        page: page
                    })//设置消息弹窗
                })
                that.map.addOverlay(rectangle);//增加矩形
                rectangle = null;
            }
        },
        drawPoint (baseInfo,page) {// 绘制基站点
            var color = 0;
            var that = this;
            for (var i = 0,len = baseInfo.length;i < len; i++) {
                var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {  
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
                    $$EventBus.$emit("showMsg",{
                        index: that.selectPoint["data-index"],
                        type: "point",
                        page: page
                    })//设置消息弹窗
                });
                _marker = null;  //减少引用数，减少内存占用
            }
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
        $$EventBus.$on("mapRectangle",function(data,isAverage){
            that.mapRectangle.call(that,data,isAverage)
        });
        // 监听覆盖分析
        $$EventBus.$on("coverage",function(data,isAverage){
            that.coverage.call(that,data,isAverage)
        });
    }
}
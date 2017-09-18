import $$EventBus from "../../script/EventBus.js"
import $$model from "../../script/model.js"

export default {
    data () {
        return {
            map: {},
            rectangleArr: []
        }
    },
    computed: {
        clearMap () {
            return this.$store.state.clearMap;
        }
    },
    watch: {
        clearMap (newVal) {
            if(newVal === true) {
                this.remove_overlay();
                this.$store.commit("clearMap",false);
            }
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
            //改变地图显示区域会有两种操作，平移与缩放
            //地图移动时改变时获取范围
            _map.addEventListener('moveend', self.getBoundArea);
            //地图缩放级别改变时获取显示范围
            _map.addEventListener('zoomend', self.getBoundArea);
            this.map = _map;
            this.getBoundArea();
        },
        //清除所有标记
        remove_overlay (){
            this.map.clearOverlays();        
        },
        getBoundArea () {
            //可以考虑函数节流
            this.$store.commit('setBounds',this.map.getBounds())
        },
        mapRectangle (data) {
            var that = this;
            this.rectangleArr = [];
            for (let i=0,len=data.length;i<len;i++) {
                let searchBox = data[i].searchBox;
                let baseInfo = data[i].baseInfo;

                that.drawRectangle(searchBox,baseInfo);//绘制矩形
                if (baseInfo.length != 0) {
                    that.drawPoint(baseInfo);
                }
            }
        },
        drawRectangle (searchBox,baseInfo) {
            var that = this;
            //绘制矩形
            let rectangle = new BMap.Polygon([
                new BMap.Point(searchBox[0],searchBox[1]),
                new BMap.Point(searchBox[0],searchBox[3]),
                new BMap.Point(searchBox[2],searchBox[3]),
                new BMap.Point(searchBox[2],searchBox[1])
            ], {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});
            rectangle.setFillOpacity(0.1);
            this.rectangleArr.push(rectangle);
            rectangle.addEventListener("click",function(){
                that.selectRectangle(that.rectangleArr.indexOf(this));
            })
            this.map.addOverlay(rectangle);//增加矩形
        },
        selectRectangle (selectIndex) {
            this.rectangleArr.forEach(function(item,index){
                if (selectIndex === index) {
                    item.setFillColor("#00FFFF");
                    item.setFillOpacity(0.5);
                    //弹窗信息设置
                } else {
                    item.setFillColor("#FFFFFF");
                    item.setFillOpacity(0.1);
                }
            })
        },
        drawPoint (baseInfo) {// 绘制基站点
            var color = 0;
            for (var i = 0; i < baseInfo.length; i ++) {
                // var myIcon = new BMap.Icon("images/markers1.png", new BMap.Size(23, 25), {  
                //                 offset: new BMap.Size(10, 25), // 指定定位位置  
                //                 imageOffset: new BMap.Size(0, 0-color*25 ) // 设置图片偏移  
                //             }); 
                var _marker = new BMap.Marker(new BMap.Point(baseInfo[i].geom.coordinates[0], baseInfo[i].geom.coordinates[1]));
                this.map.addOverlay(_marker);//添加标注
                _marker = null;  //减少引用数，减少内存占用
            }
        }
    },
    mounted () {
        this.init();
    },
    beforeMount () {
        let that = this;
        $$EventBus.$on("mapRectangle",function(data){
            that.mapRectangle.call(that,data)
        });
    }
}
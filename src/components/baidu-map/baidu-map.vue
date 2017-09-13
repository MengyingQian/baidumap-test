<template>
    <div id="baiduMap"></div>
</template>

<script>
import $$EventBus from "../../script/EventBus.js"
import $$model from "../../script/model.js"

export default {
    data () {
        return {
            map: {}
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
        }
    },
    mounted () {
        this.init();
    },
    beforeMount () {
        $$EventBus.$on("mapRectangle",function(params){
            $$model.aggregate(params,function(data){
                console.log("Response",data)
            })
        });
    }
}
</script>
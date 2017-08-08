<template>
    <div id="baiduMap"></div>
</template>

<script>
export default {
    data () {
        return {
            map: {}
        }
    },
    computed: {},
    watch: {},
    methods: {
        //初始化地图
        init (state) {
            var self = this;
            /*地图显示设置*/
            var _map = new BMap.Map("baiduMap",{enableMapClick:false});
            var point = new BMap.Point(106.76355,26.634111);
            _map.centerAndZoom(point, 15);
            _map.enableScrollWheelZoom(true);
            var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); 
            //右上角，添加默认缩放平移控件     
            _map.addControl(top_right_navigation);
            //改变地图显示区域会有两种操作，平移与缩放
            //地图移动时改变时获取范围
            _map.addEventListener('moveend', self.getBoundArea);
            //地图缩放级别改变时获取显示范围
            _map.addEventListener('zoomend', self.getBoundArea);
            this.map = _map;
        },
        //清除所有标记
        remove_overlay (state){
            state.map.clearOverlays();        
        },
        getBoundArea () {
            //可以考虑函数节流
            this.$store.commit('setBounds',this.map.getBounds())
        }
    },
    mounted () {
        this.init()
    },
}
</script>
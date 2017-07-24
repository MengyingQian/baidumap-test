<template>
    <div id="baiduMap"></div>
</template>

<script>
    export default {
        data () {
            return {
                map: null,
                mapBS: null
            }
        },
        computed: {

        },
        watch: {
            mapBS: function (newVal) {
                console.log(newVal);
            }
        },
        methods: {
            init () {
                /*地图显示设置*/
                this.map = new BMap.Map("baiduMap",{enableMapClick:false});
                var point = new BMap.Point(106.76355,26.634111);
                this.map.centerAndZoom(point, 15);
                this.map.enableScrollWheelZoom(true);
                var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); 
                //右上角，添加默认缩放平移控件     
                this.map.addControl(top_right_navigation);
            }
        },
        mounted () {
            this.init();
        }
    }
</script>
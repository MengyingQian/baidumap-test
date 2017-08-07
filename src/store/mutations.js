import Vue from 'vue'

export default {
    //初始化地图
    init (state) {
        /*地图显示设置*/
        var _map = new BMap.Map("baiduMap",{enableMapClick:false});
        var point = new BMap.Point(106.76355,26.634111);
        _map.centerAndZoom(point, 15);
        _map.enableScrollWheelZoom(true);
        var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); 
        //右上角，添加默认缩放平移控件     
        _map.addControl(top_right_navigation);
        console.log("state",state)
        console.log("_map",_map)
        // console.log(Object.keys(state.map))
        // for (var key in _map) {
        //     for (var i in key) {

        //     }
        //     // console.log(i)
        //     // // debugger;
        //     // Vue.set(state.map, i, _map[i]);
        // }
        state.map = JSON.parse(JSON.stringify(_map));
        console.log(state.map);
        // debugger;
        state.count = {a: 123};

    },
    test () {
        console.log('123')
    },
    //清除所有标记
    remove_overlay (state){
        state.map.clearOverlays();        
    }
}
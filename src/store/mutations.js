import Vue from 'vue'

export default {
    //设置地图显示区域
    setBounds (state,bounds) {
        state.bounds = bounds
    },
    // 设置地图缩放等级
    setZoom (state,zoom) {
        state.zoom = zoom
    },
    //更改查询数据
    storeSearchData (state,data) {
        state.searchData = data;
    },
    //更改查询数据
    storeSearchParams (state,data) {
        state.searchParams = data;
    }
}
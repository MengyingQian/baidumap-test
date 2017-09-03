import Vue from 'vue'

export default {
    //设置显示区域
    setBounds (state,bounds) {
        state.bounds = bounds
    },
    //设置是否重置地图
    clearMap (state,param) {
        state.clearMap = param == true;
    },
    //设置是否显示弹窗
    setShowTab (state,param) {
        state.showTab = param == true;
    }
}
import proxy from "./proxy.js"

var model = {
    getRectangleInfo (params,fn) {
        proxy("getRectangleInfo",params,fn);
    },
    getCoverageInfo (params,fn) {
        proxy("getCoverageInfo",params,fn);
    },
    getInterferenceInfo (params,fn) {
        proxy("getInterferenceInfo",params,fn);
    },
    getResoureceRateInfo (params,fn) {
        proxy("getResoureceRateInfo",params,fn);
    },
    getNetworkLayoutInfo (params,fn) {
        proxy("getNetworkLayoutInfo",params,fn);
    },
}
export default model
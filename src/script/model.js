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
    }
}
export default model
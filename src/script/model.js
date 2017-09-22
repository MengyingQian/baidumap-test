import proxy from "./proxy.js"

var model = {
    getRectangleInfo (params,fn) {
        proxy("getRectangleInfo",params,fn);
    }
    getCoverageInfo (params,fn) {
        proxy("getCoverageInfo",params,fn);
    }
}
export default model
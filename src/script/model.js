import proxy from "./proxy.js"

var model = {
    getRectangleInfo (params,fn) {
        proxy("getRectangleInfo",params,fn);
    }
}
export default model
import proxy from "./proxy.js"

var model = {
    aggregate (params,fn) {
        proxy("aggregate",params,fn);
    }
}
export default model
function getPoxy (type,params,fn) {
    var result;
    switch (type) {
        case "getRectangleInfo":
            result = require("./proxy/getRectangleInfo.js");
            break;
        case "getCoverageInfo":
            result = require("./proxy/getCoverageInfo.js");
            break;
    }
    result(params,fn);
}
export default getPoxy;